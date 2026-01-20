let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if (typeof window === 'undefined') return null;

  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');

      // Re-acquire wake lock when page becomes visible again
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return wakeLock;
    } catch (err) {
      // Wake Lock request failed - usually because screen is off or permission denied
      console.log('Wake Lock request failed:', err);
      return null;
    }
  }

  return null;
}

export async function releaseWakeLock(): Promise<void> {
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch {
      // Ignore release errors
    }
    wakeLock = null;
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange);
}

async function handleVisibilityChange(): Promise<void> {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    // Re-acquire wake lock when tab becomes visible
    await requestWakeLock();
  }
}

export function isWakeLockSupported(): boolean {
  return typeof window !== 'undefined' && 'wakeLock' in navigator;
}
