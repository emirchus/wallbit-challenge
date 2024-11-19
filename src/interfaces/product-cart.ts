import { Product } from './product';

export interface ProductCart extends Product {
  quantity: number;
}
