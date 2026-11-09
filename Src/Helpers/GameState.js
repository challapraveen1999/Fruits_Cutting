import { BLADE_STYLES } from '../game/GameConfig';

class GameState {
  constructor() {
    this.highScore = 2410;
    this.coins = 1840;
    this.gems = 74;
    this.selectedBlade = BLADE_STYLES[0]; // Cyber Mint default
    this.kidFriendly = true;
  }

  getBlade() {
    return this.selectedBlade;
  }

  setBlade(bladeId) {
    const found = BLADE_STYLES.find(b => b.id === bladeId);
    if (found) {
      this.selectedBlade = found;
    }
  }

  isKidFriendly() {
    return this.kidFriendly;
  }

  setKidFriendly(val) {
    this.kidFriendly = val;
  }

  recordScore(newScore) {
    if (newScore > this.highScore) {
      this.highScore = newScore;
      return true;
    }
    return false;
  }

  getHighScore() {
    return this.highScore;
  }
}

const gameStateInstance = new GameState();
export default gameStateInstance;

