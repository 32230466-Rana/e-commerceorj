export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export type SortOrder = 'none' | 'price-asc' | 'price-desc';
