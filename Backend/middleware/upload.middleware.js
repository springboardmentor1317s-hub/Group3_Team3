import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/events folder exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'events');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `event-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed'), false);
  }
};

export const uploadEventImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).single('image');

// Middleware wrapper with error handling
export const handleUpload = (req, res, next) => {
  uploadEventImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};