import express from 'express';
import mongoose from 'mongoose';
import { errors, celebrate, Joi } from 'celebrate';
import router from './routes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { ERROR_CODE_404 } from './constants/status-codes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import urlRegex from './constants/url';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().regex(urlRegex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(router);
app.use((req, res, next) => {
  res.status(ERROR_CODE_404).send({ message: 'Такой страницы не существует' });
  next();
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await app.listen(PORT, () => {
      console.log('Server listeting on port', PORT);
    });
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  } catch (error) {
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log('Ошибка подключения к базе данных');
    }
    console.log('Ошибка запуска сервера', error);
  }
}

connect();
