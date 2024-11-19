import { useEffect, useState } from 'react';

export function useAudioBuffer(audioContext: AudioContext, url: string) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    if (!audioBuffer) {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(setAudioBuffer)
        .catch(err => console.error('Error loading audio:', err));
    }
  }, [audioBuffer, audioContext, url]);

  return audioBuffer;
}
