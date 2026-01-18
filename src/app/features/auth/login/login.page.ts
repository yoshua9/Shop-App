import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { storefrontOutline } from 'ionicons/icons';

import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
  ],
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = false;

  constructor() {
    addIcons({ storefrontOutline });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    this.isLoading = true;
    this.form.disable({ emitEvent: false });
    this.authService
      .login(trimmedUsername, trimmedPassword)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.form.enable({ emitEvent: false });
        }),
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/tabs/products', { replaceUrl: true }),
        error: (error: Error) => {
          this.presentToast(error.message || 'Credenciales inválidas.');
        },
      });
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
