import { Auditorium } from "../schemas/auditorium.schema";

export const getAllAuditoriums = async () => {
    return await Auditorium.find()
        .populate("cinemaId")
        .sort({ createdAt: -1 });
};

export const getAuditoriumById = async (id: string) => {
    const auditorium = await Auditorium.findById(id).populate("cinemaId");
    if (!auditorium) throw new Error("Auditorium not found");
    return auditorium;
};

export const createAuditorium = async (data: {
    cinemaId: string;
    name: string;
    totalRows: number;
    totalColumns: number;
    seatCapacity: number;
    status?: "ACTIVE" | "INACTIVE";
    }) => {
    return await Auditorium.create(data);
};

export const updateAuditorium = async (id: string, data: any) => {
    const auditorium = await Auditorium.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!auditorium) throw new Error("Auditorium not found");
    return auditorium;
};

export const deleteAuditorium = async (id: string) => {
    const auditorium = await Auditorium.findByIdAndDelete(id);
    if (!auditorium) throw new Error("Auditorium not found");
    return auditorium;
};