import path from 'path';
import multer from 'multer';

const MULTER_CFG = {
  dest: path.join(__dirname, '../public/uploads'),
};

const uploads = () => {
  const upload = multer(MULTER_CFG);
  return upload.single('fileups');
};

export default uploads;
