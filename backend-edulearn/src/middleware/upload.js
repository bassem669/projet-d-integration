const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuration
const UPLOAD_DIR = "uploads/";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📁 Dossier uploads créé: ${path.resolve(UPLOAD_DIR)}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Extraire l'extension du fichier
    const ext = path.extname(file.originalname).toLowerCase();
    // Créer un nom sécurisé
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${baseName}${ext}`;
    
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = {
    // Images
    "image/jpeg": "jpg",
    "image/jpg": "jpg", 
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    
    // Vidéos
    "video/mp4": "mp4",
    "video/mpeg": "mpeg",
    "video/ogg": "ogv",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    
    // Documents
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/plain": "txt",
    
    // Archives
    "application/zip": "zip",
    "application/x-rar-compressed": "rar"
  };

  if (allowedTypes[file.mimetype]) {
    console.log(`✅ Fichier autorisé: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.log(`❌ Fichier rejeté: ${file.originalname} (${file.mimetype})`);
    cb(new Error(`Type de fichier non supporté. Types autorisés: ${Object.values(allowedTypes).join(', ')}`), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  }
});

// Middleware de gestion d'erreurs pour Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "Fichier trop volumineux",
        message: `La taille maximale autorisée est ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Trop de fichiers",
        message: `Maximum ${MAX_FILES} fichiers autorisés`
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Champ de fichier inattendu",
        message: "Vérifiez le nom du champ de fichier"
      });
    }
  } else if (err) {
    // Erreur de fileFilter personnalisée
    return res.status(400).json({
      error: "Erreur de fichier",
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};