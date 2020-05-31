import uploadRoutes from './upload.route'
import express from 'express';
import path from 'path';

const rutaFileStatic = path.join(__dirname,'../../public/uploads');
const rutaRaizStatic = path.join(__dirname,'../html');

const rutaError404 = (req, res) => {
  res.status(404).json({data:{msg: `Error 404 - No logro encontrar la ruta`}});
}

export default function (app) {
  // routes apps
  app.use('/api/file', uploadRoutes);

  app.use('/', express.static(rutaRaizStatic));
  app.use('/public', express.static(rutaFileStatic));

  app.use(rutaError404);
}

