import { ERROR_CODE_404 } from '../constants/status-codes';

export default class NotFoundError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_404;
    this.name = 'NotFound';
  }
}
