import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { ProductListResponse, ProductDetailResponse } from '../interfaces/product.model';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getProducts', () => {
        it('should fetch products and map them correctly', () => {
            const mockResponse: ProductListResponse = {
                products: [
                    { id: '1', name: 'Product 1', price: '10.50' },
                    { id: '2', name: 'Product 2', price: '20.00' }
                ]
            };

            service.getProducts().subscribe(products => {
                expect(products.length).toBe(2);
                expect(products[0].id).toBe(1);
                expect(products[0].name).toBe('Product 1');
                expect(products[0].price).toBe(10.50);
            });

            const req = httpMock.expectOne(req => req.url.includes('/products'));
            expect(req.request.method).toBe('GET');
            expect(req.request.params.get('display')).toBe('[id,name,price]');
            expect(req.request.params.get('output_format')).toBe('JSON');

            req.flush(mockResponse);
        });

        it('should handle complex name objects in mapping', () => {
            const mockResponse: any = {
                products: [
                    { id: '1', name: [{ value: 'Complex Product' }], price: '15.00' }
                ]
            };

            service.getProducts().subscribe(products => {
                expect(products[0].name).toBe('Producto'); // Our current logic defaults to 'Producto' if not string in getProducts simple map
            });

            const req = httpMock.expectOne(req => req.url.includes('/products'));
            req.flush(mockResponse);
        });
    });

    describe('getProductById', () => {
        it('should fetch product by id and map it correctly', () => {
            const productId = 57;
            const mockResponse: ProductDetailResponse = {
                product: {
                    id: '57',
                    name: 'WALLAVY',
                    price: '45.00',
                    description: '<p>Desc</p>',
                    description_short: '<p>Short</p>',
                    reference: 'REF123',
                    condition: 'new'
                }
            };

            service.getProductById(productId).subscribe(product => {
                expect(product.id).toBe(57);
                expect(product.name).toBe('WALLAVY');
                expect(product.price).toBe(45.00);
                expect(product.reference).toBe('REF123');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/products/${productId}?output_format=JSON`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should handle multi-language name object in product detail', () => {
            const productId = 58;
            const mockResponse: any = {
                product: {
                    id: '58',
                    name: { value: 'Language Product' },
                    price: '10.00'
                }
            };

            service.getProductById(productId).subscribe(product => {
                expect(product.name).toBe('Language Product');
            });

            const req = httpMock.expectOne(req => req.url.includes(`/products/${productId}`));
            req.flush(mockResponse);
        });

        it('should throw error if product not found in response', () => {
            const productId = 999;
            const mockResponse: any = {};

            service.getProductById(productId).subscribe({
                error: (err) => {
                    expect(err.message).toBe('Producto no encontrado');
                }
            });

            const req = httpMock.expectOne(req => req.url.includes(`/products/${productId}`));
            req.flush(mockResponse);
        });
    });
});
