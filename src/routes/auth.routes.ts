import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/login
 * @desc    Login user (BA or Supervisor)
 * @access  Public
 */
router.post("/login", (req, res) => authController.login(req, res));

/**
 * @route   POST /api/auth/upload-selfie
 * @desc    Upload selfie for check-in
 * @access  Public
 */
router.post("/upload-selfie", upload.single("image") as any, (req, res) =>
  authController.uploadSelfie(req, res)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post("/logout", (req, res) => authController.logout(req, res));

/**
 * @route   PUT /api/auth/profile-picture
 * @desc    Update user profile picture
 * @access  Public
 */
router.put("/profile-picture", upload.single("photo") as any, (req, res) =>
  authController.updateProfilePicture(req, res)
);

export default router;
