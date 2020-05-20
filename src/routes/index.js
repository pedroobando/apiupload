// Importing routes
import uploadRoutes from './upload.route';
// import express from 'express';
// import path from 'path';

// import htmlIndex from '../index.html';

// import from 'express';
// import path from 'path';

const rutaStatic = path.join(__dirname,'./html');
// const rutaStatic = __dirname + '../public/uploads';
// console.log(rutaStatic);

export default function (app) {
  // routes apps
  app.use('/api/upload', uploadRoutes);

  // app.use('/public', );
  
  app.get('/', (req, res) => {
    res.sendFile('/archivo.html', {root:__dirname});
  });

  app.use('/raiz',express.static(rutaStatic));
  // app.get('/raiz', (req, res) => {
  //   res.sendFile('./html/index.html', {root:__dirname});
  // });


  app.use(function(req, res, next) {
    res.status(404).json({data:{msg: `Error 404 - No logro encontrar la ruta`});
  })  
  
}

