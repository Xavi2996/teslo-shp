import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '@auth/services/auth-service.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  authService = inject(AuthServiceService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onsubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log({ email, password });

    this.authService.login(email!, password!).subscribe({
      next: (resp) => {
        console.log(resp);

        console.log('Login successful');
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
