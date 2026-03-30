import { Showtime } from "../schemas/showtime.schema";

export const getAllShowtimes = async () => {
    return await Showtime.find()
        .populate("movieId")
        .populate({
        path: "auditoriumId",
        populate: {
            path: "cinemaId",
        },
        })
        .sort({ startTime: 1 });
};

export const getShowtimeById = async (id: string) => {
    const showtime = await Showtime.findById(id)
        .populate("movieId")
        .populate({
        path: "auditoriumId",
        populate: {
            path: "cinemaId",
        },
        });

    if (!showtime) throw new Error("Showtime not found");
    return showtime;
};

export const createShowtime = async (data: {
    movieId: string;
    auditoriumId: string;
    startTime: Date;
    endTime: Date;
    basePrice: number;
    status?: "OPEN" | "CLOSED" | "CANCELLED";
    }) => {
    const overlapping = await Showtime.findOne({
        auditoriumId: data.auditoriumId,
        $or: [
        {
            startTime: { $lt: data.endTime },
            endTime: { $gt: data.startTime },
        },
        ],
    });

    if (overlapping) {
        throw new Error("Showtime overlaps with an existing showtime in this auditorium");
    }

    return await Showtime.create(data);
};

export const updateShowtime = async (id: string, data: any) => {
    const currentShowtime = await Showtime.findById(id);
    if (!currentShowtime) throw new Error("Showtime not found");

    const auditoriumId = data.auditoriumId || currentShowtime.auditoriumId;
    const startTime = data.startTime || currentShowtime.startTime;
    const endTime = data.endTime || currentShowtime.endTime;

    const overlapping = await Showtime.findOne({
        _id: { $ne: id },
        auditoriumId,
        $or: [
        {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
        },
        ],
    });

    if (overlapping) {
        throw new Error("Showtime overlaps with an existing showtime in this auditorium");
    }

    const showtime = await Showtime.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!showtime) throw new Error("Showtime not found");
    return showtime;
};

export const deleteShowtime = async (id: string) => {
    const showtime = await Showtime.findByIdAndDelete(id);
    if (!showtime) throw new Error("Showtime not found");
    return showtime;
};