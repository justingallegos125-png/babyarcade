
export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  category: GameCategory;
  tags: string[];
}

export enum GameCategory {
  ACTION = 'Action',
  PUZZLE = 'Puzzle',
  RACING = 'Racing',
  STRATEGY = 'Strategy',
  SPORTS = 'Sports',
  RETRO = 'Retro'
}

export interface AppState {
  searchQuery: string;
  selectedCategory: GameCategory | 'All';
  favorites: string[];
}
