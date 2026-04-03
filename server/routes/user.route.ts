import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../services/user.service";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/me", authenticate, async (req, res) => {
  try {
    const auth = (req as any).auth;
    const profile = await getProfile(auth.userId);
    res.json(profile);
  } catch (err: any) {
    res.status(404).json({ message: err.message || "User not found" });
  }
});

router.patch(
  "/me",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const auth = (req as any).auth;

      const fullName = req.body.fullName;
      const phone = req.body.phone;

      let avatar = req.body.avatar;

      // nếu có upload file
      if (req.file) {
        avatar = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      const updatedProfile = await updateProfile(auth.userId, {
        fullName,
        phone,
        avatar,
      });

      res.json(updatedProfile);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Update failed" });
    }
  }
);

export default router;