import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import './controllers/LoginController';
import './controllers/RootController';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['asdf'],
  })
);
app.use(AppRouter.instance);

app.listen(3000, () => {
  console.log('Server listening on 3000');
});
