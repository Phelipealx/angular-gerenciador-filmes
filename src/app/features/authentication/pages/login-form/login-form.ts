import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { email, Field, form, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserApi } from '../../../../core/services/user-api';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';
import { ILoginParams } from '../../models/login-params';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);

  loginModel = signal<ILoginParams>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    required(fieldPath.password, { message: 'Password is required' });

    email(fieldPath.email, { message: 'Email is invalid' });

    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters long' });
  });

  loginParams = signal<ILoginParams | undefined>(undefined);

  loginResource = rxResource({
    params: () => this.loginParams(),
    stream: ({ params }) =>
      this._userApi.login(params.email, params.password).pipe(
        tap(() => {
          this._router.navigate(['/explore']);
        }),
      ),
  });

  loginError = computed(() => setErrorMessage(this.loginResource.error()));

  login() {
    const credentials = this.loginForm().value();

    this.loginParams.set(credentials);
  }
}
