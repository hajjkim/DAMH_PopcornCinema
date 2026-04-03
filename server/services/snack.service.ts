import { Snack } from "../schemas/snack.schema";

export const getAllSnacks = async () => {
  return Snack.find().lean();
};