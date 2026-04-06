import { IUserDocument, User } from "../schemas/user.schema";
import { comparePassword, hashPassword } from "../utils/hash";
import { signAccessToken } from "../utils/jwt";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const sanitizeUser = (user: IUserDocument) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async ({ fullName, email, password }: RegisterInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const newUser = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "CUSTOMER",
    status: "ACTIVE",
  });

  const token = signAccessToken({
    userId: newUser._id.toString(),
    role: newUser.role,
  });

  return {
    token,
    user: sanitizeUser(newUser),
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  // .select("+passwordHash") cần thiết nếu schema có passwordHash: { select: false }
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User account is inactive");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};