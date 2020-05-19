// Importing routes
import uploadRoutes from './upload.route';
// import express from 'express';
// import path from 'path';

// import htmlIndex from '../index.html';

// import from 'express';
// import path from 'path';

// const rutaStatic = path.join(__dirname,'../public/uploads');
// const rutaStatic = __dirname + '../public/uploads';
// console.log(rutaStatic);

export default function (app) {
  // routes apps
  app.use('/api/upload', uploadRoutes);

  // app.use('/public',express.static(rutaStatic));

  // app.use('/public', );
  
  app.get('/', (req, res) => {
    res.sendFile('/archivo.html', {root:__dirname});
  });  
  
}

