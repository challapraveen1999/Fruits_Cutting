import Colorcodes from '../Helpers/Colorcodes.json';

export const GAME_MODES = {
  CLASSIC: {
    id: 'CLASSIC',
    title: 'Classic Mode',
    icon: '🍉',
    description: '3 Lives. Slice all fruits, avoid bombs!',
    hasBombs: true,
    hasLives: true,
    maxLives: 3,
    hasTimer: false,
    color: Colorcodes.Primary,
  },
  ZEN: {
    id: 'ZEN',
    title: 'Zen Mode (Kids)',
    icon: '⏱️',
    description: 'No bombs, no lives lost! 60s of pure slicing joy.',
    hasBombs: false,
    hasLives: false,
    maxLives: 0,
    hasTimer: true,
    timerSeconds: 60,
    color: Colorcodes.Secondary,
  },
  FRENZY: {
    id: 'FRENZY',
    title: 'Frenzy Arcade',
    icon: '⚡',
    description: 'Rapid fruit rain & special powerup slicing!',
    hasBombs: true,
    hasLives: true,
    maxLives: 3,
    hasTimer: true,
    timerSeconds: 90,
    color: Colorcodes.Tertiary,
  },
};

export const FRUIT_DICTIONARY = [
  {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    points: 10,
    color: '#FF2E63',
    innerColor: '#FF5277',
    radius: 40,
    weight: 1.0,
  },
  {
    id: 'orange',
    name: 'Orange',
    emoji: '🍊',
    points: 10,
    color: '#FF9500',
    innerColor: '#FFB340',
    radius: 35,
    weight: 1.0,
  },
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    points: 15,
    color: '#FF3B30',
    innerColor: '#FFF8E7',
    radius: 35,
    weight: 0.9,
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    points: 15,
    color: '#FFD60A',
    innerColor: '#FFFDE0',
    radius: 36,
    weight: 0.85,
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    points: 20,
    color: '#FF2D55',
    innerColor: '#FFA4B6',
    radius: 32,
    weight: 0.8,
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    emoji: '🍍',
    points: 25,
    color: '#FFCC00',
    innerColor: '#FFE57F',
    radius: 44,
    weight: 1.1,
  },
  {
    id: 'grapes',
    name: 'Grapes',
    emoji: '🍇',
    points: 20,
    color: '#9C27B0',
    innerColor: '#CE93D8',
    radius: 34,
    weight: 0.8,
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    emoji: '🥝',
    points: 20,
    color: '#78C800',
    innerColor: '#A0E040',
    radius: 32,
    weight: 0.8,
  },
];

export const BOMB_CONFIG = {
  id: 'bomb',
  name: 'Bomb',
  emoji: '💣',
  color: '#FF1E56',
  radius: 34,
  spawnChance: 0.22, // 22% chance in Classic
};

export const BLADE_STYLES = [
  { id: 'mint', name: 'Cyber Mint', color: '#00F59B', glow: 'rgba(0, 245, 155, 0.6)' },
  { id: 'ruby', name: 'Sakura Ruby', color: '#FF2E63', glow: 'rgba(255, 46, 99, 0.6)' },
  { id: 'gold', name: 'Solar Gold', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)' },
  { id: 'cyan', name: 'Ice Blade', color: '#00D4FF', glow: 'rgba(0, 212, 255, 0.6)' },
];

export const PHYSICS_CONFIG = {
  gravity: 0.44,
  minUpwardVelocity: 15,
  maxUpwardVelocity: 19.5,
  sliceParticleCount: 8,
  bladeTrailLength: 7,
};

