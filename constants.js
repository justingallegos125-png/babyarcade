
import { GameCategory } from './types.js';

export const GAMES = [
  {
    id: '2048',
    title: '2048',
    description: 'The classic number puzzle game. Join the tiles and get to 2048!',
    thumbnail: 'https://picsum.photos/seed/2048/400/250',
    iframeUrl: 'https://play2048.co/',
    category: GameCategory.PUZZLE,
    tags: ['puzzle', 'numbers', 'classic']
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate the bird through the pipes. How far can you go?',
    thumbnail: 'https://picsum.photos/seed/flappy/400/250',
    iframeUrl: 'https://flappybird.io/',
    category: GameCategory.ACTION,
    tags: ['action', 'skill', 'retro']
  },
  {
    id: 'snake-retro',
    title: 'Retro Snake',
    description: 'The original mobile gaming addiction. Eat blocks, grow long.',
    thumbnail: 'https://picsum.photos/seed/snake/400/250',
    iframeUrl: 'https://snake.io/',
    category: GameCategory.RETRO,
    tags: ['retro', 'classic', 'snake']
  },
  {
    id: 'cut-the-rope',
    title: 'Cut The Rope',
    description: 'Feed Om Nom candy by cutting ropes and solving physics puzzles.',
    thumbnail: 'https://picsum.photos/seed/omnom/400/250',
    iframeUrl: 'https://games.softgames.com/games/cut-the-rope/en/',
    category: GameCategory.PUZZLE,
    tags: ['puzzle', 'physics', 'fun']
  },
  {
    id: 'tetris-web',
    title: 'Block Puzzle',
    description: 'Arrange falling blocks into perfect horizontal lines.',
    thumbnail: 'https://picsum.photos/seed/blocks/400/250',
    iframeUrl: 'https://tetris.com/play-tetris',
    category: GameCategory.PUZZLE,
    tags: ['retro', 'puzzle']
  },
  {
    id: 'moto-x3m',
    title: 'Moto X3M',
    description: 'The ultimate bike racing game with challenging obstacles.',
    thumbnail: 'https://picsum.photos/seed/moto/400/250',
    iframeUrl: 'https://moto-x3m.io/',
    category: GameCategory.RACING,
    tags: ['racing', 'stunts', 'action']
  },
  {
    id: 'chess-web',
    title: 'Pro Chess',
    description: 'Master your strategy in this timeless game of wits.',
    thumbnail: 'https://picsum.photos/seed/chess/400/250',
    iframeUrl: 'https://www.chess.com/play/online',
    category: GameCategory.STRATEGY,
    tags: ['strategy', 'board', 'multiplayer']
  },
  {
    id: 'subway-surfers',
    title: 'Subway Surfers',
    description: 'Dash as fast as you can! Dodge the oncoming trains.',
    thumbnail: 'https://picsum.photos/seed/subway/400/250',
    iframeUrl: 'https://subwaysurfers.com/',
    category: GameCategory.ACTION,
    tags: ['action', 'runner', 'mobile']
  },
  {
    id: 'geometry-dash',
    title: 'Geometry Dash',
    description: 'Jump and fly your way through danger in this rhythm-based platformer.',
    thumbnail: 'https://picsum.photos/seed/geo/400/250',
    iframeUrl: 'https://geometrydash.io/',
    category: GameCategory.ACTION,
    tags: ['action', 'rhythm', 'skill']
  },
  {
    id: 'slither-io',
    title: 'Slither.io',
    description: 'Grow your snake by eating glowing orbs and outsmarting others.',
    thumbnail: 'https://picsum.photos/seed/slither/400/250',
    iframeUrl: 'https://slither.io/',
    category: GameCategory.ACTION,
    tags: ['multiplayer', 'snake', 'action']
  }
];

export const CATEGORIES = ['All', ...Object.values(GameCategory)];
