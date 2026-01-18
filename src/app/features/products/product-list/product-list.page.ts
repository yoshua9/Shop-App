import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { catchError, finalize, of } from 'rxjs';

import { ProductService } from 'src/app/core/services/product.service';
import { ProductSummary } from 'src/app/core/interfaces/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonText,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class ProductListPage {
  private readonly productService = inject(ProductService);

  readonly products = signal<ProductSummary[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    addIcons({ chevronForwardOutline });
    this.loadProducts();
  }

  handleRefresh(event: any): void {
    this.productService
      .getProducts()
      .pipe(
        catchError(() => {
          this.error.set('No se pudieron actualizar los productos.');
          return of([]);
        }),
        finalize(() => {
          event.target.complete();
        }),
      )
      .subscribe((products) => {
        this.products.set(products);
      });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService
      .getProducts()
      .pipe(
        catchError(() => {
          this.error.set('No se pudieron cargar los productos.');
          return of([]);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((products) => {
        this.products.set(products);
      });
  }
}
