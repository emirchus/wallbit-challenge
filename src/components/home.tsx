import { Power, Printer, Terminal, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { CartForm } from './cart-form';
import { useCart } from '@/provider/cart-provider';
import { useCallback, useState } from 'react';
import { Receipt } from './receipt';
import { CartTable } from './cart-table';

interface Props {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isPoweredOn: boolean;
  togglePower: () => void;
}

export default function HomePage({ isPoweredOn, isSoundEnabled, togglePower, toggleSound }: Props) {
  const { cart } = useCart();

  const [showReceipt, setShowReceipt] = useState(false);

  const toggleReceipt = useCallback(() => setShowReceipt(!showReceipt), [showReceipt]);
  return (
    <main className='w-full grid min-h-screen grid-rows-[auto,auto,1fr]'>
      {showReceipt && cart && <Receipt cart={cart} toggleReceipt={toggleReceipt} />}
      <div className="mb-6 flex items-center justify-between gap-2 border-b border-border/20 pb-2 text-2xl">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6" />
          <span className="font-bold tracking-wider">root@el-topo:~$</span>
          <span className="animate-pulse">▊</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={'ghost'}
            onClick={toggleSound}
            className="transition-colors hover:text-foreground/80"
            aria-label={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {isSoundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
          <Button
            variant={'ghost'}
            onClick={togglePower}
            className={`transition-colors hover:text-foreground/80 ${isPoweredOn ? 'animate-pulse' : ''}`}
            aria-label={isPoweredOn ? 'Power off' : 'Power on'}
          >
            <Power className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <CartForm />
      <fieldset className="relative max-h-full rounded border border-border/20 p-4 backdrop-blur-sm backdrop-brightness-125 bg-border/10">
        <legend className="-ml-1 px-1 text-xl tracking-wide">
          # Carrito de compra {cart && `- Iniciado ${cart.createdAt.toLocaleDateString()}`}
        </legend>
        <div
          className="sticky top-0 mb-4 flex items-center justify-between"
          style={{
            backgroundAttachment: 'local',
          }}
        >
          {cart && cart.products.length > 0 && (
            <Button
              onClick={() => setShowReceipt(true)}
              className="bg-[#00ff95]/20 px-4 text-[#00ff95] hover:bg-[#00ff95]/30"
            >
              <Printer className="mr-2 h-5 w-5" />
              Imprimir Recibo
            </Button>
          )}
        </div>
        {cart && cart.products.length === 0 ? (
          <div className="text-xl tracking-wide text-[#00ff95]/70">
            No hay productos en el carro aun, prueba agregando arriba con su id y la cantidad que deseas ingresar
          </div>
        ) : (
          <CartTable />
        )}
      </fieldset>
    </main>
  );
}

{
  /* <CartForm
              startTime={startTime}
              isPoweredOn={isPoweringOff}
              isSoundEnabled={isSoundEnabled}
              togglePower={() => setIsPoweringOff(!isPoweringOff)}
              toggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            /> */
}
