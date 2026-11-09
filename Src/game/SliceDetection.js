export class SliceDetection {
  /**
   * Check if line segment (p1 -> p2) intersects with circle (fruit)
   * Includes generous hitbox for kids to ensure smooth, joyful slicing.
   */
  static isIntersecting(p1, p2, fruit, hitboxMultiplier = 1.25) {
    if (!p1 || !p2 || !fruit) return false;

    const radius = fruit.radius * hitboxMultiplier;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    // Single point touch check
    if (lenSq === 0) {
      const dist = Math.hypot(p1.x - fruit.x, p1.y - fruit.y);
      return dist <= radius;
    }

    // Projection factor t along the line segment [0, 1]
    let t = ((fruit.x - p1.x) * dx + (fruit.y - p1.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    const dist = Math.hypot(fruit.x - projX, fruit.y - projY);

    return dist <= radius;
  }
}

export default SliceDetection;

