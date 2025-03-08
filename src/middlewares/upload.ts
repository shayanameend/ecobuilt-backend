import type { Request, Response, NextFunction } from "express";

import path from "node:path";
import fs from "node:fs";

import multer from "multer";

const UPLOAD_PATH = path.join(__dirname, "../../uploads");
const IMAGE_PATH = path.join(UPLOAD_PATH, "images");
const DOCUMENT_PATH = path.join(UPLOAD_PATH, "documents");
const VIDEO_PATH = path.join(UPLOAD_PATH, "videos");
const AUDIO_PATH = path.join(UPLOAD_PATH, "audio");

for (const dir of [
  UPLOAD_PATH,
  IMAGE_PATH,
  DOCUMENT_PATH,
  VIDEO_PATH,
  AUDIO_PATH,
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  default: 20 * 1024 * 1024, // 20MB
};

const FILE_TYPES = {
  image: /jpeg|jpg|png|gif|webp|svg/i,
  document: /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|json|md/i,
  video: /mp4|mkv|wmv|avi|mov|flv|webm/i,
  audio: /mp3|wav|ogg|aac|flac/i,
};

interface FileType {
  mimetype: string;
  originalname: string;
}

const getStorage = (destination: string) => {
  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      cb(null, destination);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  });
};

const fileFilter = (allowedTypes: RegExp) => {
  return (_req: Request, file: FileType, cb: multer.FileFilterCallback) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const mimetype = file.mimetype.split("/")[1];

    if (allowedTypes.test(extension) || allowedTypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes}`));
    }
  };
};

interface CustomUploadOptions {
  destination?: string;
  maxSize?: number;
  allowedTypes?: RegExp;
  filename?: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => void;
}

const imageUpload = multer({
  storage: getStorage(IMAGE_PATH),
  limits: { fileSize: SIZE_LIMITS.image },
  fileFilter: fileFilter(FILE_TYPES.image),
});

const documentUpload = multer({
  storage: getStorage(DOCUMENT_PATH),
  limits: { fileSize: SIZE_LIMITS.document },
  fileFilter: fileFilter(FILE_TYPES.document),
});

const videoUpload = multer({
  storage: getStorage(VIDEO_PATH),
  limits: { fileSize: SIZE_LIMITS.video },
  fileFilter: fileFilter(FILE_TYPES.video),
});

const audioUpload = multer({
  storage: getStorage(AUDIO_PATH),
  limits: { fileSize: SIZE_LIMITS.audio },
  fileFilter: fileFilter(FILE_TYPES.audio),
});

const anyFileUpload = multer({
  storage: getStorage(UPLOAD_PATH),
  limits: { fileSize: SIZE_LIMITS.default },
});

interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

const customUpload = (options: CustomUploadOptions) => {
  const config: multer.Options = {
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        const destination = options.destination || UPLOAD_PATH;
        cb(null, destination);
      },
      filename:
        options.filename ||
        ((_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        }),
    }),
    limits: { fileSize: options.maxSize || SIZE_LIMITS.default },
  };

  if (options.allowedTypes) {
    config.fileFilter = fileFilter(options.allowedTypes);
  }

  return multer(config);
};

const handleMulterError = (
  err: Error | multer.MulterError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds limit",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

const addFilesToResponse = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const req = _req as Request & {
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
    uploadedFile?: UploadedFile;
    uploadedFiles?: UploadedFile[] | { [fieldname: string]: UploadedFile[] };
  };

  if (req.file) {
    req.uploadedFile = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };
  } else if (req.files) {
    if (Array.isArray(req.files)) {
      req.uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      }));
    } else {
      req.uploadedFiles = {} as { [fieldname: string]: UploadedFile[] };

      for (const fieldName of Object.keys(req.files)) {
        (req.uploadedFiles as { [fieldname: string]: UploadedFile[] })[
          fieldName
        ] = req.files[fieldName].map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        }));
      }
    }
  }

  next();
};

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: SIZE_LIMITS.default },
});

const uploadOne = (fieldName: string) => {
  const upload = anyFileUpload.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      addFilesToResponse(req, res, next);
    });
  };
};

const uploadMultiple = (fieldName: string, maxCount = 10) => {
  const upload = anyFileUpload.array(fieldName, maxCount);
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      addFilesToResponse(req, res, next);
    });
  };
};

export default {
  uploadSingleImage: (fieldName: string) => imageUpload.single(fieldName),
  uploadSingleDocument: (fieldName: string) => documentUpload.single(fieldName),
  uploadSingleVideo: (fieldName: string) => videoUpload.single(fieldName),
  uploadSingleAudio: (fieldName: string) => audioUpload.single(fieldName),
  uploadSingleFile: (fieldName: string) => anyFileUpload.single(fieldName),

  uploadMultipleImages: (fieldName: string, maxCount: number) =>
    imageUpload.array(fieldName, maxCount),
  uploadMultipleDocuments: (fieldName: string, maxCount: number) =>
    documentUpload.array(fieldName, maxCount),
  uploadMultipleVideos: (fieldName: string, maxCount: number) =>
    videoUpload.array(fieldName, maxCount),
  uploadMultipleAudios: (fieldName: string, maxCount: number) =>
    audioUpload.array(fieldName, maxCount),
  uploadMultipleFiles: (fieldName: string, maxCount: number) =>
    anyFileUpload.array(fieldName, maxCount),

  uploadFields: (fields: { name: string; maxCount?: number }[]) =>
    anyFileUpload.fields(fields),
  uploadImageFields: (fields: { name: string; maxCount?: number }[]) =>
    imageUpload.fields(fields),
  uploadDocumentFields: (fields: { name: string; maxCount?: number }[]) =>
    documentUpload.fields(fields),
  uploadVideoFields: (fields: { name: string; maxCount?: number }[]) =>
    videoUpload.fields(fields),
  uploadAudioFields: (fields: { name: string; maxCount?: number }[]) =>
    audioUpload.fields(fields),

  uploadToMemory: (fieldName: string) => memoryUpload.single(fieldName),
  uploadMultipleToMemory: (fieldName: string, maxCount: number) =>
    memoryUpload.array(fieldName, maxCount),
  uploadFieldsToMemory: (fields: { name: string; maxCount?: number }[]) =>
    memoryUpload.fields(fields),

  one: uploadOne,
  multiple: uploadMultiple,

  custom: customUpload,

  handleMulterError,
  addFilesToResponse,

  constants: {
    UPLOAD_PATH,
    IMAGE_PATH,
    DOCUMENT_PATH,
    VIDEO_PATH,
    AUDIO_PATH,
    SIZE_LIMITS,
    FILE_TYPES,
  },
};
