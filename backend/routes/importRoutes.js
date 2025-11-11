import express from 'express';
import { uploadRipsJson, uploadRipsJsonFile } from '../controllers/importController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadSingleFile } from '../config/multer.js';

const router = express.Router();


router.post('/upload-json', authenticate, authorize, uploadRipsJson);


router.post(
    '/upload-json-file',
    authenticate,
    authorize,
    uploadSingleFile,
    uploadRipsJsonFile
);

export default router;