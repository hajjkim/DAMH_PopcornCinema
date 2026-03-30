import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../schemas/user.schema";

// Đăng ký người dùng mới
export const register = async (fullName: string, email: string, password: string) => {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo user mới
    const newUser = new User({ fullName, email, passwordHash: hashedPassword });
    
    // Lưu vào database
    await newUser.save();
    
    // Trả về user đã lưu
    return newUser;
};

// Đăng nhập
export const login = async (email: string, password: string) => {
    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials");

    // Tạo JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    // Trả về token và user
    return { token, user };
};