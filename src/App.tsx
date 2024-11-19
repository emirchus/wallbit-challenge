import { useState, useEffect, useCallback } from 'react';
import { Loader, Power } from 'lucide-react';
import { RetroScreen } from './components/retro-screen';
import { cn } from './lib/utils';
import { useAudioContext } from './hooks/use-audio-context';
import { useAudioBuffer } from './hooks/use-audio-buffer';
import { Button } from './components/ui/button';
import { CartContextProvider } from './provider/cart-provider';
import HomePage from './components/home';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioContext = useAudioContext();
  const audioBuffer = useAudioBuffer(audioContext, 'keyboard.mp3');

  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsPoweringOff(true);
      }, 5000);
    }, 600000);

    return () => clearTimeout(glitchTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(oldProgress => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);

          return 100;
        }
        const newProgress = oldProgress + 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [audioContext]);

  const fadeOut = useCallback(
    (gainNode: GainNode, duration: number) => {
      const currentTime = audioContext.currentTime;
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
    },
    [audioContext]
  );

  const playSound = useCallback(
    (buffer: AudioBuffer, isBigKey: boolean) => {
      if (audioContext.state === 'suspended') audioContext.resume();
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      const distortion = audioContext.createWaveShaper();

      function makeDistortionCurve(amount: number) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      }

      distortion.curve = makeDistortionCurve(80);
      distortion.oversample = '4x';

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(900, audioContext.currentTime);
      filterNode.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 2);
      filterNode.Q.setValueAtTime(1, audioContext.currentTime);

      source.buffer = buffer;
      source.connect(filterNode).connect(distortion).connect(gainNode).connect(audioContext.destination);

      source.playbackRate.value = Math.random() * 0.5 + 0.75;

      if (isBigKey) {
        source.start(0, 0.165);
        source.stop(audioContext.currentTime + 0.265);
      } else {
        const offset = Math.random() > 0.5 ? 0 : 0.562;
        source.start(0, offset);
        source.stop(audioContext.currentTime + 0.259);
      }

      fadeOut(gainNode, 10);
      source.onended = () => {
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        source.disconnect();
        gainNode.disconnect();
      };
    },
    [audioContext, fadeOut]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!audioBuffer || !isSoundEnabled) return;

      const bigKeys = ['Enter', 'Space', 'ShiftRight', 'ShiftLeft'];
      playSound(audioBuffer, bigKeys.includes(e.code));
    },
    [audioBuffer, isSoundEnabled, playSound]
  );

  useEffect(() => {
    if (isLoading) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioContext?.suspend();
    };
  }, [audioContext, handleKeyDown, isLoading]);

  return (
    <>
      <RetroScreen
        className={cn({
          glitch: isGlitching,
          'powering-off': isPoweringOff,
        })}
      >
        {isLoading ? (
          <div className="flex h-screen w-full flex-col items-center justify-center">
            <Loader className="mb-4 h-12 w-12 animate-spin" />
            <div className="mb-2 text-2xl tracking-wider">Cargando sistema...</div>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-border/20">
              <div
                className="h-full bg-border transition-all duration-200 ease-in-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xl tracking-wider">{loadingProgress}%</div>
          </div>
        ) : (
          <CartContextProvider>
            <HomePage
              isPoweredOn={isPoweringOff}
              isSoundEnabled={isSoundEnabled}
              togglePower={() => setIsPoweringOff(!isPoweringOff)}
              toggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            />
          </CartContextProvider>
        )}
      </RetroScreen>

      {isPoweringOff && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          <h4
            className="text-4xl font-bold text-foreground"
            style={{
              animation: 'powerOff 2s reverse',
            }}
          >
            APAGANDO EQUIPO...
          </h4>
          <Button
            variant={'ghost'}
            onClick={() => setIsPoweringOff(false)}
            className={`mx-auto animate-pulse transition-colors hover:text-foreground/80`}
            aria-label={'Power on'}
          >
            <Power className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
}
