import { ERROR_CODE_403 } from '../constants/status-codes';

export default class ForbiddenError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_403;
    this.name = 'Forbidden';
  }
}
