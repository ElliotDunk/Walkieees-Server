import { EmailSubscriptionPayload } from "../../types";
import { Request, Response } from "express";
import { Document } from "mongoose";
import MarketingList from "../../models/marketingList.model";
import Accounts from "../../models/accounts.model";
import validate from "../../utils/validation/authenticationValidation";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window: any = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default class {
  static post(req: Request, res: Response): Response<any> | void {
    if (!validate({ email: req.body.email })) return res.status(400).json();
    //Check if email is already in database
    MarketingList.findOne({ email: req.body.email }, (err: Error, account: Document) => {
      if (err) return res.status(500).json();
      if (account) return res.status(200).json();
      const newSubscription: EmailSubscriptionPayload = { email: DOMPurify.sanitize(req.body.email) };
      MarketingList.create(newSubscription, (err: Error) => {
        if (err) return res.status(500).json();
        return res.status(201).json();
      });
    });
  }

  static delete(req: Request, res: Response): Response<any> | void {
    if (!validate({ email: req.body.email })) return res.status(400).json();
    //Check if email is already in database
    MarketingList.deleteOne({ email: req.body.email }, (err: Error) => {
      if (err) return res.status(500).json();
      return res.status(200).json();
    });
  }
}
