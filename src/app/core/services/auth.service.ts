import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap, throwError } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const FAKE_USER = {
  username: 'admin',
  password: 'admin',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken(),
  );

  login(username: string, password: string): Observable<void> {
    const isValid =
      username.trim().toLowerCase() === FAKE_USER.username &&
      password === FAKE_USER.password;

    if (!isValid) {
      return throwError(() => new Error('Credenciales inválidas.'));
    }

    return of(void 0).pipe(
      tap(() => {
        localStorage.setItem(TOKEN_KEY, 'fake-token');
        this.isAuthenticatedSubject.next(true);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }
}
