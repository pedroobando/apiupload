/* eslint-disable no-console */
import '@babel/polyfill';
import serve, { thePort, theHost } from './server';
import { name, version } from '../package.json';

require('dotenv').config();

const main = () => {
  serve.listen(thePort, () => {
    console.log(`http://${theHost}:${thePort}/`);
    console.log(`Starting ${name} v${version} in ${process.env.NODE_ENV} mode :-)`);
  });
};

main();
