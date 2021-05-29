import mongoose, { Schema } from "mongoose";

const accountsSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  terms: { type: String, required: true },
  facebookID: { type: String, unique: true, sparse: true },
  twitterID: { type: String, unique: true, sparse: true },
  googleID: { type: String, unique: true, sparse: true },
});

export default mongoose.model("Accounts", accountsSchema);
