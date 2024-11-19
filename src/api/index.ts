'use server';
import { Product } from '@/interfaces/product';

export const getProduct = async (id: number): Promise<Product | string> => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await response.json();
    return product;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return 'Error al obtener el producto';
  }
};
