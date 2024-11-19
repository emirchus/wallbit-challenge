import { Cart } from '@/interfaces/cart';
import { ProductCart } from '@/interfaces/product-cart';
import { addProductToCart, createCart, getCart, removeProductFromCart, updateProductInCart } from '@/lib/storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type CartContextProviderProps = {
  children: React.ReactNode;
};

type CartContextType = {
  cart: Cart;
  addProduct: (product: ProductCart) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
  updateProduct: (product: ProductCart) => void;
};

const CartContext = createContext({} as CartContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [cart, setCart] = useState<Cart>();

  useEffect(() => {
    if (!cart) {
      const hasCart = getCart();

      setCart(hasCart ?? createCart());
    }
  }, [cart]);

  const addProduct = useCallback((productCart: ProductCart) => {
    setCart(addProductToCart(productCart));
  }, []);

  const updateProduct = useCallback((productCart: ProductCart) => {
    setCart(updateProductInCart(productCart));
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setCart(removeProductFromCart(productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart(createCart());
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: cart!,
        addProduct,
        updateProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
