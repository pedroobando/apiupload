// Importing routes
import uploadRoutes from './upload.route';
// import htmlIndex from '../index.html';

export default function (app) {
  // routes apps
  app.use('/api/upload', uploadRoutes);
  app.get('/', (req, res) => {
    res.sendFile('/archivo.html', {root:__dirname});
  });  
  
}

