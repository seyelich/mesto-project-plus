import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { CustomError } from '../types';
import InvalidReqError from '../exceptions/invalidRequset';
import { ERROR_CODE_500 } from '../constants/status-codes';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let error = {
    statusCode: err.statusCode ? err.statusCode : ERROR_CODE_500,
    message: err.message,
  };

  if ((err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError)) {
    error = new InvalidReqError('Введены неверные данные');
  }

  res
    .status(error.statusCode)
    .send({
      message: error.statusCode === 500
        ? 'На сервере произошла ошибка'
        : error.message,
    });
};

export default errorHandler;
