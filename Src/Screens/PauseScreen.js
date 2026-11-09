import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';

const PauseScreen = ({ navigation, route }) => {
  const onResume = route && route.params && route.params.onResume;

  const handleResume = () => {
    SoundManager.playButtonClick();
    if (onResume) onResume();
    if (navigation && navigation.goBack) navigation.goBack();
  };

  const handleRestart = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.replace) {
      navigation.replace('GameScreen');
    }
  };

  const handleMainMenu = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(11, 8, 20, 0.95)" />

      <View style={styles.pauseCard}>
        <Text style={styles.pauseEmoji}>⏸️</Text>
        <Text style={styles.pauseTitle}>GAME PAUSED</Text>
        <Text style={styles.pauseSub}>Take a breath, Sensei! Ready to slice?</Text>

        <TouchableOpacity
          style={styles.resumeBtn}
          activeOpacity={0.85}
          onPress={handleResume}
        >
          <Text style={styles.resumeBtnText}>▶️ RESUME SLICING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restartBtn}
          activeOpacity={0.85}
          onPress={handleRestart}
        >
          <Text style={styles.restartBtnText}>🔄 RESTART RUN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.8}
          onPress={handleMainMenu}
        >
          <Text style={styles.homeBtnText}>🏠 MAIN MENU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PauseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(11, 8, 20, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pauseCard: {
    width: '100%',
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colorcodes.DojoBorderGlow,
    shadowColor: Colorcodes.Primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  pauseEmoji: {
    fontSize: 38,
    marginBottom: 8,
  },
  pauseTitle: {
    color: Colorcodes.White,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pauseSub: {
    color: Colorcodes.TextMuted,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },
  resumeBtn: {
    width: '100%',
    backgroundColor: Colorcodes.Secondary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  resumeBtnText: {
    color: Colorcodes.DojoDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  restartBtn: {
    width: '100%',
    backgroundColor: Colorcodes.Primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  restartBtnText: {
    color: Colorcodes.White,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  homeBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  homeBtnText: {
    color: Colorcodes.TextSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});

