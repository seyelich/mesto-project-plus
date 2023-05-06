import { ERROR_CODE_400 } from '../constants/status-codes';

export default class InvalidReqError extends Error {
  statusCode: number;

  name: string;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_400;
    this.name = 'Invalid Request';
  }
}
