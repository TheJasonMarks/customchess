import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class SoundManager {
  private sounds: Record<string, Audio.Sound | null> = {
    move: null,
    capture: null,
    check: null,
    castle: null,
    gameStart: null,
    gameEnd: null,
  };
  private isLoaded = false;
  private isMuted = false;

  async loadSounds() {
    if (this.isLoaded) return;
    
    try {
      // Set audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      
      this.isLoaded = true;
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  async playMove() {
    if (this.isMuted) return;
    this.playTone(400, 50);
  }

  async playCapture() {
    if (this.isMuted) return;
    this.playTone(300, 100);
  }

  async playCheck() {
    if (this.isMuted) return;
    this.playTone(600, 150);
  }

  async playCastle() {
    if (this.isMuted) return;
    this.playTone(350, 80);
  }

  async playGameStart() {
    if (this.isMuted) return;
    // Play ascending tones
    this.playTone(300, 100);
    setTimeout(() => this.playTone(400, 100), 100);
    setTimeout(() => this.playTone(500, 100), 200);
  }

  async playGameEnd() {
    if (this.isMuted) return;
    // Play descending tones for game end
    this.playTone(500, 150);
    setTimeout(() => this.playTone(400, 150), 150);
    setTimeout(() => this.playTone(300, 200), 300);
  }

  private playTone(frequency: number, duration: number) {
    // Simple beep using oscillator - works on web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (e) {
        // Silently fail on audio errors
      }
    }
  }

  async cleanup() {
    // Cleanup if needed
  }
}

export const soundManager = new SoundManager();
