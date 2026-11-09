import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';

const { width, height } = Dimensions.get('window');

// Fruit Types Definition
const FRUIT_TYPES = [
  {
    id: 'watermelon',
    name: 'Watermelon',
    leftHalf: '🍉',
    rightHalf: '🍉',
    emoji: '🍉',
    points: 10,
    color: Colorcodes.Watermelon,
    radius: 38,
  },
  {
    id: 'orange',
    name: 'Orange',
    leftHalf: '🍊',
    rightHalf: '🍊',
    emoji: '🍊',
    points: 10,
    color: Colorcodes.Orange,
    radius: 34,
  },
  {
    id: 'apple',
    name: 'Apple',
    leftHalf: '🍎',
    rightHalf: '🍎',
    emoji: '🍎',
    points: 15,
    color: Colorcodes.Apple,
    radius: 34,
  },
  {
    id: 'banana',
    name: 'Banana',
    leftHalf: '🍌',
    rightHalf: '🍌',
    emoji: '🍌',
    points: 15,
    color: Colorcodes.Banana,
    radius: 36,
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    leftHalf: '🍓',
    rightHalf: '🍓',
    emoji: '🍓',
    points: 20,
    color: Colorcodes.Strawberry,
    radius: 30,
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    leftHalf: '🍍',
    rightHalf: '🍍',
    emoji: '🍍',
    points: 25,
    color: Colorcodes.Pineapple,
    radius: 42,
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    leftHalf: '🥝',
    rightHalf: '🥝',
    emoji: '🥝',
    points: 20,
    color: Colorcodes.Kiwi,
    radius: 32,
  },
];

const BOMB_TYPE = {
  id: 'bomb',
  name: 'Bomb',
  emoji: '💣',
  radius: 34,
  color: Colorcodes.BombGlow,
};

