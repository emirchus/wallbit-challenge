import { useCart } from '@/provider/cart-provider';
import { Input } from './ui/input';
import { ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export const CartTable = () => {
  const { cart, updateProduct, removeProduct } = useCart();
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const toggleSort = () => {
    setSort(sort === 'asc' ? 'desc' : 'asc');
  };

  const sortedProducts = useMemo(
    () =>
      (cart?.products ?? []).sort((a, b) => {
        if (sort === 'asc') {
          return a.title.localeCompare(b.title);
        }

        return b.title.localeCompare(a.title);
      }),
    [cart, sort]
  );

  return (
    <div className="max-w-[90vw] overflow-auto">
      <table className="w-full min-w-[600px]">
        <thead className="select-none">
          <tr className="border-b border-[#00ff95]/20">
            <th className="p-2 text-left">Cant</th>
            <th className="cursor-pointer p-2 text-left" onClick={toggleSort}>
              Nombre <ArrowUpDown className="inline h-4 w-4" />
            </th>
            <th className="p-2 text-right">Precio U</th>
            <th className="p-2 text-right">Precio T</th>
            <th className="p-2 text-center">Foto</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(item => (
            <tr key={JSON.stringify(item)} className="border-b border-border/10 hover:bg-background/80">
              <td className="max-w-[50px] p-2">
                <Input
                  defaultValue={item.quantity}
                  type="number"
                  min={0}
                  onBlur={e => {
                    const newQuantity = Number(e.currentTarget.value);

                    if (newQuantity !== item.quantity) {
                      if (newQuantity === 0) {
                        removeProduct(item.id);
                        return;
                      }

                      updateProduct({ ...item, quantity: newQuantity });
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
              <td className="truncate p-2">{item.title}</td>
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
  );
};
