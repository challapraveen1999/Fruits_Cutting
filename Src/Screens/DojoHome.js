import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';

const { width } = Dimensions.get('window');

const DojoHome = ({ navigation, onNavigate }) => {
  const [soundOn, setSoundOn] = useState(SoundManager.isSoundEnabled());
  const [hapticsOn, setHapticsOn] = useState(SoundManager.isHapticsEnabled());
  const [coins] = useState(1840);
  const [gems] = useState(74);
  const [activeTab, setActiveTab] = useState('PLAY');

  const handleStartGame = () => {
    SoundManager.playSwoosh();
    if (navigation && navigation.navigate) {
      navigation.navigate('FruitCuttingScreen');
    } else if (onNavigate) {
      onNavigate('FruitCuttingScreen');
    }
  };

  const toggleSound = () => {
    const updated = SoundManager.toggleSound();
    setSoundOn(updated);
  };

  const toggleHaptics = () => {
    const updated = SoundManager.toggleHaptics();
    setHapticsOn(updated);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colorcodes.DojoDark} />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogo}>🗡️</Text>
          <Text style={styles.headerTitle}>DOJO HOME</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={toggleSound}
            activeOpacity={0.7}
          >
            <Text style={styles.headerIcon}>{soundOn ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={toggleHaptics}
            activeOpacity={0.7}
          >
            <Text style={styles.headerIcon}>{hapticsOn ? '📳' : '📴'}</Text>
          </TouchableOpacity>

          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>🥷</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Sensei Rank & Currencies */}
        <View style={styles.rankCurrencyBar}>
          <View style={styles.senseiBadge}>
            <Text style={styles.senseiIcon}>⭐</Text>
            <Text style={styles.senseiText}>BLADE SENSEI</Text>
          </View>

          <View style={styles.currenciesRow}>
            <View style={styles.currencyPill}>
              <Text style={styles.currencyIcon}>🪙</Text>
              <Text style={styles.currencyValue}>{coins.toLocaleString()}</Text>
            </View>

            <View style={[styles.currencyPill, { marginLeft: 8 }]}>
              <Text style={styles.currencyIcon}>💎</Text>
              <Text style={styles.currencyValue}>{gems}</Text>
            </View>
          </View>
        </View>

        {/* Featured Katana Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerGlow} />
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>⚡ FEATURED BLADE</Text>
          </View>
          <View style={styles.bannerInner}>
            <Text style={styles.bannerSubtitle}>SAKURA SHARP • TIER 4</Text>
            <Text style={styles.bannerTitle}>CYBER KATANA</Text>
            <Text style={styles.bannerDescription}>
              +25% Fruit Slice Range & Neon Particle Trails
            </Text>
          </View>
          <View style={styles.bannerArt}>
            <Text style={styles.bannerFruitEmoji}>🍉</Text>
            <View style={styles.bannerSlashLine} />
            <Text style={styles.bannerBladeEmoji}>⚔️</Text>
          </View>
        </View>

        {/* Big Neon "SLICE TO PLAY" Button */}
        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.85}
          onPress={handleStartGame}
        >
          <Text style={styles.playButtonIcon}>⚔️</Text>
          <View style={styles.playButtonTextContainer}>
            <Text style={styles.playButtonTitle}>SLICE TO PLAY</Text>
            <Text style={styles.playButtonSub}>SWIPE ARCADE • SOUND FX ON</Text>
          </View>
          <Text style={styles.playButtonArrow}>➔</Text>
        </TouchableOpacity>

        {/* Dojo Telemetry Section */}
        <View style={styles.telemetryCard}>
          <View style={styles.telemetryHeader}>
            <Text style={styles.telemetryTitle}>📊 DOJO TELEMETRY</Text>
            <Text style={styles.telemetryTag}>REAL-TIME</Text>
          </View>

          <View style={styles.telemetryStatsRow}>
            <View style={styles.telemetryStatBox}>
              <Text style={styles.telemetryLabel}>HIGH SCORE</Text>
              <Text style={[styles.telemetryValue, { color: Colorcodes.Gold }]}>
                1,840
              </Text>
            </View>
            <View style={styles.telemetryStatDivider} />
            <View style={styles.telemetryStatBox}>
              <Text style={styles.telemetryLabel}>MAX COMBO</Text>
              <Text style={[styles.telemetryValue, { color: Colorcodes.Primary }]}>
                7x FRENZY
              </Text>
            </View>
            <View style={styles.telemetryStatDivider} />
            <View style={styles.telemetryStatBox}>
              <Text style={styles.telemetryLabel}>ACCURACY</Text>
              <Text style={[styles.telemetryValue, { color: Colorcodes.Secondary }]}>
                94.8%
              </Text>
            </View>
          </View>

          {/* Dojo Mastery XP Bar */}
          <View style={styles.masteryProgressWrapper}>
            <View style={styles.masteryRow}>
              <Text style={styles.masteryLabel}>Blade Mastery Level 12</Text>
              <Text style={styles.masteryPercent}>72%</Text>
            </View>
            <View style={styles.masteryTrack}>
              <View style={[styles.masteryFill, { width: '72%' }]} />
            </View>
          </View>
        </View>

        {/* 4 Dojo Activity Cards (Lucky Spin, Armory, Dojo Pass, Ranks) */}
        <View style={styles.activityGrid}>
          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.8}
            onPress={() => SoundManager.playButtonClick()}
          >
            <View style={[styles.activityIconBox, { backgroundColor: 'rgba(255, 160, 0, 0.15)' }]}>
              <Text style={styles.activityEmoji}>🎡</Text>
            </View>
            <Text style={styles.activityTitle}>LUCKY SPIN</Text>
            <Text style={styles.activitySub}>Wheel Rewards!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.8}
            onPress={() => SoundManager.playButtonClick()}
          >
            <View style={[styles.activityIconBox, { backgroundColor: 'rgba(255, 46, 99, 0.15)' }]}>
              <Text style={styles.activityEmoji}>🗡️</Text>
            </View>
            <Text style={styles.activityTitle}>ARMORY</Text>
            <Text style={styles.activitySub}>Blades & Katana</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.8}
            onPress={() => SoundManager.playButtonClick()}
          >
            <View style={[styles.activityIconBox, { backgroundColor: 'rgba(0, 245, 155, 0.15)' }]}>
              <Text style={styles.activityEmoji}>📜</Text>
            </View>
            <Text style={styles.activityTitle}>DOJO PASS</Text>
            <Text style={styles.activitySub}>Season 3 Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.8}
            onPress={() => SoundManager.playButtonClick()}
          >
            <View style={[styles.activityIconBox, { backgroundColor: 'rgba(121, 40, 202, 0.2)' }]}>
              <Text style={styles.activityEmoji}>🏆</Text>
            </View>
            <Text style={styles.activityTitle}>RANKS</Text>
            <Text style={styles.activitySub}>Global Masters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar (matching design image) */}
      <View style={styles.bottomTabBar}>
        {[
          { key: 'PLAY', label: 'PLAY', icon: '⚔️' },
          { key: 'BLADES', label: 'BLADES', icon: '🗡️' },
          { key: 'ARCADE', label: 'ARCADE', icon: '🕹️' },
          { key: 'RANKS', label: 'RANKS', icon: '🏆' },
          { key: 'SHOP', label: 'SHOP', icon: '🛒' },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => {
                SoundManager.playButtonClick();
                setActiveTab(tab.key);
                if (tab.key === 'PLAY') {
                  handleStartGame();
                }
              }}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabActiveIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default DojoHome;

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
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colorcodes.DojoBorder,
    backgroundColor: Colorcodes.DojoDeep,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    color: Colorcodes.White,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 6,
    marginRight: 8,
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  headerIcon: {
    fontSize: 16,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colorcodes.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colorcodes.PrimaryLight,
  },
  profileAvatarText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
  },
  rankCurrencyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  senseiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 46, 99, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 46, 99, 0.35)',
  },
  senseiIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  senseiText: {
    color: Colorcodes.PrimaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  currenciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colorcodes.DojoCard,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  currencyIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  currencyValue: {
    color: Colorcodes.White,
    fontSize: 12,
    fontWeight: '800',
  },
  bannerContainer: {
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colorcodes.DojoBorderGlow,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 18,
  },
  bannerGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 46, 99, 0.18)',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 160, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colorcodes.Tertiary,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: Colorcodes.Tertiary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bannerInner: {
    maxWidth: '75%',
  },
  bannerSubtitle: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    color: Colorcodes.White,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginVertical: 4,
  },
  bannerDescription: {
    color: Colorcodes.TextMuted,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  bannerArt: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerFruitEmoji: {
    fontSize: 38,
  },
  bannerSlashLine: {
    width: 60,
    height: 2,
    backgroundColor: Colorcodes.Secondary,
    transform: [{ rotate: '-40deg' }],
    marginVertical: -8,
  },
  bannerBladeEmoji: {
    fontSize: 26,
    marginTop: -6,
  },
  playButton: {
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 18,
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colorcodes.SecondaryLight,
  },
  playButtonIcon: {
    fontSize: 24,
  },
  playButtonTextContainer: {
    alignItems: 'center',
  },
  playButtonTitle: {
    color: Colorcodes.DojoDark,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  playButtonSub: {
    color: '#044B2E',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  playButtonArrow: {
    color: Colorcodes.DojoDark,
    fontSize: 18,
    fontWeight: '900',
  },
  telemetryCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 18,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  telemetryTitle: {
    color: Colorcodes.TextPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  telemetryTag: {
    color: Colorcodes.Secondary,
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  telemetryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colorcodes.DojoBorder,
  },
  telemetryStatBox: {
    alignItems: 'center',
  },
  telemetryStatDivider: {
    width: 1,
    height: 26,
    backgroundColor: Colorcodes.DojoBorder,
  },
  telemetryLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
  },
  telemetryValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  masteryProgressWrapper: {
    marginTop: 12,
  },
  masteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  masteryLabel: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  masteryPercent: {
    color: Colorcodes.Secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  masteryTrack: {
    height: 6,
    backgroundColor: Colorcodes.DojoDeep,
    borderRadius: 3,
    overflow: 'hidden',
  },
  masteryFill: {
    height: '100%',
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 3,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: (width - 48) / 2,
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityTitle: {
    color: Colorcodes.White,
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activitySub: {
    color: Colorcodes.TextMuted,
    fontSize: 10.5,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: Colorcodes.DojoDeep,
    borderTopWidth: 1,
    borderTopColor: Colorcodes.DojoBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
    minWidth: 50,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  tabLabelActive: {
    color: Colorcodes.Secondary,
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 16,
    height: 2.5,
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 2,
  },
});
