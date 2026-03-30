import { Cinema } from "../schemas/cinema.schema";

export const getAllCinemas = async () => {
    return await Cinema.find().sort({ createdAt: -1 });
};

export const getCinemaById = async (id: string) => {
    const cinema = await Cinema.findById(id);
    if (!cinema) throw new Error("Cinema not found");
    return cinema;
};

export const createCinema = async (data: {
    name: string;
    address: string;
    city: string;
    status?: "ACTIVE" | "INACTIVE";
    }) => {
    return await Cinema.create(data);
};

export const updateCinema = async (id: string, data: any) => {
    const cinema = await Cinema.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!cinema) throw new Error("Cinema not found");
    return cinema;
};

export const deleteCinema = async (id: string) => {
    const cinema = await Cinema.findByIdAndDelete(id);
    if (!cinema) throw new Error("Cinema not found");
    return cinema;
};