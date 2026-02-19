
import { GameCategory } from './types';

export const GAMES = [
  {
    id: '2048',
    title: '2048',
    description: 'The classic number puzzle game. Join the tiles and get to 2048!',
    thumbnail: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://play2048.co/',
    category: GameCategory.PUZZLE,
    tags: ['puzzle', 'numbers', 'classic']
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate the bird through the pipes. How far can you go?',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://flappybird.io/',
    category: GameCategory.ACTION,
    tags: ['action', 'skill', 'retro']
  },
  {
    id: 'snake-retro',
    title: 'Retro Snake',
    description: 'The original mobile gaming addiction. Eat blocks, grow long.',
    thumbnail: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://snake.io/',
    category: GameCategory.RETRO,
    tags: ['retro', 'classic', 'snake']
  },
  {
    id: 'cut-the-rope',
    title: 'Cut The Rope',
    description: 'Feed Om Nom candy by cutting ropes and solving physics puzzles.',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://games.softgames.com/games/cut-the-rope/en/',
    category: GameCategory.PUZZLE,
    tags: ['puzzle', 'physics', 'fun']
  },
  {
    id: 'tetris-web',
    title: 'Block Puzzle',
    description: 'Arrange falling blocks into perfect horizontal lines.',
    thumbnail: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://tetris.com/play-tetris',
    category: GameCategory.PUZZLE,
    tags: ['retro', 'puzzle']
  },
  {
    id: 'moto-x3m',
    title: 'Moto X3M',
    description: 'The ultimate bike racing game with challenging obstacles.',
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://moto-x3m.io/',
    category: GameCategory.RACING,
    tags: ['racing', 'stunts', 'action']
  },
  {
    id: 'chess-web',
    title: 'Pro Chess',
    description: 'Master your strategy in this timeless game of wits.',
    thumbnail: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://www.chess.com/play/online',
    category: GameCategory.STRATEGY,
    tags: ['strategy', 'board', 'multiplayer']
  },
  {
    id: 'subway-surfers',
    title: 'Subway Surfers',
    description: 'Dash as fast as you can! Dodge the oncoming trains.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://subwaysurfers.com/',
    category: GameCategory.ACTION,
    tags: ['action', 'runner', 'mobile']
  },
  {
    id: 'geometry-dash',
    title: 'Geometry Dash',
    description: 'Jump and fly your way through danger in rhythm-based action.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://geometrydash.io/',
    category: GameCategory.ACTION,
    tags: ['action', 'rhythm', 'skill']
  },
  {
    id: 'slither-io',
    title: 'Slither.io',
    description: 'Grow your snake and outsmart other players.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=250&auto=format&fit=crop',
    iframeUrl: 'https://slither.io/',
    category: GameCategory.ACTION,
    tags: ['multiplayer', 'snake', 'action']
  }
];

export const CATEGORIES = ['All', ...Object.values(GameCategory)];
