import { ERROR_CODE_401 } from '../constants/status-codes';

export default class AuthError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_401;
    this.name = 'Auth';
  }
}
