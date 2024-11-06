import multer from 'multer';

const storage = multer.memoryStorage(); // Or set to a disk storage

export const singleUpload =  multer({ storage }).single("file");

