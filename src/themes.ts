
export interface Theme {
  id: string;
  name: string;
  accent: string;
  secondary: string;
  bg: string;
  font: string;
  pattern: string;
  glow: string;
}

export const THEMES: Theme[] = [
  {
    id: 'brutalist',
    name: 'Brutalist Green',
    accent: '#00ff00',
    secondary: '#000000',
    bg: '#ffffff',
    font: "'Bungee', cursive",
    glow: 'rgba(0, 255, 0, 0.3)',
    pattern: 'linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)'
  },
  {
    id: 'magazine',
    name: 'Editorial Red',
    accent: '#ff4444',
    secondary: '#1a1a1a',
    bg: '#f5f5f5',
    font: "'Orbitron', sans-serif",
    glow: 'rgba(255, 68, 68, 0.2)',
    pattern: 'none'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    accent: '#ff00ff',
    secondary: '#00ffff',
    bg: '#0d0221',
    font: "'Permanent Marker', cursive",
    glow: 'rgba(255, 0, 255, 0.5)',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 0, 255, 0.03) 1px, rgba(255, 0, 255, 0.03) 2px)'
  },
  {
    id: 'matrix',
    name: 'Digital Rain',
    accent: '#00ff41',
    secondary: '#008f11',
    bg: '#000000',
    font: "'VT323', monospace",
    glow: 'rgba(0, 255, 65, 0.5)',
    pattern: 'radial-gradient(circle, rgba(0, 255, 65, 0.05) 1px, transparent 1px)'
  },
  {
    id: 'retro-red',
    name: 'Virtual Boy',
    accent: '#ff0000',
    secondary: '#880000',
    bg: '#000000',
    font: "'Press Start 2P', cursive",
    glow: 'rgba(255, 0, 0, 0.5)',
    pattern: 'linear-gradient(rgba(255, 0, 0, 0.05) 50%, transparent 50%)'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    accent: '#ff71ce',
    secondary: '#b967ff',
    bg: '#241734',
    font: "'Orbitron', sans-serif",
    glow: 'rgba(255, 113, 206, 0.5)',
    pattern: 'linear-gradient(90deg, rgba(255, 113, 206, 0.05) 1px, transparent 1px), linear-gradient(rgba(255, 113, 206, 0.05) 1px, transparent 1px)'
  },
  {
    id: 'classic-arcade',
    name: 'Classic Arcade',
    accent: '#fde047',
    secondary: '#3b82f6',
    bg: '#111827',
    font: "'Bungee', cursive",
    glow: 'rgba(253, 224, 71, 0.5)',
    pattern: 'none'
  },
  {
    id: 'stealth',
    name: 'Stealth Ops',
    accent: '#94a3b8',
    secondary: '#475569',
    bg: '#0f172a',
    font: "'Inter', sans-serif",
    glow: 'rgba(148, 163, 184, 0.3)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.01) 10px, rgba(255, 255, 255, 0.01) 20px)'
  }
];

export const FONTS = [
  { name: 'Graffiti', value: "'Permanent Marker', cursive" },
  { name: 'Retro', value: "'Press Start 2P', cursive" },
  { name: 'Sci-Fi', value: "'Orbitron', sans-serif" },
  { name: 'Terminal', value: "'VT323', monospace" },
  { name: 'Pixel', value: "'Silkscreen', cursive" },
  { name: 'Bold', value: "'Bungee', cursive" },
  { name: 'Modern', value: "'Inter', sans-serif" }
];

export const PATTERNS = [
  { name: 'Scanlines', value: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px)' },
  { name: 'Grid', value: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)' },
  { name: 'Dots', value: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)' },
  { name: 'Diagonal', value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.01) 10px, rgba(255, 255, 255, 0.01) 20px)' },
  { name: 'None', value: 'none' }
];
