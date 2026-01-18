import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, retry } from 'rxjs';

import {
  ProductDetailResponse,
  ProductDetail,
  ProductListResponse,
  ProductSummary,
} from '../interfaces/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<ProductSummary[]> {
    const params = new HttpParams()
      .set('display', '[id,name,price]')
      .set('output_format', 'JSON');

    return this.http
      .get<ProductListResponse>(`${environment.apiUrl}/products`, { params })
      .pipe(
        retry(1),
        map((response) =>
          (response?.products ?? []).map((product) => ({
            id: Number(product.id),
            name: typeof product.name === 'string' ? product.name : 'Producto',
            price: Number(product.price),
          })),
        ),
      );
  }

  getProductById(id: number): Observable<ProductDetail> {
    const params = new HttpParams().set('output_format', 'JSON');

    return this.http
      .get<ProductDetailResponse>(`${environment.apiUrl}/products/${id}`, { params })
      .pipe(
        retry(1),
        map((response) => {
          const product = response?.product;
          if (!product) {
            throw new Error('Producto no encontrado');
          }

          let productName = 'Producto';
          if (typeof product.name === 'string') {
            productName = product.name;
          } else if (product.name && typeof product.name === 'object') {
            productName = Array.isArray(product.name) ? product.name[0]?.value : (product.name as any).value || 'Producto';
          }

          return {
            id: Number(product.id),
            name: productName,
            price: Number(product.price) || 0,
            description: product.description ?? '',
            descriptionShort: product.description_short ?? '',
            reference: product.reference ?? 'N/A',
            condition: product.condition ?? 'new',
          };
        }),
      );
  }
}
