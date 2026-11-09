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

const ResultsScreen = ({ navigation, route }) => {
  const results = (route && route.params && route.params.results) || {
    score: 3840,
    slicedCount: 124,
    maxCombo: 8,
    stars: 3,
    rank: 'S',
    bounty: { goldSeeds: 240, dojoXp: 15, sakuraShards: 3 },
  };

  const handleContinue = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.navigate) {
      navigation.navigate('HomeScreen');
    }
  };

  const handleReplay = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.replace) {
      navigation.replace('GameScreen');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colorcodes.DojoDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleContinue} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GAME OVER SUMMARY</Text>
        <TouchableOpacity style={styles.audioBtn} activeOpacity={0.7}>
          <Text style={styles.audioIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Trial Completed Status */}
        <View style={styles.completedHeader}>
          <View style={styles.trialCompletedPill}>
            <Text style={styles.trialCompletedDot}>●</Text>
            <Text style={styles.trialCompletedText}>TRIAL COMPLETED!</Text>
          </View>

          {/* Stars */}
          <View style={styles.starsRow}>
            <Text style={styles.starLarge}>⭐</Text>
            <Text style={[styles.starLarge, styles.starCenter]}>⭐</Text>
            <Text style={styles.starLarge}>⭐</Text>
          </View>

          <View style={styles.newRecordBadge}>
            <Text style={styles.newRecordText}>🎉 NEW RECORD!</Text>
          </View>
        </View>

        {/* Score & S-Rank Medal Banner */}
        <View style={styles.scoreRankCard}>
          <View>
            <Text style={styles.totalScoreLabel}>TOTAL SCORE</Text>
            <Text style={styles.totalScoreNum}>
              {results.score.toLocaleString()}{' '}
              <Text style={styles.ptsBonusText}>+620 PTS</Text>
            </Text>
          </View>

          {/* S-Rank Medal Emblem */}
          <View style={styles.rankMedal}>
            <Text style={styles.rankLetter}>{results.rank || 'S'}</Text>
            <Text style={styles.rankSubText}>RANK</Text>
          </View>
        </View>

        {/* Card 1: Trial Bounty Earned */}
        <View style={styles.bountyCard}>
          <View style={styles.bountyHeader}>
            <Text style={styles.bountyTitle}>🎁 Trial Bounty Earned</Text>
            <Text style={styles.claimReadyTag}>CLAIM READY</Text>
          </View>

          <View style={styles.bountyItemsRow}>
            <View style={styles.bountyItem}>
              <Text style={styles.bountyEmoji}>🪙</Text>
              <Text style={styles.bountyVal}>+{(results.bounty && results.bounty.goldSeeds) || 240}</Text>
              <Text style={styles.bountyLabel}>Gold Seeds</Text>
            </View>

            <View style={styles.bountyItem}>
              <Text style={styles.bountyEmoji}>🥋</Text>
              <Text style={styles.bountyVal}>+{(results.bounty && results.bounty.dojoXp) || 15} EXP</Text>
              <Text style={styles.bountyLabel}>Dojo Mastery</Text>
            </View>

            <View style={styles.bountyItem}>
              <Text style={styles.bountyEmoji}>🌸</Text>
              <Text style={styles.bountyVal}>+{(results.bounty && results.bounty.sakuraShards) || 3}</Text>
              <Text style={styles.bountyLabel}>Sakura Shards</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Level Progression */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelTitle}>🥋 Dojo Disciple</Text>
            <Text style={styles.levelNumbers}>LVL 24 ➔ 25</Text>
          </View>
          <View style={styles.levelTrack}>
            <View style={[styles.levelFill, { width: '84%' }]} />
          </View>
          <View style={styles.levelSubRow}>
            <Text style={styles.levelExp}>420 / 500 EXP</Text>
            <Text style={styles.nextSlotText}>+80 EXP to Next Blade Slot</Text>
          </View>
        </View>

        {/* Card 3: Blade Telemetry 4-Grid */}
        <Text style={styles.sectionHeaderTitle}>BLADE TELEMETRY</Text>
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryEmoji}>🍉</Text>
            <Text style={styles.telemetryNum}>{results.slicedCount || 124}</Text>
            <Text style={styles.telemetryLabel}>Fruits Sliced</Text>
          </View>

          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryEmoji}>⚡</Text>
            <Text style={[styles.telemetryNum, { color: Colorcodes.Secondary }]}>
              {results.maxCombo || 8}x
            </Text>
            <Text style={styles.telemetryLabel}>Max Combo</Text>
          </View>

          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryEmoji}>🎯</Text>
            <Text style={[styles.telemetryNum, { color: Colorcodes.Gold }]}>96%</Text>
            <Text style={styles.telemetryLabel}>Slice Precision</Text>
          </View>

          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryEmoji}>💥</Text>
            <Text style={[styles.telemetryNum, { color: Colorcodes.Primary }]}>14</Text>
            <Text style={styles.telemetryLabel}>Critical Splatters</Text>
          </View>
        </View>

        {/* Clean Blade Honor Banner */}
        <View style={styles.cleanBladeBanner}>
          <Text style={styles.cleanBladeText}>🛡️ Clean Blade Honor Earned</Text>
          <Text style={styles.zeroMissedBadge}>0 MISSED</Text>
        </View>

        {/* Double Rewards Button */}
        <TouchableOpacity style={styles.doubleRewardsBtn} activeOpacity={0.85}>
          <Text style={styles.doubleRewardsText}>📹 DOUBLE REWARDS (2X) AD</Text>
        </TouchableOpacity>

        {/* Replay & Continue Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.replayBtn} activeOpacity={0.8} onPress={handleReplay}>
            <Text style={styles.replayIcon}>🔄</Text>
            <Text style={styles.replayText}>REPLAY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85} onPress={handleContinue}>
            <Text style={styles.continueText}>CONTINUE 🥋</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultsScreen;

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
  completedHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  trialCompletedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colorcodes.Secondary,
    marginBottom: 12,
  },
  trialCompletedDot: {
    color: Colorcodes.Secondary,
    fontSize: 10,
    marginRight: 6,
  },
  trialCompletedText: {
    color: Colorcodes.Secondary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starLarge: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  starCenter: {
    fontSize: 42,
    marginTop: -8,
  },
  newRecordBadge: {
    backgroundColor: 'rgba(255, 46, 99, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colorcodes.Primary,
  },
  newRecordText: {
    color: Colorcodes.PrimaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scoreRankCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 18,
  },
  totalScoreLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  totalScoreNum: {
    color: Colorcodes.White,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 2,
  },
  ptsBonusText: {
    color: Colorcodes.Secondary,
    fontSize: 13,
    fontWeight: '800',
  },
  rankMedal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 160, 0, 0.2)',
    borderWidth: 2,
    borderColor: Colorcodes.Tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLetter: {
    color: Colorcodes.Gold,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  rankSubText: {
    color: Colorcodes.Gold,
    fontSize: 9,
    fontWeight: '800',
  },
  bountyCard: {
    backgroundColor: Colorcodes.DojoCardElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorderGlow,
    marginBottom: 16,
  },
  bountyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bountyTitle: {
    color: Colorcodes.White,
    fontSize: 13,
    fontWeight: '800',
  },
  claimReadyTag: {
    color: Colorcodes.Secondary,
    fontSize: 10,
    fontWeight: '800',
  },
  bountyItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bountyItem: {
    alignItems: 'center',
  },
  bountyEmoji: {
    fontSize: 20,
    marginBottom: 3,
  },
  bountyVal: {
    color: Colorcodes.White,
    fontSize: 13.5,
    fontWeight: '800',
  },
  bountyLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9.5,
    marginTop: 2,
  },
  levelCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 18,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelTitle: {
    color: Colorcodes.White,
    fontSize: 12.5,
    fontWeight: '800',
  },
  levelNumbers: {
    color: Colorcodes.Secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  levelTrack: {
    height: 7,
    backgroundColor: Colorcodes.DojoDeep,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  levelFill: {
    height: '100%',
    backgroundColor: Colorcodes.Secondary,
  },
  levelSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelExp: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
  },
  nextSlotText: {
    color: Colorcodes.TextSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeaderTitle: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  telemetryItem: {
    width: '23%',
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  telemetryEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  telemetryNum: {
    color: Colorcodes.White,
    fontSize: 15,
    fontWeight: '900',
  },
  telemetryLabel: {
    color: Colorcodes.TextMuted,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  cleanBladeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 155, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 155, 0.25)',
    marginBottom: 18,
  },
  cleanBladeText: {
    color: Colorcodes.Secondary,
    fontSize: 11.5,
    fontWeight: '800',
  },
  zeroMissedBadge: {
    backgroundColor: Colorcodes.Secondary,
    color: Colorcodes.DojoDark,
    fontSize: 9.5,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  doubleRewardsBtn: {
    backgroundColor: Colorcodes.Tertiary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colorcodes.Tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  doubleRewardsText: {
    color: Colorcodes.DojoDark,
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replayBtn: {
    width: '32%',
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    flexDirection: 'row',
  },
  replayIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  replayText: {
    color: Colorcodes.White,
    fontSize: 12,
    fontWeight: '800',
  },
  continueBtn: {
    width: '64%',
    backgroundColor: Colorcodes.Secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  continueText: {
    color: Colorcodes.DojoDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

