//Interfaces used in multiple files to be stored here
//Interfaces only used in single files to be stored in respective file

import mongoose from "mongoose";

export interface Account extends Partial<Document> {
  _id?: mongoose.Types.ObjectId | string;
  id?: mongoose.Types.ObjectId | string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  dateCreated?: Date | number;
  terms?: string | boolean;
  facebookID?: string;
  twitterID?: string;
  googleID?: string;
}

export interface EmailSubscriptionPayload {
  userID?: mongoose.Types.ObjectId | string;
  email: string;
}
