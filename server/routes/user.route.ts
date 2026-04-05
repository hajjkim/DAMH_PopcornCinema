import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserStatus,
} from "../services/user.service";

const router = Router();

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Get all users
router.get("/", authenticate, authorize("ADMIN"), async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get any user by ID
router.get("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const user = await getUserById(String(req.params.id));
    res.status(200).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// Raw update any user record
router.put("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const user = await updateUser(String(req.params.id), req.body);
    res.status(200).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Change a user's role
router.patch("/admin/:id/role", authenticate, authorize("ADMIN"), async (req, res) => {
  const { role } = req.body;
  try {
    const user = await changeUserRole(String(req.params.id), role);
    res.status(200).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Change a user's status (active / banned / etc.)
router.patch("/admin/:id/status", authenticate, authorize("ADMIN"), async (req, res) => {
  const { status } = req.body;
  try {
    const user = await changeUserStatus(String(req.params.id), status);
    res.status(200).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Delete a user
router.delete("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    await deleteUser(String(req.params.id));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// ─── User routes (all require authentication) ─────────────────────────────────

// Get the authenticated user's own profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const profile = await getProfile(req.auth!.userId);
    res.status(200).json(profile);
  } catch (err: any) {
    res.status(404).json({ message: err.message || "User not found" });
  }
});

// Update the authenticated user's own profile (supports avatar upload)
router.patch("/me", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    // Use uploaded file URL if a file was provided, otherwise fall back to
    // body value (e.g. an existing URL the client already knows about)
    const avatar = (req as any).file
      ? `http://localhost:5000/uploads/${((req as any).file).filename}`
      : req.body.avatar;

    const updatedProfile = await updateProfile(req.auth!.userId, {
      fullName,
      phone,
      avatar,
    });

    res.status(200).json(updatedProfile);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

export default router;