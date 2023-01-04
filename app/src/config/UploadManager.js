'use strict';

const multer = require('multer');
const moment = require('moment');
const fs = require('fs');

class UploadManager {
  constructor(path) {
    this.path = path;
    this.multer = multer;
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const upload_path = this.path;
      fs.mkdirSync(upload_path, { recursive: true });
      cb(null, upload_path);
    },
    filename: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, moment().format('YYYYMMDDHHmmss') + '_' + file.originalname);
    },
  });
}

module.exports = UploadManager;
