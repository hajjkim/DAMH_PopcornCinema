import { Snack } from "../schemas/snack.schema";

type CreateSnackInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  quantity?: number;
  status?: string;
};

type UpdateSnackInput = Partial<CreateSnackInput>;

export const getAllSnacks = async () => {
  return await Snack.find().sort({ createdAt: -1 });
};

export const getSnackById = async (id: string) => {
  const snack = await Snack.findById(id);
  if (!snack) throw new Error("Snack not found");
  return snack;
};

export const getSnacksByCategory = async (category: string) => {
  return await Snack.find({ category }).sort({ name: 1 });
};

export const getActiveSnacks = async () => {
  return await Snack.find({ status: "ACTIVE" }).sort({ name: 1 });
};

export const createSnack = async (data: CreateSnackInput) => {
  const snack = await Snack.create(data);
  return snack;
};

export const updateSnack = async (id: string, data: UpdateSnackInput) => {
  const snack = await Snack.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!snack) throw new Error("Snack not found");
  return snack;
};

export const deleteSnack = async (id: string) => {
  const snack = await Snack.findByIdAndDelete(id);
  if (!snack) throw new Error("Snack not found");
  return snack;
};

export const updateSnackQuantity = async (id: string, quantity: number) => {
  const snack = await Snack.findByIdAndUpdate(
    id,
    { quantity },
    { new: true, runValidators: true }
  );

  if (!snack) throw new Error("Snack not found");
  return snack;
};

export const updateSnackStatus = async (id: string, status: string) => {
  const snack = await Snack.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!snack) throw new Error("Snack not found");
  return snack;
};
