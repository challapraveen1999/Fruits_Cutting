import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import Colorcodes from '../Helpers/Colorcodes.json';
import SoundManager from '../Helpers/SoundManager';
import GameState from '../Helpers/GameState';
import { BLADE_STYLES } from '../game/GameConfig';

const SettingsScreen = ({ navigation }) => {
  const [soundOn, setSoundOn] = useState(SoundManager.isSoundEnabled());
  const [hapticsOn, setHapticsOn] = useState(SoundManager.isHapticsEnabled());
  const [musicOn, setMusicOn] = useState(true);
  const [kidFriendly, setKidFriendly] = useState(GameState.isKidFriendly());
  const [selectedBlade, setSelectedBlade] = useState(GameState.getBlade().id);

  const handleToggleSound = () => {
    const updated = SoundManager.toggleSound();
    setSoundOn(updated);
  };

  const handleToggleHaptics = () => {
    const updated = SoundManager.toggleHaptics();
    setHapticsOn(updated);
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
        <TouchableOpacity style={styles.backBtn} onPress={handleGoBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GAME SETTINGS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Audio & Haptics Section */}
        <Text style={styles.sectionTitle}>AUDIO & FEEDBACK</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingSub}>Katana swoosh & fruit slice splatters</Text>
            </View>
            <Switch
              value={soundOn}
              onValueChange={handleToggleSound}
              trackColor={{ false: Colorcodes.DojoDeep, true: Colorcodes.Secondary }}
              thumbColor={soundOn ? Colorcodes.White : Colorcodes.TextMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingSub}>Vibrate gently on fruit slices</Text>
            </View>
            <Switch
              value={hapticsOn}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: Colorcodes.DojoDeep, true: Colorcodes.Secondary }}
              thumbColor={hapticsOn ? Colorcodes.White : Colorcodes.TextMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Background Music</Text>
              <Text style={styles.settingSub}>Cheerful arcade dojo soundtrack</Text>
            </View>
            <Switch
              value={musicOn}
              onValueChange={() => setMusicOn(m => !m)}
              trackColor={{ false: Colorcodes.DojoDeep, true: Colorcodes.Secondary }}
              thumbColor={musicOn ? Colorcodes.White : Colorcodes.TextMuted}
            />
          </View>
        </View>

        {/* Kids & Gameplay Settings */}
        <Text style={styles.sectionTitle}>GAMEPLAY COMFORT</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Kid-Friendly Easy Hitbox</Text>
              <Text style={styles.settingSub}>Generous slice range for small fingers</Text>
            </View>
            <Switch
              value={kidFriendly}
              onValueChange={val => {
                setKidFriendly(val);
                GameState.setKidFriendly(val);
              }}
              trackColor={{ false: Colorcodes.DojoDeep, true: Colorcodes.Secondary }}
              thumbColor={kidFriendly ? Colorcodes.White : Colorcodes.TextMuted}
            />
          </View>
        </View>

        {/* Blade Customization */}
        <Text style={styles.sectionTitle}>KATANA BLADE GLOW</Text>
        <View style={styles.bladesRow}>
          {BLADE_STYLES.map(blade => {
            const isSelected = selectedBlade === blade.id;
            return (
              <TouchableOpacity
                key={blade.id}
                style={[
                  styles.bladeCard,
                  isSelected && styles.bladeCardSelected,
                  { borderColor: isSelected ? blade.color : Colorcodes.DojoBorder },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  SoundManager.playButtonClick();
                  setSelectedBlade(blade.id);
                  GameState.setBlade(blade.id);
                }}
              >
                <View style={[styles.bladeColorCircle, { backgroundColor: blade.color }]} />
                <Text style={styles.bladeName}>{blade.name}</Text>
                {isSelected && <Text style={styles.bladeSelectedBadge}>EQUIPPED</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info Footer */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>FRUIT SLICE DOJO</Text>
          <Text style={styles.infoVersion}>Version 1.0.0 • Kids Safe & Auditable</Text>
          <Text style={styles.infoCredits}>Built with React Native & Custom 60fps Game Engine</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
    paddingBottom: 30,
  },
  sectionTitle: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  settingsCard: {
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colorcodes.DojoBorder,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLabel: {
    color: Colorcodes.White,
    fontSize: 14,
    fontWeight: '800',
  },
  settingSub: {
    color: Colorcodes.TextMuted,
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colorcodes.DojoBorder,
    marginVertical: 12,
  },
  bladesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bladeCard: {
    width: '48%',
    backgroundColor: Colorcodes.DojoCard,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 12,
  },
  bladeCardSelected: {
    backgroundColor: Colorcodes.DojoCardElevated,
  },
  bladeColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 8,
  },
  bladeName: {
    color: Colorcodes.White,
    fontSize: 12.5,
    fontWeight: '800',
  },
  bladeSelectedBadge: {
    color: Colorcodes.Secondary,
    fontSize: 9.5,
    fontWeight: '900',
    marginTop: 4,
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoTitle: {
    color: Colorcodes.TextMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  infoVersion: {
    color: Colorcodes.TextSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  infoCredits: {
    color: Colorcodes.TextMuted,
    fontSize: 10,
    marginTop: 4,
  },
});

