const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où stocker
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtre des types de fichiers
const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.mp4', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Type de fichier non autorisé !'), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
