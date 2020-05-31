import '@babel/polyfill';
import express, {json} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routeApps from './routes';
import uploadApps from './uploads';


// initialization
const serve = express();
dotenv.config();

// initialization consts
export const thePort =  process.env.PORT || 3001;
export const theHost = process.env.HOST || '0.0.0.0';

// middlewares
if (process.env.NODE_ENV === 'DEV') {
  serve.use(morgan('dev'));  
}

serve
  .use(cors())
  .use(json())
  .use(uploadApps())

routeApps(serve);

export default serve;