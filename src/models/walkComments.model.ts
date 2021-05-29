import mongoose, { Schema } from "mongoose";

const walkCommentsSchema: Schema = new mongoose.Schema({
  walkID: { type: mongoose.Types.ObjectId, required: true },
});

export default mongoose.model("WalkComments", walkCommentsSchema);
