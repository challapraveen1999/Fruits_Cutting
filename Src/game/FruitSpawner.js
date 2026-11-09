import { FRUIT_DICTIONARY, BOMB_CONFIG, PHYSICS_CONFIG } from './GameConfig';

export class FruitSpawner {
  static createWave(screenWidth, screenHeight, gameMode) {
    const isZenMode = gameMode && gameMode.id === 'ZEN';
    const isFrenzy = gameMode && gameMode.id === 'FRENZY';

    // Wave size: 1-3 fruits in normal, 2-4 in frenzy
    const minFruits = isFrenzy ? 2 : 1;
    const maxFruits = isFrenzy ? 4 : 3;
    const count = Math.floor(Math.random() * (maxFruits - minFruits + 1)) + minFruits;

    const wave = [];
    const hasBombThisWave = !isZenMode && Math.random() < (isFrenzy ? 0.35 : BOMB_CONFIG.spawnChance);

    for (let i = 0; i < count; i++) {
      const isBomb = hasBombThisWave && i === 0;
      const fruitData = isBomb
        ? BOMB_CONFIG
        : FRUIT_DICTIONARY[Math.floor(Math.random() * FRUIT_DICTIONARY.length)];

      const spawnX = Math.random() * (screenWidth - 140) + 70;
      // Drift velocity towards center screen with a small jitter
      const horizontalDrift = (screenWidth / 2 - spawnX) * 0.016 + (Math.random() - 0.5) * 2.6;
      const upwardSpeed = -(
        Math.random() * (PHYSICS_CONFIG.maxUpwardVelocity - PHYSICS_CONFIG.minUpwardVelocity) +
        PHYSICS_CONFIG.minUpwardVelocity
      );

      wave.push({
        ...fruitData,
        uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        x: spawnX,
        y: screenHeight + 35,
        vx: horizontalDrift,
        vy: upwardSpeed,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        isSliced: false,
        isBomb: isBomb,
      });
    }

    return wave;
  }
}

export default FruitSpawner;

