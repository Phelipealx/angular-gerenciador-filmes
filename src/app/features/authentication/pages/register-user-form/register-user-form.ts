import { Component, computed, inject, signal } from '@angular/core';
import { email, Field, form, minLength, required, validate } from '@angular/forms/signals';
import { confirmPassword } from '../../validators/confirm-password';
import { UserApi } from '../../../../core/services/user-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { IRegisterParams } from '../../models/register-params';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-register-user-form',
  imports: [Field],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  private readonly _userApi = inject(UserApi);

  registerModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
    required(fieldPath.email, { message: 'Email is required' });
    required(fieldPath.password, { message: 'Password is required' });

    email(fieldPath.email, { message: 'Email is invalid' });

    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters long' });

    confirmPassword(fieldPath.confirmPassword, fieldPath.password);
  });

  registerParams = signal<IRegisterParams | undefined>(undefined);

  registerResource = rxResource({
    params: () => this.registerParams(),
    stream: ({ params }) => this._userApi.register(params.name, params.email, params.password),
  });

  registerSuccess = computed(() => {
    const SUCCESS_REGISTRATION = this.registerResource.hasValue();

    return SUCCESS_REGISTRATION ? 'User registered successfully!' : undefined;
  });
  registerError = computed(() => setErrorMessage(this.registerResource.error()));

  register() {
    const userInfos = this.registerForm().value();

    this.registerParams.set(userInfos);
  }
}
