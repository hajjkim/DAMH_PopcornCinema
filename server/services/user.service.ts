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
