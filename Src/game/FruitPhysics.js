import { PHYSICS_CONFIG } from './GameConfig';

export class FruitPhysics {
  // Update airborne fruit positions and rotation
  static updateFruits(fruits, screenHeight, onFruitMissed) {
    const remaining = [];

    fruits.forEach(f => {
      if (!f.isSliced) {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += PHYSICS_CONFIG.gravity;
        f.rotation += f.rotSpeed;

        // If fell below screen after rising
        if (f.y > screenHeight + 60 && f.vy > 0) {
          if (!f.isBomb && onFruitMissed) {
            onFruitMissed(f);
          }
        } else {
          remaining.push(f);
        }
      } else {
        // Sliced 2 pieces halves physics
        if (f.leftHalf && f.rightHalf) {
          f.leftHalf.x += f.leftHalf.vx;
          f.leftHalf.y += f.leftHalf.vy;
          f.leftHalf.vy += PHYSICS_CONFIG.gravity * 1.15;
          f.leftHalf.rot += f.leftHalf.rotSpeed;

          f.rightHalf.x += f.rightHalf.vx;
          f.rightHalf.y += f.rightHalf.vy;
          f.rightHalf.vy += PHYSICS_CONFIG.gravity * 1.15;
          f.rightHalf.rot += f.rightHalf.rotSpeed;

          // Keep while at least one half is visible
          if (f.leftHalf.y < screenHeight + 90 || f.rightHalf.y < screenHeight + 90) {
            remaining.push(f);
          }
        }
      }
    });

    return remaining;
  }

  // Generate left and right half pieces when a fruit is sliced
  static createSplitHalves(fruit) {
    return {
      leftHalf: {
        x: fruit.x - 18,
        y: fruit.y,
        vx: -6.5 + (Math.random() * -2),
        vy: fruit.vy * 0.4 - 3.5,
        rot: fruit.rotation,
        rotSpeed: -12 - Math.random() * 6,
      },
      rightHalf: {
        x: fruit.x + 18,
        y: fruit.y,
        vx: 6.5 + (Math.random() * 2),
        vy: fruit.vy * 0.4 - 3.5,
        rot: fruit.rotation,
        rotSpeed: 12 + Math.random() * 6,
      },
    };
  }

  // Generate juice splash particles
  static createJuiceParticles(fruit, hitX, hitY) {
    const particles = [];
    const count = PHYSICS_CONFIG.sliceParticleCount + 4;

    for (let i = 0; i < count; i++) {
      particles.push({
        id: `${Date.now()}_${i}_${Math.random()}`,
        x: hitX || fruit.x,
        y: hitY || fruit.y,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 3,
        color: fruit.color,
        size: Math.random() * 8 + 4,
        alpha: 1.0,
      });
    }

    return particles;
  }

  // Update particles fade and downward drift
  static updateParticles(particles, screenHeight) {
    const alive = [];
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.alpha -= 0.038;

      if (p.alpha > 0.05 && p.y < screenHeight + 20) {
        alive.push(p);
      }
    });
    return alive;
  }
}

export default FruitPhysics;
