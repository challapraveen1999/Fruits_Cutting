import FruitSpawner from './FruitSpawner';
import FruitPhysics from './FruitPhysics';
import CollisionDetection from './CollisionDetection';
import ScoreManager from './ScoreManager';
import SoundManager from '../Helpers/SoundManager';
import { GAME_MODES } from './GameConfig';

export class GameEngine {
  constructor(config = {}) {
    this.screenWidth = config.screenWidth || 380;
    this.screenHeight = config.screenHeight || 700;
    this.gameMode = config.gameMode || GAME_MODES.CLASSIC;

    this.score = 0;
    this.highScore = config.highScore || 2410;
    this.lives = this.gameMode.hasLives ? this.gameMode.maxLives : 999;
    this.slicedCount = 0;
    this.maxCombo = 0;
    this.timer = this.gameMode.hasTimer ? this.gameMode.timerSeconds : 0;
    this.harvest = {
      melon: 0,
      citrus: 0,
      star: 0,
      other: 0,
    };

    this.fruits = [];
    this.particles = [];
    this.popups = [];
    this.activeSwipeCount = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.frenzyMeter = 75; // 0 to 100%

    this.onStateUpdate = config.onStateUpdate || null;
    this.onGameOver = config.onGameOver || null;
  }

  // Handle player swiping
  handleSwipe(p1, p2) {
    if (this.isGameOver || this.isPaused) return [];

    const hitFruits = CollisionDetection.findSlicedFruits(p1, p2, this.fruits, true);
    if (hitFruits.length === 0) return [];

    hitFruits.forEach(fruit => {
      fruit.isSliced = true;

      if (fruit.isBomb) {
        // Bomb Hit
        SoundManager.playBomb();
        if (this.gameMode.hasLives) {
          this.lives = Math.max(0, this.lives - 1);
          if (this.lives <= 0) {
            this.endGame(true);
          }
        }
      } else {
        // Fruit Cut
        this.slicedCount += 1;
        this.activeSwipeCount += 1;
        this.frenzyMeter = Math.min(100, this.frenzyMeter + 4);

        // Update harvest category
        if (fruit.id === 'watermelon') this.harvest.melon += 1;
        else if (fruit.id === 'orange') this.harvest.citrus += 1;
        else if (fruit.id === 'pineapple' || fruit.id === 'banana') this.harvest.star += 1;
        else this.harvest.other += 1;

        // Splitting Halves
        const halves = FruitPhysics.createSplitHalves(fruit);
        fruit.leftHalf = halves.leftHalf;
        fruit.rightHalf = halves.rightHalf;

        // Particles
        const newParticles = FruitPhysics.createJuiceParticles(fruit, p2.x, p2.y);
        this.particles.push(...newParticles);

        // Score
        const fruitPoints = fruit.points || 10;
        this.score += fruitPoints;
        if (this.score > this.highScore) this.highScore = this.score;

        // Score popup
        this.popups.push({
          id: `${Date.now()}_${Math.random()}`,
          x: p2.x,
          y: p2.y - 20,
          text: `+${fruitPoints}`,
          color: fruit.color,
          alpha: 1.0,
        });

        SoundManager.playSlice(this.activeSwipeCount);
      }
    });

    return hitFruits;
  }

  // Called when touch ends to award combo bonuses
  finishSwipe() {
    if (this.activeSwipeCount >= 2) {
      const bonus = ScoreManager.calculateComboBonus(this.activeSwipeCount);
      const title = ScoreManager.getComboTitle(this.activeSwipeCount);
      this.score += bonus;
      this.maxCombo = Math.max(this.maxCombo, this.activeSwipeCount);
      SoundManager.playCombo(this.activeSwipeCount);

      if (this.onCombo) {
        this.onCombo(title, bonus);
      }
    }
    this.activeSwipeCount = 0;
  }

  // Spawn new wave
  spawnWave() {
    if (this.isGameOver || this.isPaused) return;
    const wave = FruitSpawner.createWave(this.screenWidth, this.screenHeight, this.gameMode);
    this.fruits.push(...wave);
  }

  // 60fps Tick Loop
  tick() {
    if (this.isGameOver || this.isPaused) return;

    // Update Fruits
    this.fruits = FruitPhysics.updateFruits(
      this.fruits,
      this.screenHeight,
      (missedFruit) => {
        if (this.gameMode.hasLives && !missedFruit.isBomb) {
          this.lives = Math.max(0, this.lives - 1);
          if (this.lives <= 0) {
            this.endGame(false);
          }
        }
      }
    );

    // Update Particles
    this.particles = FruitPhysics.updateParticles(this.particles, this.screenHeight);

    // Update Popups
    const alivePopups = [];
    this.popups.forEach(pop => {
      pop.y -= 1.8;
      pop.alpha -= 0.035;
      if (pop.alpha > 0.05) alivePopups.push(pop);
    });
    this.popups = alivePopups;

    if (this.onStateUpdate) {
      this.onStateUpdate({
        fruits: this.fruits,
        particles: this.particles,
        popups: this.popups,
        score: this.score,
        lives: this.lives,
        frenzyMeter: this.frenzyMeter,
      });
    }
  }

  // Trigger game end and return summary payload
  endGame(isBombDeath = false) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    SoundManager.playGameOver();

    const resultSummary = {
      score: this.score,
      highScore: this.highScore,
      slicedCount: this.slicedCount,
      maxCombo: this.maxCombo,
      stars: ScoreManager.calculateStars(this.score),
      rank: ScoreManager.calculateRank(this.score),
      harvest: this.harvest,
      bounty: ScoreManager.calculateBounty(this.score, this.slicedCount),
      isBombDeath: isBombDeath,
      gameMode: this.gameMode,
    };

    if (this.onGameOver) {
      this.onGameOver(resultSummary);
    }
    return resultSummary;
  }
}

export default GameEngine;

