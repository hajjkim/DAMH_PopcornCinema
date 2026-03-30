import { Router } from "express";
import { register, login } from "../services/auth.service";

const router = Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const user = await register(fullName, email, password);
        res.status(201).json(user);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await login(email, password);
        res.json({ token, user });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;