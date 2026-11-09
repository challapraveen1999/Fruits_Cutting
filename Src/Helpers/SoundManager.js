let Sound = null;

try {
  Sound = require('react-native-sound');
  if (Sound && Sound.setCategory) {
    Sound.setCategory('Playback', true);
  }
} catch (e) {
  // react-native-sound fallback
}

class SoundManager {
  constructor() {
    this.soundEnabled = true;
    this.hapticsEnabled = false;
    this.cachedSounds = {};
    this.hasWarnedRebuild = false;

    this.preloadSounds();
  }

  preloadSounds() {
    if (!Sound) return;
    const soundNames = ['slice', 'swoosh', 'combo', 'bomb', 'gameover', 'click'];
    soundNames.forEach(name => {
      try {
        // On Android raw resources, filename must be without extension (e.g. 'slice')
        const s = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
          if (!error) {
            s.setVolume(1.0);
            this.cachedSounds[name] = s;
          }
        });
      } catch (e) {
        // Safe fallback
      }
    });
  }

  playSound(name) {
    if (!this.soundEnabled || !Sound) return;

    // Play from preloaded cache if available
    if (this.cachedSounds[name]) {
      try {
        this.cachedSounds[name].stop(() => {
          this.cachedSounds[name].play();
        });
        return;
      } catch (err) {
        // Fallback to fresh instance
      }
    }

    // Fresh sound instance
    try {
      const sound = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
        if (!error) {
          sound.setVolume(1.0);
          sound.play(() => {
            sound.release();
          });
        }
      });
    } catch (e) {
      if (!this.hasWarnedRebuild) {
        this.hasWarnedRebuild = true;
        console.warn(
          `[SoundManager] Audio requires an APK rebuild. Run 'npx react-native run-android' to compile native sound drivers.`
        );
      }
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleHaptics() {
    this.hapticsEnabled = !this.hapticsEnabled;
    return this.hapticsEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  isHapticsEnabled() {
    return this.hapticsEnabled;
  }

  isAudioDriverLinked() {
    return !!Sound;
  }

  // Fruit sliced sound
  playSlice(_comboCount = 1) {
    this.playSound('slice');
  }

  // Blade swoosh sound
  playSwoosh() {
    this.playSound('swoosh');
  }

  // Multi-fruit combo sound
  playCombo(_multiplier = 2) {
    this.playSound('combo');
  }

  // Bomb exploded sound
  playBomb() {
    this.playSound('bomb');
  }

  // Game over sound
  playGameOver() {
    this.playSound('gameover');
  }

  // UI button click sound
  playButtonClick() {
    this.playSound('click');
  }
}

const soundManagerInstance = new SoundManager();
export default soundManagerInstance;
