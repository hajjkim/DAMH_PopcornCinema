import mongoose, { Document, Schema } from "mongoose";

export interface IMovie {
  title: string;
  // Kept as an array to support multi-genre movies (from develop).
  // If existing data uses a single string, a migration will be needed.
  genres: string[];
  duration: number;
  description?: string;
  poster?: string;
  director?: string;
  actors?: string[];
  language?: string;
  rating?: string;
  status?: "COMING_SOON" | "NOW_SHOWING" | "ENDED";
  releaseDate?: Date;
  trailerUrl?: string;
  subtitle?: string;
}

export interface IMovieDocument extends IMovie, Document {}

const movieSchema = new Schema<IMovieDocument>(
  {
    title: { type: String, required: true },
    genres: { type: [String], required: true },
    duration: { type: Number, required: true },
    description: String,
    poster: String,
    director: String,
    actors: [{ type: String }],
    language: String,
    rating: String,
    status: {
      type: String,
      enum: ["COMING_SOON", "NOW_SHOWING", "ENDED"],
      default: "COMING_SOON",
    },
    releaseDate: Date,
    trailerUrl: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Movie =
  mongoose.models.Movie || mongoose.model<IMovieDocument>("Movie", movieSchema);