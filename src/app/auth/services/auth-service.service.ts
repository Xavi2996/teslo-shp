import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AutResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private http = inject(HttpClient);

  private _authStatus = signal('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AutResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        map((response) => this.handleAuthSuccess(response)),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logOut();
      return of(false);
    }
    return this.http.get<AutResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error)),
    );
  }

  logOut() {
    localStorage.removeItem('token');
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
  }

  private handleAuthSuccess(response: AutResponse) {
    console.log('response', response);
    this._user.set(response.user);
    this._token.set(response.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', response.token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logOut();
    return of(false);
  }
}
