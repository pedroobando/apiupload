import path from 'path';
import multer from 'multer';

const _MULTER_CFG = {
  dest: path.join(__dirname, '../public/uploads' )
}
// Esto no funciona, se decidio realizar el cambio en el POST upload
// const _STORAGE_CFG = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../public/uploads' ))
//   },
//   filename: function (req, file, cb) {
//     const _fileNotSpaceWhite = file.originalname.split(' ').join('_');
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, _fileNotSpaceWhite);
//   }
// })

export default function()  {
  var upload = multer(_MULTER_CFG);
  return upload.single('fileups');
}
