import type { NextFunction, Request, Response } from "express";

import fs from "node:fs";
import path from "node:path";

import multer from "multer";

const UPLOAD_PATH = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_PATH),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadOne = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message:
            err instanceof multer.MulterError
              ? err.code === "LIMIT_FILE_SIZE"
                ? "File too large"
                : err.message
              : err.message,
        });
      }
      next();
    });
  };
};

const uploadMultiple = (fieldName: string, maxCount = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message:
            err instanceof multer.MulterError
              ? err.code === "LIMIT_FILE_SIZE"
                ? "File too large"
                : err.message
              : err.message,
        });
      }
      next();
    });
  };
};

export { uploadOne, uploadMultiple };
