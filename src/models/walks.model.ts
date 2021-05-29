import mongoose, { Schema } from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    type: String,
    coordinates: [Number, Number],
  },
  { _id: false }
);

const walksSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  locationTitle: { type: String, required: true },
  description: { type: String, required: true },
  userID: { type: mongoose.Types.ObjectId, required: true },
  imageUrl: { type: [String], required: true },
  location: { type: locationSchema, required: true },
  views: [Date],
  dateCreated: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Walks", walksSchema);
