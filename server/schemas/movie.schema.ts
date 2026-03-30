import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    posterUrl: { type: String, default: "" },
    director: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, required: true },
    releaseDate: { type: Date },
    language: { type: String, default: "" },
    ageRating: { type: String, default: "" },
    status: {
      type: String,
      enum: ["COMING_SOON", "NOW_SHOWING", "ENDED"],
      default: "COMING_SOON",
    },
    actors: [{ type: String }],
    genres: [{ type: String }],
  },
  { timestamps: true }
);

export const Movie = model("Movie", movieSchema);