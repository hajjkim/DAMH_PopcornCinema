
import mongoose, { Document, Schema } from "mongoose";

export interface IMovie {
  title: string;
  genre: string;
  duration: number;
  description?: string;
  poster?: string;
  director?: string;
  actors?: string[];
  language?: string;
  rating?: string;
  status?: "COMING_SOON" | "NOW_SHOWING" | "ENDED";
  releaseDate?: Date;
}

export interface IMovieDocument extends IMovie, Document {}

const movieSchema = new Schema<IMovieDocument>(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    duration: { type: Number, required: true },
    description: String,
    poster: String,
    director: String,
    actors: [String],
    language: String,
    rating: String,
    status: {
      type: String,
      enum: ["COMING_SOON", "NOW_SHOWING", "ENDED"],
      default: "COMING_SOON",
    },
    releaseDate: Date,
  },
  { timestamps: true }
);

export const Movie =
  mongoose.models.Movie || mongoose.model<IMovieDocument>("Movie", movieSchema);
