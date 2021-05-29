import { Request, Response } from "express";
import MarketingList from "../../models/marketingList.model";

export default class {
  static view(req: any, res: Response) {
    MarketingList.findOne({ email: req.user.email }, (err: Error, document: Document) => {
      if (err) return res.status(500).json();
      if (document) return res.status(200).json({ ...req.user._doc, ...{ marketingEmails: "On" } });
      return res.status(200).json({ ...req.user._doc, ...{ marketingEmails: "Off" } });
    });
  }
}
