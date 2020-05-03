// Importing routes
import uploadRoutes from './upload.route';

export default function (app) {
  // routes apps
  app.use('/api/upload', uploadRoutes);
}
