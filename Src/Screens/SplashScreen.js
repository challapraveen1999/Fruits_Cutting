import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.04)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-100)).current;
  const [percent, setPercent] = useState(0);

  const navigateToHome = useCallback(() => {
    SoundManager.playButtonClick();
    if (navigation && navigation.replace) {
      navigation.replace('HomeScreen');
    }
  }, [navigation]);

  useEffect(() => {
    // 1. Entrance Fade & Scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Play initial sword swoosh and slice sound
    const swooshTimer = setTimeout(() => {
      SoundManager.playSwoosh();
    }, 400);

    const sliceTimer = setTimeout(() => {
      SoundManager.playSlice();
    }, 850);

    // 3. Smooth progress bar animation (2.6s total load time)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Progress percentage counter
    const progressInterval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 85);

    // Shine sweep effect loop across progress bar
    const shineLoop = Animated.loop(
      Animated.timing(shineAnim, {
        toValue: width * 0.7,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    shineLoop.start();

    // Auto navigate to HomeScreen once loading completes
    const autoNavTimer = setTimeout(() => {
      navigateToHome();
    }, 2800);

    return () => {
      clearTimeout(swooshTimer);
      clearTimeout(sliceTimer);
      clearInterval(progressInterval);
      clearTimeout(autoNavTimer);
      shineLoop.stop();
    };
  }, [fadeAnim, navigateToHome, progressAnim, scaleAnim, shineAnim]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      activeOpacity={1}
      onPress={navigateToHome}
    >
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('../assets/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View
          style={[
            styles.animatedOverlay,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Lower Progress & Action Area */}
          <View style={styles.bottomArea}>
            {/* Loading text with animated percentage */}
            <View style={styles.loadingRow}>
              <Text style={styles.loadingText}>Loading...</Text>
              <Text style={styles.percentText}>{percent}%</Text>
            </View>

            {/* Glowing Rounded Progress Bar */}
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressBarWidth },
                ]}
              >
                {/* Glowing Shine Effect */}
                <Animated.View
                  style={[
                    styles.progressBarShine,
                    { transform: [{ translateX: shineAnim }] },
                  ]}
                />
              </Animated.View>
            </View>

            {/* Taglines matching artwork typography */}
            <View style={styles.taglinesWrapper}>
              <View style={styles.swipeToSliceRow}>
                <View style={styles.lineGold} />
                <Text style={styles.swipeToSliceText}>SWIPE TO SLICE</Text>
                <View style={styles.lineGold} />
              </View>

              <View style={styles.bladeMasterRow}>
                <View style={styles.hyphenWhite} />
                <Text style={styles.bladeMasterText}>BECOME THE BLADE MASTER</Text>
                <View style={styles.hyphenWhite} />
              </View>
            </View>

            {/* Tap prompt */}
            <Text style={styles.tapPromptText}>Tap anywhere to start</Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  touchableContainer: {
    flex: 1,
    backgroundColor: Colorcodes.DojoDark,
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'flex-end',
  },
  animatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  bottomArea: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 38,
    alignItems: 'center',
  },
  loadingRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  loadingText: {
    color: Colorcodes.White,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '800',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  percentText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  progressBarTrack: {
    width: '100%',
    height: 18,
    backgroundColor: 'rgba(18, 10, 40, 0.88)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7A35DA',
    overflow: 'hidden',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    padding: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9900',
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  progressBarShine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ skewX: '-25deg' }],
  },
  taglinesWrapper: {
    marginTop: 18,
    alignItems: 'center',
  },
  swipeToSliceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineGold: {
    width: 28,
    height: 2,
    backgroundColor: '#FFB300',
    marginHorizontal: 8,
  },
  swipeToSliceText: {
    color: '#FFB800',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bladeMasterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  hyphenWhite: {
    width: 14,
    height: 1.5,
    backgroundColor: Colorcodes.White,
    marginHorizontal: 6,
  },
  bladeMasterText: {
    color: Colorcodes.White,
    fontSize: 11.5,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: 1.8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tapPromptText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 10.5,
    marginTop: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
