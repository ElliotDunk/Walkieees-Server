import mongoose, { Schema, Document } from "mongoose";

const PasswordReset: Schema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, required: true, unique: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

//Index below is created to delete documents after set amaount of seconds (can be upto a minute after due to the way MongoDB works)
PasswordReset.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(process.env.PASSWORD_RESET_EXPIRATION_SECONDS as string) });
export default mongoose.model("PasswordReset", PasswordReset);
