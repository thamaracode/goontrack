// Web Vibration API for tactile Android haptic feedback

class HapticEngine {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private canVibrate(): boolean {
    return this.enabled && typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  public tap() {
    if (this.canVibrate()) {
      try {
        navigator.vibrate(15);
      } catch {
        // safe fallback
      }
    }
  }

  public success() {
    if (this.canVibrate()) {
      try {
        navigator.vibrate([30, 40, 50]);
      } catch {
        // safe fallback
      }
    }
  }

  public levelUp() {
    if (this.canVibrate()) {
      try {
        navigator.vibrate([60, 40, 80, 40, 120]);
      } catch {
        // safe fallback
      }
    }
  }

  public recordBroken() {
    if (this.canVibrate()) {
      try {
        navigator.vibrate([80, 50, 120, 50, 200]);
      } catch {
        // safe fallback
      }
    }
  }
}

export const haptics = new HapticEngine();
