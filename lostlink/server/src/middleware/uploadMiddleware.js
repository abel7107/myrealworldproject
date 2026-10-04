import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'));
};

export const uploadItemImage = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
