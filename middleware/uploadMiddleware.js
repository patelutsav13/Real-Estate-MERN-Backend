import multer from 'multer';
import path from 'path';

// Set storage engine
// Set storage engine
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  // STRICTLY ALLOW ONLY: jpeg, jpg, png
  const filetypes = /jpeg|jpg|png|jfif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log("Checking file:", file.originalname, "Mime:", file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.error("File type rejected:", file.mimetype, file.originalname);
    cb('Error: Images Only! (jpeg, jpg, png, jfif, webp)');
  }
}

export default upload;




