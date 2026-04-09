import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AutResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { tap } from 'rxjs';
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
  private _token = signal<string | null>(null);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string) {
    return this.http
      .post<AutResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('response', response);
          this._user.set(response.user);
          this._token.set(response.token);
          this._authStatus.set('authenticated');

          localStorage.setItem('token', response.token);
        }),
      );
  }
}
