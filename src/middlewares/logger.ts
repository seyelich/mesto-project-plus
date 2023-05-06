import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = (name: string) => new winston.transports.DailyRotateFile({
  filename: `${name}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: 7,
});

export const requestLogger = expressWinston.logger({
  transports: [
    transport('request'),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    transport('error'),
  ],
  format: winston.format.json(),
});
