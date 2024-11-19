import { Loader, Power, Printer, Terminal, Volume2, VolumeX } from 'lucide-react';
import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getProduct } from '@/api';
import { Receipt } from './receipt';
import { Cart } from '@/interfaces/cart';
import { addProductToCart, createCart, getCart, removeProductFromCart, updateCart } from '@/lib/storage';

interface Props {
  startTime: string;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isPoweredOn: boolean;
  togglePower: () => void;
}

export const CartForm = ({ startTime, isPoweredOn, isSoundEnabled, togglePower, toggleSound }: Props) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const [cart, setCart] = useState<Cart>();

  const [isPending, startTransition] = useTransition();
  const [showReceipt, setShowReceipt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId && quantity) {
      startTransition(async () => {
        const product = await getProduct(Number(productId));

        if (typeof product === 'string') {
          setError(product);
          return;
        }

        if (!cart) return;

        const newCart = addProductToCart({
          ...product,
          quantity: Number(quantity),
        });

        console.log(newCart);

        if (!newCart) return;

        setCart(newCart);

        setProductId('');
        setQuantity('');
      });
    }
  };

  const toggleReceipt = useCallback(() => setShowReceipt(!showReceipt), [showReceipt]);

  useEffect(() => {
    if (!cart) {
      const hasCart = getCart();

      setCart(hasCart ?? createCart());
    }
  }, [cart]);

  return (
    <main>
      {isPending && (
        <div className="fixed z-10 flex h-full w-full flex-col items-center justify-center bg-background/90">
          <Loader className="mb-4 h-12 w-12 animate-spin" />
          <div className="mb-2 text-2xl tracking-wider">Cargando producto...</div>
        </div>
      )}
      {showReceipt && cart && <Receipt cart={cart} toggleReceipt={toggleReceipt} />}
      <div className="mb-6 flex items-center justify-between gap-2 border-b border-[#00ff95]/20 pb-2 text-2xl">
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

      <div className="flex flex-col">
        <div className="mb-4 rounded border border-border/20 p-4 backdrop-blur-sm backdrop-brightness-125">
          <p className="mb-4 text-xl tracking-wide"># Agrega los productos al carro de compra</p>
          {error && <div className="mb-4 text-xl tracking-wide text-destructive">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-row flex-wrap gap-2">
            <Input
              value={productId}
              onChange={e => setProductId(e.target.value)}
              placeholder="ID del Producto"
              className="h-12 flex-grow border-border/20 bg-transparent text-xl text-foreground placeholder:text-foreground/50"
              onKeyDown={e => {
                const actionsKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

                if (isNaN(Number(e.key)) && !actionsKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <Input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="Cantidad"
              className="h-12 w-32 border-border/20 bg-transparent text-xl placeholder:text-foreground/50"
              onKeyDown={e => {
                const actionsKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

                if (isNaN(Number(e.key)) && !actionsKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <Button
              type="submit"
              className="h-12 bg-border/20 px-6 text-xl tracking-wide text-foreground hover:bg-foreground/30"
            >
              Agregar
            </Button>
          </form>
        </div>

        <div className="relative max-h-[50vh] overflow-auto rounded border border-border/20 p-4 backdrop-blur-sm backdrop-brightness-125">
          <div
            className="sticky top-0 mb-4 flex items-center justify-between"
            style={{
              backgroundAttachment: 'local',
            }}
          >
            <p className="text-xl tracking-wide"># Carrito de compra {startTime && `- Iniciado ${startTime}`}</p>
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
            <div className="w-full overflow-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#00ff95]/20">
                    <th className="p-2 text-left">Cant</th>
                    <th className="p-2 text-left">Nombre</th>
                    <th className="p-2 text-right">Precio U</th>
                    <th className="p-2 text-right">Precio T</th>
                    <th className="p-2 text-center">Foto</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.products.map((item, index) => (
                    <tr key={index} className="border-b border-border/10 hover:bg-background/80">
                      <td className="max-w-[50px] p-2">
                        <Input
                          defaultValue={item.quantity}
                          onBlur={e => {
                            const newQuantity = Number(e.currentTarget.value);

                            if (newQuantity !== item.quantity) {
                              if (newQuantity === 0) {
                                setCart(removeProductFromCart(item.id));
                                return;
                              }

                              const updatedProducts = cart.products.map(productCart =>
                                productCart.id === item.id ? { ...productCart, quantity: newQuantity } : productCart
                              );

                              setCart(
                                updateCart({
                                  ...cart,
                                  products: updatedProducts,
                                })
                              );
                            }
                          }}
                          onKeyDown={e => {
                            const actionsKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

                            if (isNaN(Number(e.key)) && !actionsKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </td>
                      <td className="p-2">{item.title}</td>
                      <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <img src={item.image} alt={item.title} className="h-6 w-6 object-cover" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
