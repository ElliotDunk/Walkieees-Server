import mongoose, { Schema, Document } from "mongoose";

export interface WalkReview extends Partial<Document> {
  _id?: mongoose.Types.ObjectId;
  walkID: mongoose.Types.ObjectId | string;
  reviews: [{
    userID: mongoose.Types.ObjectId | string;
    rating: string | number;
    title: string;
    reviewText: string;
    // images?: [string];
  }];
}

const reviewsObjectSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    reviewText: { type: String, required: true },
    // images: { type: [String] },
  },
  // { _id: false }
);

const walkReviewsSchema: Schema = new mongoose.Schema({
  walkID: { type: mongoose.Types.ObjectId, required: true },
  reviews: { type: [reviewsObjectSchema] },
});

export default mongoose.model("WalkReviews", walkReviewsSchema);
