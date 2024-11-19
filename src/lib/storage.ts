import { Cart } from '@/interfaces/cart';
import { ProductCart } from '@/interfaces/product-cart';

function getDataFromStorage<T>(key: string): T | undefined | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export const createCart = (): Cart => {
  const cart: Cart = {
    products: [],
    createdAt: new Date(),
  };

  localStorage.setItem('cart', JSON.stringify(cart));

  return cart;
};

export const updateCart = (cart: Cart): Cart => {
  localStorage.setItem('cart', JSON.stringify(cart));

  return cart;
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};

export const getCart = (): Cart | undefined | null => {
  let cart = getDataFromStorage<Cart>('cart');

  if(cart) {
    cart = {
      ...cart,
      createdAt: new Date(cart.createdAt),
    };
  }

  return cart;
};

export const getCartFromStorage = () => {
  const products = getDataFromStorage<Cart>('cart');
  return products;
};

export const addProductToCart = (product: ProductCart): Cart | undefined => {
  let cart = getCartFromStorage();

  if (!cart) return;

  const productIndex = cart.products.findIndex(productCart => productCart.id === product.id);

  if (productIndex !== -1) {
    const updatedProducts = cart.products.map(productCart =>
      productCart.id === product.id
        ? { ...productCart, quantity: productCart.quantity + product.quantity }
        : productCart
    );

    cart = updateCart({
      ...cart,
      products: updatedProducts,
    });
  } else {
    cart = updateCart({
      ...cart,
      products: [...cart.products, product],
    });
  }

  return cart;
};

export const removeProductFromCart = (id: number): Cart | undefined => {
  const cart = getCartFromStorage();

  if (!cart) return;

  const productsFilteres = cart.products.filter(product => product.id !== id);

  return updateCart({
    ...cart,
    products: productsFilteres,
  });
};
