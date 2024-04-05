import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFileOptions,
} from '@nestjs/common';

export const fileValidationOptions: ParseFileOptions = {
  validators: [
    new MaxFileSizeValidator({ maxSize: 10000000 }),
    new FileTypeValidator({ fileType: /image\/*/ }),
  ],
  fileIsRequired: true,
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
