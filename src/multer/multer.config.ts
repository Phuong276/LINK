import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  dest: './uploads', // Destination folder for uploaded files
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
};
