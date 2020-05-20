// Importing routes
import uploadRoutes from './upload.route';
import express from 'express';
// import path from 'path';

// import htmlIndex from '../index.html';

// import from 'express';
import path from 'path';


const rutaFileStatic = path.join(__dirname,'../../public/uploads');

const rutaRaizStatic = path.join(__dirname,'../html');
// const rutaStatic = __dirname + '../public/uploads';
// console.log(rutaStatic);

export default function (app) {
  // routes apps
  app.use('/api/upload', uploadRoutes);

  // app.get('/', (req, res) => {
  //   res.sendFile('/archivo.html', {root:__dirname});
  // });

  console.log(rutaRaizStatic);
  console.log(rutaFileStatic);

  app.use('/', express.static(rutaRaizStatic));
  app.use('/public', express.static(rutaFileStatic));

  app.use(function(req, res, next) {
    res.status(404).json({data:{msg: `Error 404 - No logro encontrar la ruta`}});
  })  
  
}

