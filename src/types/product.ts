export interface ProductColor {
  name: string;
  className: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  colors?: ProductColor[];
  sizes?: number[];
}

export type SortOrder = 'none' | 'price-asc' | 'price-desc';
