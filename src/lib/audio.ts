type SoundName = 'beep-start' | 'beep-end' | 'complete';

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private unlocked = false;

  // Call this on first user interaction to unlock audio on mobile
  unlock(): void {
    if (this.unlocked) return;

    // Create and play a silent audio to unlock
    const silent = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    silent.play().then(() => {
      this.unlocked = true;
    }).catch(() => {
      // Ignore errors - we'll try again on next interaction
    });
  }

  preload(name: SoundName, src: string): void {
    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  preloadAll(): void {
    this.preload('beep-start', '/sounds/beep-start.wav');
    this.preload('beep-end', '/sounds/beep-end.wav');
    this.preload('complete', '/sounds/complete.wav');
  }

  play(name: SoundName): void {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore play errors (user hasn't interacted yet, etc.)
      });
    }
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
