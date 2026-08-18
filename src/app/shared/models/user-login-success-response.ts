import { IUserTokenSuccessAuthResponse } from './user-token-success-auth-response';

export interface IUserLoginSuccessResponse {
  token: string;
  user: IUserTokenSuccessAuthResponse;
}
