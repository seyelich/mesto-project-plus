import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { CustomRequest } from './types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const reqCustom = req as CustomRequest;
  reqCustom.user = {
    _id: '643feb85a75c3aee9e7a80f9',
  };

  next();
});

app.use(router);

app.use((req, res) => res.status(404).send({ message: 'Такой страницы не существует' }));

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
