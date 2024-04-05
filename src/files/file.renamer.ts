import { extname } from 'path';

export const randomFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const randomName = Date.now().toString();
  console.log({ randomName: `${randomName}${fileExtName}` });
  callback(null, `${randomName}${fileExtName}`);
};
