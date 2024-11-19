import { ProductCart } from '@/interfaces/product-cart';
import { useMemo } from 'react';

interface Props {
  toggleReceipt: () => void;
  cart: ProductCart[];
  startTime: string;
}

export const Receipt = ({ cart, toggleReceipt, startTime }: Props) => {
  const orderNumber = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);
  const orderTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => orderTotal * 0.16, [orderTotal]);

  return (
    <div className="fixed inset-0 z-[5] flex items-center justify-center bg-background/80" onClick={toggleReceipt}>
      <div className="w-full max-h-[90vh] overflow-auto max-w-md border bg-background p-8 font-mono" onClick={e => e.stopPropagation()}>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">EL TOPO</h1>
          <div>{startTime}</div>
          <div className="mt-2">ORDEN #{orderNumber}</div>
        </div>

        <div className="mb-6">
          <div>Vendendor: Emirchus</div>
          <div>@emirchus</div>
        </div>

        <div className="mb-6 border-b border-t border-dashed py-4">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between">
              <p className='truncate'>
                {item.quantity}x {item.title}
              </p>
              <div>${item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 border-b border-t border-dashed border-border py-4">
          <div className="flex justify-between">
            <div>SUBTOTAL:</div>
            <div>${orderTotal.toFixed(2)}</div>
          </div>
          <div className="flex justify-between">
            <div>IVA (16%):</div>
            <div>${tax.toFixed(2)}</div>
          </div>
          <div className="mt-2 flex justify-between font-bold">
            <div>TOTAL:</div>
            <div>${(orderTotal + tax).toFixed(2)}</div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div>Atendido por: Wallbit©</div>
          <div>{new Date().toLocaleTimeString()}</div>
        </div>

        <div className="mb-6 text-center">
          <div>CÓDIGO DE CUPÓN: {Math.random().toString(36).substring(2, 6).toUpperCase()}-GONCYBIT</div>
          <div>Guardalo para tu próxima compra!</div>
        </div>

        <div className="text-center">
          <div className="mb-4">GRACIAS POR TU COMPRA!</div>
          <div className="border-t pt-4">el-topo.emirchus.ar</div>
        </div>
      </div>
    </div>
  );
};
