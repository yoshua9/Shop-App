import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, pricetagOutline } from 'ionicons/icons';
import { catchError, finalize, of } from 'rxjs';

import { ProductService } from 'src/app/core/services/product.service';
import { ProductDetail } from 'src/app/core/interfaces/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonText,
    IonSpinner,
    IonButton,
    IonIcon,
  ],
})
export class ProductDetailPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly product = signal<ProductDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    addIcons({ pricetagOutline, alertCircleOutline });

    const idParam = this.route.snapshot.paramMap.get('id');
    const productId = idParam ? Number(idParam) : null;

    if (!productId) {
      this.error.set('ID de producto inválido.');
      this.isLoading.set(false);
      return;
    }

    this.loadProduct(productId);
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService
      .getProductById(id)
      .pipe(
        catchError(() => {
          this.error.set('No se pudo cargar el producto.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((product) => {
        this.product.set(product);
      });
  }

  goBack(): void {
    this.router.navigate(['/tabs/products'], { replaceUrl: true });
  }
}
