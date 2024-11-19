import { useMemo } from 'react';

export function useAudioContext() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioContext = useMemo(() => new (window.AudioContext || (window as any).webkitAudioContext)(), []);

  return audioContext;
}
