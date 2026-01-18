import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListPage } from './product-list.page';
import { ProductService } from 'src/app/core/services/product.service';
import { of, Subject, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('ProductListPage', () => {
    let component: ProductListPage;
    let fixture: ComponentFixture<ProductListPage>;
    let productServiceMock: any;

    beforeEach(async () => {
        productServiceMock = {
            getProducts: jasmine.createSpy('getProducts').and.returnValue(new Subject().asObservable())
        };

        await TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), ProductListPage],
            providers: [
                { provide: ProductService, useValue: productServiceMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => null } }
                    }
                }
            ]
        }).compileComponents();
    });

    const createComponent = () => {
        fixture = TestBed.createComponent(ProductListPage);
        component = fixture.componentInstance;
    };

    it('should create', () => {
        createComponent();
        expect(component).toBeTruthy();
    });

    it('should show loading spinner while loading', () => {
        const productsSubject = new Subject<any[]>();
        productServiceMock.getProducts.and.returnValue(productsSubject.asObservable());

        createComponent();
        fixture.detectChanges();

        expect(component.isLoading()).toBeTrue();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('ion-spinner')).toBeTruthy();

        // Complete the request
        productsSubject.next([]);
        productsSubject.complete();
        fixture.detectChanges();
        expect(component.isLoading()).toBeFalse();
    });

    it('should render products on success', () => {
        const mockProducts = [
            { id: 1, name: 'Test Product', price: 10 }
        ];
        productServiceMock.getProducts.and.returnValue(of(mockProducts));

        createComponent();
        fixture.detectChanges();

        expect(component.products()).toEqual(mockProducts);
        expect(component.isLoading()).toBeFalse();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.product-name').textContent).toContain('Test Product');
    });

    it('should show error message on failure', () => {
        productServiceMock.getProducts.and.returnValue(throwError(() => new Error('API Error')));

        createComponent();
        fixture.detectChanges();

        expect(component.error()).toBe('No se pudieron cargar los productos.');
        expect(component.isLoading()).toBeFalse();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.helper-text').textContent).toContain('No se pudieron cargar los productos.');
    });
});
