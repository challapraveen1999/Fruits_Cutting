export class ScoreManager {
  static calculateComboBonus(count) {
    if (count <= 1) return 0;
    if (count === 2) return 20; // Double Slice
    if (count === 3) return 50; // Triple Slice
    return count * 25; // Mega / Frenzy Slice
  }

  static getComboTitle(count) {
    if (count === 2) return 'DOUBLE SLICE! +20';
    if (count === 3) return 'TRIPLE SLICE! +50';
    if (count >= 4) return `FRENZY x${count}! +${count * 25}`;
    return null;
  }

  static calculateStars(score) {
    if (score >= 2500) return 3;
    if (score >= 1200) return 2;
    if (score >= 400) return 1;
    return 1;
  }

  static calculateRank(score) {
    if (score >= 3000) return 'S';
    if (score >= 2000) return 'A';
    if (score >= 1000) return 'B';
    return 'C';
  }

  static calculateBounty(score, slicedCount) {
    return {
      goldSeeds: Math.floor(score * 0.12) + slicedCount * 2,
      dojoXp: Math.floor(score * 0.05) + 10,
      sakuraShards: score > 2000 ? 3 : score > 1000 ? 2 : 1,
    };
  }
}

export default ScoreManager;

