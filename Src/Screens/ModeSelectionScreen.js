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
import { GAME_MODES } from '../game/GameConfig';

const ModeSelectionScreen = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState(GAME_MODES.CLASSIC.id);

  const handleStartGame = () => {
    SoundManager.playButtonClick();
    const activeMode = Object.values(GAME_MODES).find(m => m.id === selectedMode) || GAME_MODES.CLASSIC;
    if (navigation && navigation.navigate) {
      navigation.navigate('GameScreen', { gameMode: activeMode });
    }
  };

  const handleGoBack = () => {
    SoundManager.playButtonClick();
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colorcodes.DojoDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT GAME MODE</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose your slicing adventure!</Text>

        {/* Mode Cards */}
        {Object.values(GAME_MODES).map(mode => {
          const isSelected = selectedMode === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                isSelected && styles.modeCardSelected,
                { borderColor: isSelected ? mode.color : Colorcodes.DojoBorder },
              ]}
              activeOpacity={0.85}
              onPress={() => {
                SoundManager.playButtonClick();
                setSelectedMode(mode.id);
              }}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.iconBox, { backgroundColor: isSelected ? 'rgba(0,0,0,0.25)' : Colorcodes.DojoCardElevated }]}>
                  <Text style={styles.modeEmoji}>{mode.icon}</Text>
                </View>
                <View style={styles.cardTitles}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && { backgroundColor: mode.color }]}>
                  {isSelected && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </View>

              {/* Mode Specs Tags */}
              <View style={styles.specsRow}>
                {mode.hasBombs ? (
                  <View style={styles.specTagDanger}>
                    <Text style={styles.specTextDanger}>⚠️ Bombs Active</Text>
                  </View>
                ) : (
                  <View style={styles.specTagSafe}>
                    <Text style={styles.specTextSafe}>🛡️ NO BOMBS (KIDS SAFE)</Text>
                  </View>
                )}

                {mode.hasTimer && (
                  <View style={styles.specTagInfo}>
                    <Text style={styles.specTextInfo}>⏱️ {mode.timerSeconds}s Timer</Text>
                  </View>
                )}

                {mode.hasLives && (
                  <View style={styles.specTagInfo}>
                    <Text style={styles.specTextInfo}>❤️ {mode.maxLives} Lives</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Start Button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={handleStartGame}
        >
          <Text style={styles.startButtonText}>🗡️ START SLICING ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModeSelectionScreen;

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
  backButton: {
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  subtitle: {
    color: Colorcodes.TextSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modeCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  modeCardSelected: {
    backgroundColor: Colorcodes.DojoCardElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modeEmoji: {
    fontSize: 26,
  },
  cardTitles: {
    flex: 1,
  },
  modeTitle: {
    color: Colorcodes.White,
    fontSize: 16,
    fontWeight: '800',
  },
  modeDescription: {
    color: Colorcodes.TextMuted,
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colorcodes.DojoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    color: Colorcodes.DojoDark,
    fontSize: 13,
    fontWeight: '900',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specTagSafe: {
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 155, 0.3)',
  },
  specTextSafe: {
    color: Colorcodes.Secondary,
    fontSize: 10.5,
    fontWeight: '800',
  },
  specTagDanger: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  specTextDanger: {
    color: Colorcodes.ErrorRed,
    fontSize: 10.5,
    fontWeight: '800',
  },
  specTagInfo: {
    backgroundColor: Colorcodes.DojoDeep,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
  },
  specTextInfo: {
    color: Colorcodes.TextSecondary,
    fontSize: 10.5,
    fontWeight: '700',
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    paddingTop: 10,
    backgroundColor: Colorcodes.DojoDeep,
    borderTopWidth: 1,
    borderTopColor: Colorcodes.DojoBorder,
  },
  startButton: {
    backgroundColor: Colorcodes.Secondary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colorcodes.Secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  startButtonText: {
    color: Colorcodes.DojoDark,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});

