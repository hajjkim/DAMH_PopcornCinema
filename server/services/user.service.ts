import { IUserDocument, User } from "../schemas/user.schema";

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  avatar?: string;
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

// User profile functions (for users)
export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
};

export const updateProfile = async (
  userId: string,
  payload: UpdateProfileInput
) => {
  const updateData: UpdateProfileInput = {};

  if (typeof payload.fullName === "string") {
    updateData.fullName = payload.fullName.trim();
  }

  if (typeof payload.phone === "string") {
    updateData.phone = payload.phone.trim();
  }

  if (typeof payload.avatar === "string") {
    updateData.avatar = payload.avatar.trim();
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
};

// Admin user management functions
export const getAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

export const changeUserRole = async (id: string, role: "CUSTOMER" | "ADMIN") => {
  const user = await User.findByIdAndUpdate(id, { role }, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const changeUserStatus = async (id: string, status: "ACTIVE" | "INACTIVE") => {
  const user = await User.findByIdAndUpdate(id, { status }, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error("User not found");
  return user;
};
