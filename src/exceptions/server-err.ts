import { ERROR_CODE_500 } from '../constants/status-codes';

export default class ServerError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_500;
    this.name = 'ServerError';
  }
}