const FruitCuttingScreen = ({ navigation, onNavigate }) => {
  // Game States
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1840);
  const [lives, setLives] = useState(3);
  const [slicedCount, setSlicedCount] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(SoundManager.isSoundEnabled());

  // Visual effects states
  const [bladeTrail, setBladeTrail] = useState([]);
  const [activeFruits, setActiveFruits] = useState([]);
  const [splashParticles, setSplashParticles] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const [comboBanner, setComboBanner] = useState(null);

  // Screen flash for bombs
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Refs for real-time physics loop to avoid lag
  const fruitsRef = useRef([]);
  const particlesRef = useRef([]);
  const popupsRef = useRef([]);
  const animFrameId = useRef(null);
  const spawnTimerRef = useRef(null);
  const currentSwipeFruitsRef = useRef(0);
  const lastSwipeTimeRef = useRef(0);
  const isPlayingRef = useRef(true);

  // Distance formula for slice detection
  const checkLinePointIntersection = (p1, p2, circle, radius) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) {
      const dist = Math.hypot(p1.x - circle.x, p1.y - circle.y);
      return dist <= radius;
    }

    // Projection scalar t of circle onto segment p1-p2
    let t = ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    const dist = Math.hypot(circle.x - projX, circle.y - projY);

    return dist <= radius;
  };

  // Trigger screen flash when bomb is cut
  const triggerBombFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 0.65,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Pan Responder for Real-time Blade Slicing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        if (!isPlayingRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        currentSwipeFruitsRef.current = 0;
        setBladeTrail([{ x: locationX, y: locationY, id: Date.now() }]);
        SoundManager.playSwoosh();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isPlayingRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY, id: Date.now() + Math.random() };

        // Keep last 8 points for blade trail
        setBladeTrail(prev => {
          const nextTrail = [...prev.slice(-7), newPoint];
          return nextTrail;
        });

        // Swoosh sound on swift motion
        const speed = Math.hypot(gestureState.vx, gestureState.vy);
        const now = Date.now();
        if (speed > 1.2 && now - lastSwipeTimeRef.current > 280) {
          SoundManager.playSwoosh();
          lastSwipeTimeRef.current = now;
        }

        // Check intersection with all unsliced fruits
        fruitsRef.current.forEach(fruit => {
          if (!fruit.isSliced) {
            const hit = checkLinePointIntersection(
              { x: locationX - gestureState.dx * 0.4, y: locationY - gestureState.dy * 0.4 },
              { x: locationX, y: locationY },
              { x: fruit.x, y: fruit.y },
              fruit.radius * 1.2
            );

            if (hit) {
              handleSliceFruit(fruit, locationX, locationY);
            }
          }
        });
      },
      onPanResponderRelease: () => {
        // Multi-fruit Combo check
        const swipeCount = currentSwipeFruitsRef.current;
        if (swipeCount >= 2) {
          const bonus = swipeCount * 15;
          setScore(s => s + bonus);
          setMaxCombo(m => Math.max(m, swipeCount));
          SoundManager.playCombo(swipeCount);

          // Show Combo Banner
          const comboTitle =
            swipeCount === 2
              ? 'DOUBLE SLICE! +20'
              : swipeCount === 3
              ? 'TRIPLE DOJO SLICE! +50'
              : `DOJO FRENZY x${swipeCount}! +${bonus}`;

          setComboBanner({ text: comboTitle, id: Date.now() });
          setTimeout(() => setComboBanner(null), 1200);
        }

        currentSwipeFruitsRef.current = 0;
        setTimeout(() => setBladeTrail([]), 120);
      },
    })
  ).current;

  // Handle fruit slicing event
  const handleSliceFruit = (fruit, hitX, hitY) => {
    fruit.isSliced = true;

    if (fruit.isBomb) {
      // BOMB SLICED!
      SoundManager.playBomb();
      triggerBombFlash();

      setLives(prevLives => {
        const next = prevLives - 1;
        if (next <= 0) {
          handleGameOver();
        }
        return Math.max(0, next);
      });
      return;
    }

    // FRUIT SLICED!
    currentSwipeFruitsRef.current += 1;
    SoundManager.playSlice(currentSwipeFruitsRef.current);

    setScore(s => {
      const nextScore = s + fruit.points;
      if (nextScore > highScore) setHighScore(nextScore);
      return nextScore;
    });
    setSlicedCount(c => c + 1);

    // Create Splitting Halves
    fruit.leftHalf = {
      x: fruit.x - 12,
      y: fruit.y,
      vx: -4.5 + (Math.random() * -2),
      vy: fruit.vy * 0.6,
      rot: fruit.rotation,
      rotSpeed: -8,
    };
    fruit.rightHalf = {
      x: fruit.x + 12,
      y: fruit.y,
      vx: 4.5 + (Math.random() * 2),
      vy: fruit.vy * 0.6,
      rot: fruit.rotation,
      rotSpeed: 8,
    };

    // Splash splatter particles
    const newParticles = [];
    for (let i = 0; i < 9; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x: hitX || fruit.x,
        y: hitY || fruit.y,
        vx: (Math.random() - 0.5) * 11,
        vy: (Math.random() - 0.5) * 11 - 2,
        color: fruit.color,
        size: Math.random() * 8 + 4,
        alpha: 1,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Floating Score Popup
    const popupId = Math.random().toString();
    const newPopup = {
      id: popupId,
      x: hitX || fruit.x,
      y: (hitY || fruit.y) - 25,
      text: `+${fruit.points}`,
      color: fruit.color,
      alpha: 1,
    };
    popupsRef.current = [...popupsRef.current, newPopup];
  };

  // Spawn random fruit or bomb
  const spawnFruitWave = useCallback(() => {
    if (!isPlayingRef.current || gameOver || isPaused) return;

    const waveSize = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per wave
    const isBombWave = Math.random() < 0.28; // ~28% chance of bomb

    for (let i = 0; i < waveSize; i++) {
      const isBomb = isBombWave && i === 0;
      const baseType = isBomb
        ? BOMB_TYPE
        : FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

      const spawnX = Math.random() * (width - 120) + 60;
      const targetVx = (width / 2 - spawnX) * 0.015 + (Math.random() - 0.5) * 2.8;
      const targetVy = -(Math.random() * 4.5 + 15); // strong upward toss

      const newFruit = {
        ...baseType,
        uniqueId: Math.random().toString(),
        x: spawnX,
        y: height + 30,
        vx: targetVx,
        vy: targetVy,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 6,
        isSliced: false,
        isBomb: isBomb,
      };

      fruitsRef.current.push(newFruit);
    }
  }, [gameOver, isPaused]);

  // Main 60fps Game Loop
  useEffect(() => {
    const loop = () => {

      if (isPlayingRef.current && !isPaused && !gameOver) {
        // 1. Update Fruits
        const remainingFruits = [];
        fruitsRef.current.forEach(f => {
          if (!f.isSliced) {
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.44; // gravity
            f.rotation += f.rotSpeed;

            // Missed fruit (fell off screen without being sliced)
            if (f.y > height + 60 && f.vy > 0) {
              if (!f.isBomb) {
                // Deduct life on missed fruit
                setLives(l => {
                  const nextLives = l - 1;
                  if (nextLives <= 0) handleGameOver();
                  return Math.max(0, nextLives);
                });
              }
            } else {
              remainingFruits.push(f);
            }
          } else {
            // Sliced fruit halves physics
            if (f.leftHalf && f.rightHalf) {
              f.leftHalf.x += f.leftHalf.vx;
              f.leftHalf.y += f.leftHalf.vy;
              f.leftHalf.vy += 0.5;
              f.leftHalf.rot += f.leftHalf.rotSpeed;

              f.rightHalf.x += f.rightHalf.vx;
              f.rightHalf.y += f.rightHalf.vy;
              f.rightHalf.vy += 0.5;
              f.rightHalf.rot += f.rightHalf.rotSpeed;

              if (f.leftHalf.y < height + 80 || f.rightHalf.y < height + 80) {
                remainingFruits.push(f);
              }
            }
          }
        });
        fruitsRef.current = remainingFruits;
        setActiveFruits([...remainingFruits]);

        // 2. Update Splash Particles
        const aliveParticles = [];
        particlesRef.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35;
          p.alpha -= 0.035;
          if (p.alpha > 0.05 && p.y < height + 20) {
            aliveParticles.push(p);
          }
        });
        particlesRef.current = aliveParticles;
        setSplashParticles([...aliveParticles]);

        // 3. Update Score Popups
        const alivePopups = [];
        popupsRef.current.forEach(pop => {
          pop.y -= 1.8;
          pop.alpha -= 0.03;
          if (pop.alpha > 0.05) {
            alivePopups.push(pop);
          }
        });
        popupsRef.current = alivePopups;
        setScorePopups([...alivePopups]);
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    // Spawner interval
    spawnTimerRef.current = setInterval(() => {
      spawnFruitWave();
    }, 1850);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [spawnFruitWave, isPaused, gameOver]);

  const handleGameOver = () => {
    isPlayingRef.current = false;
    SoundManager.playGameOver();
    setGameOver(true);
  };

  const restartGame = () => {
    SoundManager.playButtonClick();
    fruitsRef.current = [];
    particlesRef.current = [];
    popupsRef.current = [];
    setActiveFruits([]);
    setSplashParticles([]);
    setScorePopups([]);
    setScore(0);
    setLives(3);
    setSlicedCount(0);
    setMaxCombo(0);
    setGameOver(false);
    setIsPaused(false);
    isPlayingRef.current = true;
  };

  const goHome = () => {
    SoundManager.playButtonClick();
    isPlayingRef.current = false;
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else if (onNavigate) {
      onNavigate('DojoHome');
    }
  };

  const toggleSound = () => {
    const updated = SoundManager.toggleSound();
    setSoundEnabled(updated);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar hidden={true} />

      {/* Screen Red Flash on Bomb Detonation */}
      <Animated.View
        style={[
          styles.screenFlash,
          {
            opacity: flashAnim,
          },
        ]}
        pointerEvents="none"
      />

      {/* Background Ambience Dojo Elements */}
      <View style={styles.ambientGlow} />
      <View style={styles.ambientGlowSecondary} />

      {/* TOP HEADS UP DISPLAY (HUD) */}
      <View style={styles.hudContainer}>
        {/* Left: Score & HighScore */}
        <View style={styles.scoreHud}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.bestScoreLabel}>BEST: {highScore}</Text>
        </View>

        {/* Center: Blade Combo Multiplier / Status */}
        <View style={styles.centerStatus}>
          <View style={styles.bladePill}>
            <Text style={styles.bladeIcon}>⚔️</Text>
            <Text style={styles.bladeText}>KATANA READY</Text>
          </View>
        </View>

        {/* Right: Lives Hearts & Controls */}
        <View style={styles.rightHud}>
          <View style={styles.livesRow}>
            {[1, 2, 3].map(i => (
              <Text key={i} style={[styles.heartIcon, i > lives && styles.lostHeart]}>
                ❤️
              </Text>
            ))}
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.hudIconBtn}
              onPress={toggleSound}
              activeOpacity={0.7}
            >
              <Text style={styles.hudIconText}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hudIconBtn}
              onPress={() => setIsPaused(p => !p)}
              activeOpacity={0.7}
            >
              <Text style={styles.hudIconText}>{isPaused ? '▶️' : '⏸️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hudIconBtn}
              onPress={goHome}
              activeOpacity={0.7}
            >
              <Text style={styles.hudIconText}>✖️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* COMBO BANNER NOTIFICATION */}
      {comboBanner && (
        <View style={styles.comboBannerContainer} pointerEvents="none">
          <Text style={styles.comboBannerText}>{comboBanner.text}</Text>
        </View>
      )}

      {/* FRUITS & BOMBS RENDERING */}
      {activeFruits.map(fruit => {
        if (!fruit.isSliced) {
          return (
            <View
              key={fruit.uniqueId}
              style={[
                styles.fruitItem,
                {
                  transform: [
                    { translateX: fruit.x - fruit.radius },
                    { translateY: fruit.y - fruit.radius },
                    { rotate: `${fruit.rotation}deg` },
                  ],
                },
              ]}
              pointerEvents="none"
            >
              <Text style={{ fontSize: fruit.radius * 1.5 }}>{fruit.emoji}</Text>
              {fruit.isBomb && <View style={styles.bombFuseGlow} />}
            </View>
          );
        } else if (fruit.leftHalf && fruit.rightHalf) {
          // Render Splitting Halves
          return (
            <React.Fragment key={fruit.uniqueId}>
              {/* Left Half */}
              <View
                style={[
                  styles.fruitItem,
                  {
                    transform: [
                      { translateX: fruit.leftHalf.x - fruit.radius },
                      { translateY: fruit.leftHalf.y - fruit.radius },
                      { rotate: `${fruit.leftHalf.rot}deg` },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={{ fontSize: fruit.radius * 1.3 }}>{fruit.emoji}</Text>
              </View>

              {/* Right Half */}
              <View
                style={[
                  styles.fruitItem,
                  {
                    transform: [
                      { translateX: fruit.rightHalf.x - fruit.radius },
                      { translateY: fruit.rightHalf.y - fruit.radius },
                      { rotate: `${fruit.rightHalf.rot}deg` },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={{ fontSize: fruit.radius * 1.3 }}>{fruit.emoji}</Text>
              </View>
            </React.Fragment>
          );
        }
        return null;
      })}

      {/* SPLASH PARTICLES */}
      {splashParticles.map(p => (
        <View
          key={p.id}
          style={[
            styles.splashDot,
            {
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity: p.alpha,
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
          pointerEvents="none"
        />
      ))}

      {/* FLOATING SCORE POPUPS */}
      {scorePopups.map(pop => (
        <View
          key={pop.id}
          style={[
            styles.scorePopup,
            {
              opacity: pop.alpha,
              transform: [{ translateX: pop.x }, { translateY: pop.y }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.scorePopupText, { color: pop.color }]}>{pop.text}</Text>
        </View>
      ))}

      {/* GLOWING KATANA BLADE TRAIL */}
      {bladeTrail.map((pt, idx) => {
        if (idx === 0) return null;
        const prev = bladeTrail[idx - 1];
        const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
        const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
        const opacity = (idx / bladeTrail.length) * 0.9;

        return (
          <View
            key={pt.id || idx}
            style={[
              styles.bladeTrailSegment,
              {
                width: dist + 2,
                opacity: opacity,
                transform: [
                  { translateX: prev.x },
                  { translateY: prev.y },
                  { rotate: `${angle}rad` },
                ],
              },
            ]}
            pointerEvents="none"
          />
        );
      })}

      {/* IN-GAME PAUSE MODAL */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>GAME PAUSED</Text>
            <Text style={styles.modalSub}>Take a breath, Sensei!</Text>

            <TouchableOpacity
              style={styles.modalBtnPrimary}
              activeOpacity={0.8}
              onPress={() => setIsPaused(false)}
            >
              <Text style={styles.modalBtnTextPrimary}>RESUME SLICING</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnSecondary}
              activeOpacity={0.8}
              onPress={restartGame}
            >
              <Text style={styles.modalBtnTextSecondary}>RESTART</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnOutline}
              activeOpacity={0.8}
              onPress={goHome}
            >
              <Text style={styles.modalBtnTextOutline}>EXIT TO DOJO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* GAME OVER MODAL */}
      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.gameOverBadge}>
              <Text style={styles.gameOverBadgeText}>⚔️ DOJO RUN COMPLETED</Text>
            </View>

            <Text style={styles.gameOverTitle}>GAME OVER</Text>

            {/* Score Showcase */}
            <View style={styles.modalScoreBox}>
              <Text style={styles.modalScoreLabel}>FINAL SCORE</Text>
              <Text style={styles.modalScoreValue}>{score}</Text>
              {score >= highScore && score > 0 && (
                <Text style={styles.newHighScoreBadge}>🏆 NEW HIGH SCORE!</Text>
              )}
            </View>

            {/* Stats Row */}
            <View style={styles.modalStatsRow}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>SLICED</Text>
                <Text style={styles.modalStatNum}>{slicedCount} 🍉</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>MAX COMBO</Text>
                <Text style={[styles.modalStatNum, { color: Colorcodes.Secondary }]}>
                  {maxCombo}x 🔥
                </Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>COINS</Text>
                <Text style={[styles.modalStatNum, { color: Colorcodes.Gold }]}>
                  +{Math.floor(score * 0.15)} 🪙
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.modalBtnPrimary}
              activeOpacity={0.85}
              onPress={restartGame}
            >
              <Text style={styles.modalBtnTextPrimary}>🗡️ PLAY AGAIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnOutline}
              activeOpacity={0.8}
              onPress={goHome}
            >
              <Text style={styles.modalBtnTextOutline}>RETURN TO DOJO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FruitCuttingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colorcodes.DojoDark,
  },
  screenFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colorcodes.BombGlow,
    zIndex: 99,
  },
  ambientGlow: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 46, 99, 0.1)',
  },
  ambientGlowSecondary: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 245, 155, 0.08)',
  },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    zIndex: 10,
  },
  scoreHud: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreNumber: {
    color: Colorcodes.White,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  bestScoreLabel: {
    color: Colorcodes.Gold,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  centerStatus: {
    alignItems: 'center',
    paddingTop: 6,
  },
  bladePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colorcodes.DojoCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  bladeIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  bladeText: {
    color: Colorcodes.Secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  rightHud: {
    alignItems: 'flex-end',
  },
  livesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  heartIcon: {
    fontSize: 18,
    marginLeft: 3,
  },
  lostHeart: {
    opacity: 0.25,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hudIconBtn: {
    backgroundColor: Colorcodes.DojoCard,
    padding: 6,
    borderRadius: 8,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  hudIconText: {
    fontSize: 13,
  },
  comboBannerContainer: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 46, 99, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colorcodes.White,
    shadowColor: Colorcodes.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 20,
  },
  comboBannerText: {
    color: Colorcodes.White,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  fruitItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  bombFuseGlow: {
    position: 'absolute',
    top: 2,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  splashDot: {
    position: 'absolute',
    zIndex: 4,
  },
  scorePopup: {
    position: 'absolute',
    zIndex: 15,
  },
  scorePopupText: {
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bladeTrailSegment: {
    position: 'absolute',
    height: 5,
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 3,
    transformOrigin: '0% 50%',
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 8, 20, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colorcodes.DojoBorderGlow,
    shadowColor: Colorcodes.Primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    color: Colorcodes.White,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  modalSub: {
    color: Colorcodes.TextMuted,
    fontSize: 13,
    marginVertical: 12,
  },
  gameOverBadge: {
    backgroundColor: 'rgba(255, 46, 99, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colorcodes.Primary,
    marginBottom: 6,
  },
  gameOverBadgeText: {
    color: Colorcodes.PrimaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  gameOverTitle: {
    color: Colorcodes.White,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 14,
  },
  modalScoreBox: {
    alignItems: 'center',
    backgroundColor: Colorcodes.DojoCard,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 16,
  },
  modalScoreLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  modalScoreValue: {
    color: Colorcodes.Gold,
    fontSize: 42,
    fontWeight: '900',
  },
  newHighScoreBadge: {
    color: Colorcodes.Secondary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  modalStatsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colorcodes.DojoBorder,
  },
  modalStatLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalStatNum: {
    color: Colorcodes.White,
    fontSize: 14,
    fontWeight: '800',
  },
  modalBtnPrimary: {
    width: '100%',
    backgroundColor: Colorcodes.Secondary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colorcodes.SecondaryLight,
  },
  modalBtnTextPrimary: {
    color: Colorcodes.DojoDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalBtnSecondary: {
    width: '100%',
    backgroundColor: Colorcodes.Primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBtnTextSecondary: {
    color: Colorcodes.White,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalBtnOutline: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  modalBtnTextOutline: {
    color: Colorcodes.TextSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
