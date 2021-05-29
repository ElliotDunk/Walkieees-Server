import mongoose, { Schema } from "mongoose";

const marketingListSchema: Schema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("MarketingList", marketingListSchema);
