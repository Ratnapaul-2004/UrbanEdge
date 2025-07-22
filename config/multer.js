const multer = require('multer');
const path = require('path');
const mime = require('mime-types');

//----------Product Image Upload----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname);
  const mimetype = mime.lookup(file.originalname);

  if(ext && mimetype && mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const productUpload = multer({storage, fileFilter});

//----------Profile Image Upload-------------
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/profile_uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const profileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = mime.lookup(file.originalname);
  if (ext && mimetype && mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFilter
}); 

module.exports = {
  productUpload,
  profileUpload
};