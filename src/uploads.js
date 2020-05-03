import path from 'path';
import multer from 'multer';

const _MULTER_CFG = {
  dest: path.join(__dirname, '../public/uploads' )
}

export default function()  {
  return multer(_MULTER_CFG).single('image');
}
