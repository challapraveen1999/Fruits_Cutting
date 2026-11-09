import SliceDetection from './SliceDetection';

export class CollisionDetection {
  /**
   * Find all unsliced fruits cut by the current swipe segment
   */
  static findSlicedFruits(p1, p2, fruits, kidFriendlyMode = true) {
    const hitboxScale = kidFriendlyMode ? 1.35 : 1.15;
    const hits = [];

    fruits.forEach(fruit => {
      if (!fruit.isSliced) {
        if (SliceDetection.isIntersecting(p1, p2, fruit, hitboxScale)) {
          hits.push(fruit);
        }
      }
    });

    return hits;
  }

  /**
   * Check if a point is within a circular area
   */
  static isPointInCircle(point, circle, radius) {
    const dist = Math.hypot(point.x - circle.x, point.y - circle.y);
    return dist <= radius;
  }
}

export default CollisionDetection;

