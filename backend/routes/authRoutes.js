import express from "express";
import { login, getProfile, createUser } from "../controllers/authController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/create-user', authenticate, authorize, createUser);

export default router;
