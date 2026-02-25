import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy endpoint
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow'
      });
      
      const contentType = response.headers.get("content-type");
      const finalUrl = response.url;
      
      // Copy headers but strip security and encoding ones
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        const securityHeaders = [
          'content-security-policy', 
          'x-frame-options', 
          'content-encoding', 
          'transfer-encoding', 
          'strict-transport-security', 
          'x-content-type-options',
          'x-xss-protection',
          'expect-ct',
          'report-to',
          'nel',
          'cross-origin-opener-policy',
          'cross-origin-embedder-policy',
          'cross-origin-resource-policy'
        ];
        if (!securityHeaders.includes(lowerKey)) {
          res.setHeader(key, value);
        }
      });
      
      // Ensure we don't send a content-length that's now wrong if we modify the body
      res.removeHeader('content-length');

      if (contentType && (contentType.includes("text/html") || contentType.includes("application/xhtml+xml"))) {
        let text = await response.text();
        // Inject a <base> tag so relative links work, using the FINAL URL after redirects
        try {
          const urlObj = new URL(finalUrl);
          const baseTag = `<base href="${urlObj.origin}${urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1)}">`;
          
          // Also try to replace absolute links to the same domain with proxy links? 
          // That might be too complex for now, but base tag helps a lot.
          
          if (text.includes("<head>")) {
            text = text.replace("<head>", `<head>${baseTag}`);
          } else if (text.includes("<html>")) {
            text = text.replace("<html>", `<html><head>${baseTag}</head>`);
          }
        } catch (e) {
          console.warn("Could not construct base tag for URL:", finalUrl);
        }
        res.send(text);
      } else {
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).send(`Proxy Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Serve index.html for all non-API routes in dev
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) return next();
      
      try {
        let template = await (await import("fs")).readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
