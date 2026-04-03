import { Router } from "express";
import { login, register } from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: "fullName, email, password are required" });
      return;
    }

    if (String(password).length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const result = await register({
      fullName: String(fullName),
      email: String(email),
      password: String(password),
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Register failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const result = await login({
      email: String(email),
      password: String(password),
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Login failed" });
  }
});

export default router;
