import { Cinema } from "../schemas/cinema.schema";
import { Auditorium } from "../schemas/auditorium.schema";

export const getAllCinemas = async () => {
    const cinemas = await Cinema.find().sort({ createdAt: -1 }).lean();
    const counts = await Auditorium.aggregate([
        { $group: { _id: "$cinemaId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c: any) => [c._id.toString(), c.count]));
    return cinemas.map((c: any) => ({
        ...c,
        totalRooms: countMap.get(c._id.toString()) ?? 0,
    }));
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
    totalRooms?: number;
    phone?: string;
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