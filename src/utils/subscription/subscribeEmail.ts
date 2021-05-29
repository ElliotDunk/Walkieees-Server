import { EmailSubscriptionPayload } from "../../types";
import mongoose from "mongoose";
import MarketingList from "../../models/marketingList.model";
import validate from "../validation/authenticationValidation";

export default function subscribeEmail(email: string, userID?: mongoose.Types.ObjectId | string) {
  if (!validate({ email: email })) return;
  MarketingList.findOne({ email: email }, (err: Error, response: Document) => {
    if (err) return;
    if (response) return;
    if (!response) {
      const newSubscription: EmailSubscriptionPayload = { userID: userID, email: email };
      MarketingList.create(newSubscription, (err: Error) => {
        if (err) return;
        return;
      });
    }
  });
}
