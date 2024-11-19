import { Loader, TrashIcon } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getProduct } from '@/api';
import { useCart } from '@/provider/cart-provider';

export const CartForm = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const { addProduct, clearCart } = useCart();

  const [isPending, startTransition] = useTransition();
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

        addProduct({ ...product, quantity: Number(quantity) });

        setProductId('');
        setQuantity('');
      });
    }
  };

  return (
    <>
      {isPending && (
        <div className="fixed z-10 flex h-full w-full flex-col items-center justify-center bg-background/90">
          <Loader className="mb-4 h-12 w-12 animate-spin" />
          <div className="mb-2 text-2xl tracking-wider">Cargando producto...</div>
        </div>
      )}

      <fieldset className="mb-4 rounded border border-border/20 p-4 backdrop-blur-sm backdrop-brightness-125">
        <legend className="mb-4 text-xl tracking-wide"># Agrega los productos al carro de compra</legend>
        {error && <div className="mb-4 text-xl tracking-wide text-destructive">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-row flex-wrap gap-2">
          <Input
            value={productId}
            onChange={e => setProductId(e.target.value)}
            placeholder="ID del Producto"
            className="h-12 flex-grow border-border/20 bg-transparent text-foreground placeholder:text-foreground/50"
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
            min={0}
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
          <Button
            onClick={clearCart}
            className="h-12 bg-destructive/20 px-6 text-xl tracking-wide text-destructive-foreground hover:bg-destructive/80"
          >
            <TrashIcon /> Limpiar
          </Button>
        </form>
      </fieldset>
    </>
  );
};
