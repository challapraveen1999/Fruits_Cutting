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
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';
import GameEngine from '../game/GameEngine';
import GameState from '../Helpers/GameState';
import { GAME_MODES } from '../game/GameConfig';

const { width, height } = Dimensions.get('window');

const GameScreen = ({ navigation, route }) => {
  const gameMode = (route && route.params && route.params.gameMode) || GAME_MODES.CLASSIC;
  const activeBlade = GameState.getBlade() || { color: Colorcodes.Secondary };

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(gameMode.hasLives ? gameMode.maxLives : 3);
  const [frenzyMeter, setFrenzyMeter] = useState(85);
  const [timeLeft, setTimeLeft] = useState(gameMode.hasTimer ? gameMode.timerSeconds : 0);
  const [fruits, setFruits] = useState([]);
  const [particles, setParticles] = useState([]);
  const [popups, setPopups] = useState([]);
  const [bladeTrail, setBladeTrail] = useState([]);
  const [comboBanner, setComboBanner] = useState(null);

  const engineRef = useRef(null);
  const animFrameRef = useRef(null);
  const spawnerTimerRef = useRef(null);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const countdownPulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize Game Engine
  useEffect(() => {
    const engine = new GameEngine({
      screenWidth: width,
      screenHeight: height,
      gameMode: gameMode,
      onStateUpdate: state => {
        setFruits([...state.fruits]);
        setParticles([...state.particles]);
        setPopups([...state.popups]);
        setScore(state.score);
        setLives(state.lives);
        setFrenzyMeter(state.frenzyMeter);
      },
      onGameOver: results => {
        // Navigate to appropriate outcome screen
        if (results.isBombDeath) {
          navigation.navigate('GameOverScreen', { results });
        } else {
          navigation.navigate('ResultsScreen', { results });
        }
      },
    });

    engine.onCombo = (title) => {
      setComboBanner(title);
      setTimeout(() => setComboBanner(null), 1200);
    };

    engineRef.current = engine;

    // 60fps tick loop
    const loop = () => {
      if (engineRef.current) {
        engineRef.current.tick();
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    // Spawner interval
    spawnerTimerRef.current = setInterval(() => {
      if (engineRef.current) {
        engineRef.current.spawnWave();
      }
    }, 1800);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (spawnerTimerRef.current) clearInterval(spawnerTimerRef.current);
    };
  }, [gameMode, navigation]);

  // Countdown timer for Zen / Timed modes
  useEffect(() => {
    if (!gameMode.hasTimer) return;
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6 && prev > 1) {
          // Play ticking sound for the last 5 seconds
          SoundManager.playButtonClick();
          // Animated bounce pulse for the last 5 seconds banner
          Animated.sequence([
            Animated.timing(countdownPulseAnim, {
              toValue: 1.2,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(countdownPulseAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start();
        }
        if (prev <= 1) {
          clearInterval(timerInterval);
          if (engineRef.current) {
            engineRef.current.endGame(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [gameMode, countdownPulseAnim]);

  // Pan Responder for Blade Swiping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        setBladeTrail([{ x: locationX, y: locationY, id: Date.now() }]);
        SoundManager.playSwoosh();
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const currentPt = { x: locationX, y: locationY, id: Date.now() + Math.random() };
        const prevPt = {
          x: locationX - gestureState.dx * 0.4,
          y: locationY - gestureState.dy * 0.4,
        };

        setBladeTrail(prev => [...prev.slice(-6), currentPt]);

        if (engineRef.current) {
          const hits = engineRef.current.handleSwipe(prevPt, currentPt);
          // Check for bomb hit
          if (hits.some(f => f.isBomb)) {
            triggerBombFlash();
          }
        }
      },
      onPanResponderRelease: () => {
        if (engineRef.current) {
          engineRef.current.finishSwipe();
        }
        setTimeout(() => setBladeTrail([]), 100);
      },
    })
  ).current;

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

  const handlePause = useCallback(() => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate('PauseScreen', {
        onResume: () => {
          if (engineRef.current) engineRef.current.isPaused = false;
        },
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar hidden={true} />

      {/* Screen Red Flash on Bomb */}
      <Animated.View
        style={[styles.screenFlash, { opacity: flashAnim }]}
        pointerEvents="none"
      />

      {/* TOP HEADS UP DISPLAY (HUD) */}
      <View style={styles.hudContainer}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Combo Pill */}
        <View style={styles.comboPill}>
          <Text style={styles.comboText}>x{Math.max(1, engineRef.current ? engineRef.current.activeSwipeCount : 1)} COMBO</Text>
        </View>

        {/* Timer Pill for Zen / Timed Mode */}
        {gameMode.hasTimer && (
          <View style={[styles.timerPill, timeLeft <= 5 && styles.timerPillUrgent]}>
            <Text style={[styles.timerPillText, timeLeft <= 5 && styles.timerPillTextUrgent]}>
              ⏱️ {timeLeft}s
            </Text>
          </View>
        )}

        {/* Lives Strikes (❌ ❌ ❌) */}
        {gameMode.hasLives && (
          <View style={styles.livesRow}>
            {[1, 2, 3].map(i => {
              const isLost = i > lives;
              return (
                <Text
                  key={i}
                  style={[styles.strikeText, isLost && styles.strikeLost]}
                >
                  {isLost ? '❌' : '⚔️'}
                </Text>
              );
            })}
          </View>
        )}

        {/* Pause Button */}
        <TouchableOpacity style={styles.pauseBtn} onPress={handlePause} activeOpacity={0.7}>
          <Text style={styles.pauseText}>⏸️</Text>
        </TouchableOpacity>
      </View>

      {/* LAST 5 SECONDS TOP COUNTDOWN DISPLAY */}
      {gameMode.hasTimer && timeLeft <= 5 && timeLeft > 0 && (
        <Animated.View
          style={[
            styles.lastSecondsBanner,
            { transform: [{ scale: countdownPulseAnim }] },
          ]}
          pointerEvents="none"
        >
          <View style={styles.lastSecondsBadge}>
            <Text style={styles.lastSecondsBadgeNum}>{timeLeft}</Text>
          </View>
          <View style={styles.lastSecondsTextCol}>
            <Text style={styles.lastSecondsUrgentTitle}>⚠️ HURRY! TIME IS RUNNING OUT!</Text>
            <Text style={styles.lastSecondsText}>
              {timeLeft === 1 ? '1 SECOND LEFT! FINAL SLASH!' : `${timeLeft} SECONDS REMAINING!`}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* COMBO BANNER POPUP */}
      {comboBanner && (
        <View style={styles.comboBannerBox} pointerEvents="none">
          <Text style={styles.comboBannerText}>🔥 {comboBanner} JUICY!</Text>
        </View>
      )}

      {/* FRUITS RENDERING */}
      {fruits.map(fruit => {
        if (!fruit.isSliced) {
          return (
            <View
              key={fruit.uniqueId}
              style={[
                styles.fruitElement,
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
              {fruit.isBomb && (
                <View style={styles.dangerTag}>
                  <Text style={styles.dangerTagText}>⚠️ DANGER! 💀</Text>
                </View>
              )}
            </View>
          );
        } else if (fruit.leftHalf && fruit.rightHalf) {
          const halfWidth = fruit.radius;
          const fullHeight = fruit.radius * 2;
          const fontSize = fruit.radius * 1.5;

          return (
            <React.Fragment key={fruit.uniqueId}>
              {/* Left Half Piece (clipped to show left 50%) */}
              <View
                style={[
                  styles.fruitPieceContainer,
                  {
                    width: halfWidth,
                    height: fullHeight,
                    transform: [
                      { translateX: fruit.leftHalf.x - halfWidth },
                      { translateY: fruit.leftHalf.y - fruit.radius },
                      { rotate: `${fruit.leftHalf.rot}deg` },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <View style={[styles.halfClipper, { width: halfWidth, height: fullHeight }]}>
                  <Text style={[styles.halfEmoji, { fontSize: fontSize, left: 0 }]}>
                    {fruit.emoji}
                  </Text>
                </View>
                {/* Flat cut flesh edge on the slice side */}
                <View
                  style={[
                    styles.cutEdgeLine,
                    {
                      height: fullHeight * 0.75,
                      backgroundColor: fruit.innerColor || fruit.color,
                      right: 0,
                    },
                  ]}
                />
              </View>

              {/* Right Half Piece (clipped to show right 50%) */}
              <View
                style={[
                  styles.fruitPieceContainer,
                  {
                    width: halfWidth,
                    height: fullHeight,
                    transform: [
                      { translateX: fruit.rightHalf.x },
                      { translateY: fruit.rightHalf.y - fruit.radius },
                      { rotate: `${fruit.rightHalf.rot}deg` },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <View style={[styles.halfClipper, { width: halfWidth, height: fullHeight }]}>
                  <Text style={[styles.halfEmoji, { fontSize: fontSize, left: -halfWidth }]}>
                    {fruit.emoji}
                  </Text>
                </View>
                {/* Flat cut flesh edge on the slice side */}
                <View
                  style={[
                    styles.cutEdgeLine,
                    {
                      height: fullHeight * 0.75,
                      backgroundColor: fruit.innerColor || fruit.color,
                      left: 0,
                    },
                  ]}
                />
              </View>
            </React.Fragment>
          );
        }
        return null;
      })}

      {/* PARTICLES */}
      {particles.map(p => (
        <View
          key={p.id}
          style={[
            styles.particleDot,
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

      {/* SCORE POPUPS */}
      {popups.map(pop => (
        <View
          key={pop.id}
          style={[
            styles.popupItem,
            {
              opacity: pop.alpha,
              transform: [{ translateX: pop.x }, { translateY: pop.y }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.popupText, { color: pop.color }]}>{pop.text}</Text>
        </View>
      ))}

      {/* GLOWING BLADE TRAIL */}
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
              styles.bladeSegment,
              {
                width: dist + 2,
                opacity: opacity,
                backgroundColor: activeBlade.color,
                shadowColor: activeBlade.color,
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

      {/* BOTTOM FRENZY BLADE POWERUP BAR */}
      <View style={styles.bottomBarContainer} pointerEvents="box-none">
        <View style={styles.frenzyBarCard}>
          <View style={styles.frenzyLeft}>
            <View style={styles.frenzyHeaderRow}>
              <Text style={styles.frenzyTitle}>⚡ Frenzy Blade</Text>
              <Text style={styles.frenzyPercent}>{frenzyMeter}%</Text>
            </View>
            <Text style={styles.frenzySub}>Fruit cadence doubles & freeze bombs</Text>
            <View style={styles.frenzyTrack}>
              <View style={[styles.frenzyFill, { width: `${frenzyMeter}%` }]} />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.readyButton, frenzyMeter >= 100 && styles.readyButtonActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (frenzyMeter >= 80) {
                SoundManager.playCombo(3);
                setFrenzyMeter(0);
              }
            }}
          >
            <Text style={styles.readyButtonText}>⚔️ READY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GameScreen;

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
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    zIndex: 20,
  },
  scoreCard: {
    backgroundColor: Colorcodes.DojoCard,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  scoreLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scoreValue: {
    color: Colorcodes.Gold,
    fontSize: 22,
    fontWeight: '900',
  },
  comboPill: {
    backgroundColor: Colorcodes.Secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  comboText: {
    color: Colorcodes.DojoDark,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timerPill: {
    backgroundColor: Colorcodes.DojoCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  timerPillUrgent: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
    borderColor: Colorcodes.ErrorRed,
  },
  timerPillText: {
    color: Colorcodes.White,
    fontSize: 12,
    fontWeight: '900',
  },
  timerPillTextUrgent: {
    color: Colorcodes.ErrorRed,
  },
  lastSecondsBanner: {
    position: 'absolute',
    top: 74,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 30, 86, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF1E56',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 50,
  },
  lastSecondsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  lastSecondsBadgeNum: {
    color: '#120E2E',
    fontSize: 20,
    fontWeight: '900',
  },
  lastSecondsTextCol: {
    flexDirection: 'column',
  },
  lastSecondsUrgentTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  lastSecondsText: {
    color: Colorcodes.White,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  livesRow: {
    flexDirection: 'row',
  },
  strikeText: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  strikeLost: {
    opacity: 0.3,
  },
  pauseBtn: {
    backgroundColor: Colorcodes.DojoCard,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  pauseText: {
    fontSize: 14,
  },
  comboBannerBox: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 46, 99, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colorcodes.White,
    zIndex: 30,
  },
  comboBannerText: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  fruitElement: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dangerTag: {
    position: 'absolute',
    top: -18,
    backgroundColor: 'rgba(255, 30, 86, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dangerTagText: {
    color: Colorcodes.White,
    fontSize: 9,
    fontWeight: '900',
  },
  particleDot: {
    position: 'absolute',
    zIndex: 8,
  },
  popupItem: {
    position: 'absolute',
    zIndex: 15,
  },
  popupText: {
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bladeSegment: {
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
    zIndex: 12,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 25,
  },
  frenzyBarCard: {
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorderGlow,
  },
  frenzyLeft: {
    flex: 1,
    marginRight: 14,
  },
  frenzyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  frenzyTitle: {
    color: Colorcodes.White,
    fontSize: 13,
    fontWeight: '800',
  },
  frenzyPercent: {
    color: Colorcodes.Secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  frenzySub: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    marginBottom: 6,
  },
  frenzyTrack: {
    height: 6,
    backgroundColor: Colorcodes.DojoDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  frenzyFill: {
    height: '100%',
    backgroundColor: Colorcodes.Secondary,
  },
  readyButton: {
    backgroundColor: Colorcodes.Primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyButtonActive: {
    backgroundColor: Colorcodes.Secondary,
  },
  readyButtonText: {
    color: Colorcodes.White,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  fruitPieceContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  halfClipper: {
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  halfEmoji: {
    position: 'absolute',
    top: 0,
  },
  cutEdgeLine: {
    position: 'absolute',
    width: 3.5,
    borderRadius: 2,
    opacity: 0.9,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});

