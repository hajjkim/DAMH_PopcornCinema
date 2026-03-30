import { Movie } from "../schemas/movie.schema";

type CreateMovieInput = {
    title: string;
    posterUrl?: string;
    director: string;
    description?: string;
    durationMinutes: number;
    releaseDate?: Date;
    language?: string;
    ageRating?: string;
    status?: "COMING_SOON" | "NOW_SHOWING" | "ENDED";
    actors?: string[];
    genres?: string[];
};

type UpdateMovieInput = Partial<CreateMovieInput>;

export const getAllMovies = async () => {
    return await Movie.find().sort({ createdAt: -1 });
};

export const getMovieById = async (id: string) => {
    const movie = await Movie.findById(id);

    if (!movie) {
        throw new Error("Movie not found");
    }

    return movie;
};

export const createMovie = async (data: CreateMovieInput) => {
    const movie = await Movie.create(data);
    return movie;
};

export const updateMovie = async (id: string, data: UpdateMovieInput) => {
    const movie = await Movie.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!movie) {
        throw new Error("Movie not found");
    }

    return movie;
};

export const deleteMovie = async (id: string) => {
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
        throw new Error("Movie not found");
    }

    return movie;
};