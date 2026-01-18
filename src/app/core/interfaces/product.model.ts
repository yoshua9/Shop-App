export interface ProductSummary {
  id: number;
  name: string;
  price: number;
}

export interface RawProduct {
  id: string;
  name: string;
  price: string;
}

export interface ProductListResponse {
  products: RawProduct[];
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  descriptionShort: string;
  reference: string;
  condition: string;
}

export interface RawProductDetail {
  id: string;
  name: string | { language: any; value: string };
  price: string;
  description?: string;
  description_short?: string;
  reference?: string;
  condition?: string;
}

export interface ProductDetailResponse {
  product: RawProductDetail;
}
