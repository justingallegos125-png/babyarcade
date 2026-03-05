
export const GameCategory = {
  ACTION: 'Action',
  PUZZLE: 'Puzzle',
  RACING: 'Racing',
  STRATEGY: 'Strategy',
  SPORTS: 'Sports',
  RETRO: 'Retro'
};

// Define the Game interface for TypeScript type safety across the application
export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  iframeUrl: string;
  category: string;
  tags: string[];
  htmlContent?: string;
}

export interface DataPackage {
  localGames: Game[];
  favorites: string[];
}
