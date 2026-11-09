import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';

const HomeScreen = ({ navigation }) => {
  const [soundOn, setSoundOn] = useState(SoundManager.isSoundEnabled());
  const [hapticsOn, setHapticsOn] = useState(SoundManager.isHapticsEnabled());
  const [highScore] = useState(2410);

  const toggleSound = () => {
    const s = SoundManager.toggleSound();
    setSoundOn(s);
  };

  const toggleHaptics = () => {
    const h = SoundManager.toggleHaptics();
    setHapticsOn(h);
  };

  const navigateTo = (screen, params) => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate(screen, params);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colorcodes.DojoDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.ninjaEmoji}>🥷</Text>
          <View>
            <Text style={styles.welcomeText}>Welcome, Sensei!</Text>
            <Text style={styles.subWelcomeText}>Ready to slice fruits?</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSound} activeOpacity={0.7}>
            <Text style={styles.iconText}>{soundOn ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleHaptics} activeOpacity={0.7}>
            <Text style={styles.iconText}>{hapticsOn ? '📳' : '📴'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigateTo('SettingsScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* High Score Banner */}
        <View style={styles.highScoreCard}>
          <View style={styles.highScoreLeft}>
            <Text style={styles.crownEmoji}>👑</Text>
            <View>
              <Text style={styles.highScoreLabel}>BEST HIGH SCORE</Text>
              <Text style={styles.highScoreValue}>{highScore.toLocaleString()} PTS</Text>
            </View>
          </View>
          <View style={styles.starsBadge}>
            <Text style={styles.starsText}>⭐⭐⭐</Text>
          </View>
        </View>

        {/* Featured Fruit Hero */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>🍉 KIDS FAVORITE</Text>
          </View>
          <Text style={styles.bannerTitle}>FRUIT DOJO ARCADE</Text>
          <Text style={styles.bannerSub}>Slice juicy watermelons, apples, oranges & strawberries!</Text>
          <View style={styles.fruitShowcaseRow}>
            <Text style={styles.fruitShowcaseEmoji}>🍉</Text>
            <Text style={styles.fruitShowcaseEmoji}>🍊</Text>
            <Text style={styles.fruitShowcaseEmoji}>🍎</Text>
            <Text style={styles.fruitShowcaseEmoji}>🍌</Text>
            <Text style={styles.fruitShowcaseEmoji}>🍓</Text>
          </View>
        </View>

        {/* Main Big Menu Buttons */}
        <TouchableOpacity
          style={styles.bigPlayButton}
          activeOpacity={0.85}
          onPress={() => navigateTo('ModeSelectionScreen')}
        >
          <Text style={styles.playIcon}>⚔️</Text>
          <View style={styles.playTextContainer}>
            <Text style={styles.playTitle}>PLAY NOW</Text>
            <Text style={styles.playSub}>Select game mode and slice fruits!</Text>
          </View>
          <Text style={styles.playArrow}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeButton}
          activeOpacity={0.8}
          onPress={() => navigateTo('ModeSelectionScreen')}
        >
          <Text style={styles.modeBtnIcon}>🎮</Text>
          <Text style={styles.modeBtnTitle}>GAME MODES</Text>
          <Text style={styles.modeBtnSub}>Classic, Zen (No Bombs) & Frenzy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          activeOpacity={0.8}
          onPress={() => navigateTo('SettingsScreen')}
        >
          <Text style={styles.settingsBtnIcon}>⚙️</Text>
          <Text style={styles.settingsBtnTitle}>GAME SETTINGS</Text>
          <Text style={styles.settingsBtnSub}>Sounds, Blades, & Kid-Friendly Mode</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colorcodes.DojoDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colorcodes.DojoBorder,
    backgroundColor: Colorcodes.DojoDeep,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ninjaEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  welcomeText: {
    color: Colorcodes.White,
    fontSize: 16,
    fontWeight: '800',
  },
  subWelcomeText: {
    color: Colorcodes.TextMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: Colorcodes.DojoCard,
    padding: 8,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  iconText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  highScoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colorcodes.DojoCard,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 16,
  },
  highScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crownEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  highScoreLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  highScoreValue: {
    color: Colorcodes.Gold,
    fontSize: 20,
    fontWeight: '900',
  },
  starsBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  starsText: {
    fontSize: 13,
  },
  bannerContainer: {
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colorcodes.DojoBorderGlow,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerTag: {
    backgroundColor: 'rgba(255, 46, 99, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colorcodes.Primary,
    marginBottom: 8,
  },
  bannerTagText: {
    color: Colorcodes.PrimaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    color: Colorcodes.White,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginVertical: 4,
  },
  bannerSub: {
    color: Colorcodes.TextSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
  },
  fruitShowcaseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fruitShowcaseEmoji: {
    fontSize: 28,
    marginHorizontal: 8,
  },
  bigPlayButton: {
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colorcodes.SecondaryLight,
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  playIcon: {
    fontSize: 26,
  },
  playTextContainer: {
    alignItems: 'center',
  },
  playTitle: {
    color: Colorcodes.DojoDark,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  playSub: {
    color: '#06492F',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  playArrow: {
    color: Colorcodes.DojoDark,
    fontSize: 20,
    fontWeight: '900',
  },
  modeButton: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 14,
  },
  modeBtnIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  modeBtnTitle: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '800',
  },
  modeBtnSub: {
    color: Colorcodes.TextMuted,
    fontSize: 11.5,
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  settingsBtnIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  settingsBtnTitle: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '800',
  },
  settingsBtnSub: {
    color: Colorcodes.TextMuted,
    fontSize: 11.5,
    marginTop: 2,
  },
});

