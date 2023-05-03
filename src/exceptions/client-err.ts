import { ERROR_CODE_400 } from '../constants/status-codes';

export default class ClientError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_400;
    this.name = 'ClientError';
  }
}
