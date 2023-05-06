import { ERROR_CODE_409 } from '../constants/status-codes';

export default class ConflictError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_409;
    this.name = 'Conflict';
  }
}
