import { Seat } from "../schemas/seat.schema";

type SeatType = "VIP" | "COUPLE";
type SeatStatus = "ACTIVE" | "INACTIVE";

type CreateSeatInput = {
    auditoriumId: string;
    seatRow: string;
    seatNumber: number;
    seatType: SeatType;
    extraPrice?: number;
    status?: SeatStatus;
};

type UpdateSeatInput = Partial<CreateSeatInput>;

export const getAllSeats = async () => {
    return await Seat.find()
        .populate("auditoriumId")
        .sort({ seatRow: 1, seatNumber: 1 });
};

export const getSeatsByAuditorium = async (auditoriumId: string) => {
    return await Seat.find({ auditoriumId }).sort({ seatRow: 1, seatNumber: 1 });
};

export const getSeatById = async (id: string) => {
    const seat = await Seat.findById(id).populate("auditoriumId");

    if (!seat) {
        throw new Error("Seat not found");
    }

    return seat;
};

export const createSeat = async (data: CreateSeatInput) => {
    const seat = await Seat.create(data);
    return seat;
};

export const updateSeat = async (id: string, data: UpdateSeatInput) => {
    const seat = await Seat.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

  if (!seat) {
        throw new Error("Seat not found");
  }

    return seat;
};

export const deleteSeat = async (id: string) => {
    const seat = await Seat.findByIdAndDelete(id);

    if (!seat) {
        throw new Error("Seat not found");
    }

    return seat;
};