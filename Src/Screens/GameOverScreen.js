import React from 'react';
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

const GameOverScreen = ({ navigation, route }) => {
  const results = (route && route.params && route.params.results) || {
    score: 1980,
    highScore: 2410,
    slicedCount: 88,
    maxCombo: 6,
    harvest: { melon: 42, citrus: 31, star: 18 },
  };

  const handleQuickRetry = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.replace) {
      navigation.replace('GameScreen');
    }
  };

  const handleViewResults = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate('ResultsScreen', { results });
    }
  };

  const handleReturnHome = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate('HomeScreen');
    }
  };

  const percentOfBest = Math.min(100, Math.round((results.score / (results.highScore || 2410)) * 100));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colorcodes.DojoDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleReturnHome} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GAME OVER SUMMARY</Text>
        <TouchableOpacity style={styles.audioBtn} activeOpacity={0.7}>
          <Text style={styles.audioIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Calamity Title & Bomb Detonated Badge */}
        <View style={styles.calamityHeader}>
          <Text style={styles.calamitySub}>DOJO CALAMITY</Text>
          <Text style={styles.slashedOutTitle}>⚡ SLASHED OUT! ⚡</Text>
          <View style={styles.bombDetonatedBadge}>
            <Text style={styles.bombDetonatedText}>💣 FATAL BOMB DETONATED 💣</Text>
          </View>
        </View>

        {/* Run Score vs Best Record Card */}
        <View style={styles.scoreCompareCard}>
          <View style={styles.scoreCompareRow}>
            <View>
              <Text style={styles.scoreCompareLabel}>RUN TOTAL SCORE</Text>
              <Text style={styles.scoreCompareNum}>
                {results.score.toLocaleString()}{' '}
                <Text style={styles.ptsUnit}>PTS</Text>
              </Text>
            </View>
            <View style={styles.bestRecordRight}>
              <Text style={styles.scoreCompareLabel}>BEST RECORD</Text>
              <Text style={styles.bestRecordNum}>🏆 {results.highScore.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress bar towards personal best */}
          <View style={styles.personalBestTrack}>
            <View style={[styles.personalBestFill, { width: `${percentOfBest}%` }]} />
          </View>
          <View style={styles.bestGapRow}>
            <Text style={styles.bestGapText}>{percentOfBest}% of Personal Best</Text>
            <Text style={styles.gapPtsText}>Gap: -{Math.max(0, results.highScore - results.score)} PTS</Text>
          </View>
        </View>

        {/* Harvest Harvested 4-Grid Breakdown */}
        <Text style={styles.sectionHeaderTitle}>HARVEST HARVESTED</Text>
        <View style={styles.harvestGrid}>
          <View style={styles.harvestItem}>
            <Text style={styles.harvestEmoji}>🍉</Text>
            <Text style={styles.harvestNum}>{(results.harvest && results.harvest.melon) || 42}</Text>
            <Text style={styles.harvestLabel}>MELON</Text>
          </View>

          <View style={styles.harvestItem}>
            <Text style={styles.harvestEmoji}>🍊</Text>
            <Text style={styles.harvestNum}>{(results.harvest && results.harvest.citrus) || 31}</Text>
            <Text style={styles.harvestLabel}>CITRUS</Text>
          </View>

          <View style={styles.harvestItem}>
            <Text style={styles.harvestEmoji}>⭐</Text>
            <Text style={styles.harvestNum}>{(results.harvest && results.harvest.star) || 18}</Text>
            <Text style={styles.harvestLabel}>STAR</Text>
          </View>

          <View style={styles.harvestItem}>
            <Text style={styles.harvestEmoji}>🌀</Text>
            <Text style={[styles.harvestNum, { color: Colorcodes.Secondary }]}>
              {results.maxCombo || 6}x
            </Text>
            <Text style={styles.harvestLabel}>COMBOS</Text>
          </View>
        </View>

        {/* Second Chance Dojo Perk */}
        <View style={styles.perkCard}>
          <View style={styles.perkHeader}>
            <Text style={styles.perkPulse}>〰️</Text>
            <View style={styles.perkTitleContainer}>
              <Text style={styles.perkTitle}>SECOND CHANCE</Text>
              <Text style={styles.perkSub}>Cleanse bomb & resume current combo!</Text>
            </View>
          </View>
          <View style={styles.perkButtonsRow}>
            <TouchableOpacity style={styles.reviveBtn} activeOpacity={0.8}>
              <Text style={styles.reviveText}>💎 REVIVE (20)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adBtn} activeOpacity={0.8}>
              <Text style={styles.adText}>▶️ WATCH AD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.retryBtn}
          activeOpacity={0.85}
          onPress={handleQuickRetry}
        >
          <Text style={styles.retryBtnText}>🔄 QUICK RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewResultsBtn}
          activeOpacity={0.85}
          onPress={handleViewResults}
        >
          <Text style={styles.viewResultsText}>📊 VIEW FULL RESULTS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.returnMenuBtn}
          activeOpacity={0.7}
          onPress={handleReturnHome}
        >
          <Text style={styles.returnMenuText}>RETURN TO DOJO MENU</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default GameOverScreen;

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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colorcodes.DojoBorder,
    backgroundColor: Colorcodes.DojoDeep,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colorcodes.DojoCard,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  backArrow: {
    color: Colorcodes.White,
    fontSize: 22,
    fontWeight: '800',
  },
  headerTitle: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  audioBtn: {
    backgroundColor: Colorcodes.DojoCard,
    padding: 8,
    borderRadius: 8,
  },
  audioIcon: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  calamityHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  calamitySub: {
    color: Colorcodes.TextMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  slashedOutTitle: {
    color: Colorcodes.White,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginVertical: 4,
  },
  bombDetonatedBadge: {
    backgroundColor: 'rgba(255, 30, 86, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colorcodes.Primary,
  },
  bombDetonatedText: {
    color: Colorcodes.PrimaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scoreCompareCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 20,
  },
  scoreCompareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreCompareLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scoreCompareNum: {
    color: Colorcodes.Gold,
    fontSize: 28,
    fontWeight: '900',
  },
  ptsUnit: {
    fontSize: 14,
    color: Colorcodes.TextMuted,
  },
  bestRecordRight: {
    alignItems: 'flex-end',
  },
  bestRecordNum: {
    color: Colorcodes.White,
    fontSize: 18,
    fontWeight: '800',
  },
  personalBestTrack: {
    height: 8,
    backgroundColor: Colorcodes.DojoDeep,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  personalBestFill: {
    height: '100%',
    backgroundColor: Colorcodes.Secondary,
  },
  bestGapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestGapText: {
    color: Colorcodes.Secondary,
    fontSize: 10.5,
    fontWeight: '700',
  },
  gapPtsText: {
    color: Colorcodes.TextMuted,
    fontSize: 10.5,
  },
  sectionHeaderTitle: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  harvestGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  harvestItem: {
    width: '23%',
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  harvestEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  harvestNum: {
    color: Colorcodes.White,
    fontSize: 16,
    fontWeight: '900',
  },
  harvestLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  perkCard: {
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorderGlow,
    marginBottom: 20,
  },
  perkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  perkPulse: {
    fontSize: 20,
    marginRight: 10,
  },
  perkTitleContainer: {
    flex: 1,
  },
  perkTitle: {
    color: Colorcodes.White,
    fontSize: 13,
    fontWeight: '800',
  },
  perkSub: {
    color: Colorcodes.TextMuted,
    fontSize: 10.5,
    marginTop: 2,
  },
  perkButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviveBtn: {
    width: '48%',
    backgroundColor: Colorcodes.DojoCard,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  reviveText: {
    color: Colorcodes.Gold,
    fontSize: 12,
    fontWeight: '800',
  },
  adBtn: {
    width: '48%',
    backgroundColor: Colorcodes.DojoCard,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  adText: {
    color: Colorcodes.Secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  retryBtn: {
    backgroundColor: Colorcodes.Secondary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  retryBtnText: {
    color: Colorcodes.DojoDark,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  viewResultsBtn: {
    backgroundColor: Colorcodes.Primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  viewResultsText: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  returnMenuBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  returnMenuText: {
    color: Colorcodes.TextMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

