import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { RetroScreen } from './components/retro-screen';
import { CartForm } from './components/cart-form';
import { cn } from './lib/utils';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [startTime, setStartTime] = useState<string>('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isPoweringOff, setIsPoweringOff] = useState(false);

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
          setStartTime(
            new Date().toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          );
          return 100;
        }
        const newProgress = oldProgress + 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

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
          <CartForm startTime={startTime} />
        )}
      </RetroScreen>

      {isPoweringOff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="text-4xl font-bold text-foreground"
            style={{
              animation: 'powerOff 2s reverse',
            }}
          >
            APAGANDO EQUIPO...
          </div>
        </div>
      )}
    </>
  );
}
