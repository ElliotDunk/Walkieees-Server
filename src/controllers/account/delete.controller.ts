import { Response } from "express";
import Accounts from "../../models/accounts.model";

export default class {
  static delete(req: any, res: Response) {
    const userID = req.user._id;
    //Remove user from request
    req.logout();
    //Destroy session in database to prevent unauthorised access
    req.session?.destroy();
    //Change SessionVis to tell client user is no longer authenticated as normal Session cookie is HTTPOnly
    Accounts.deleteOne({ _id: userID }, (err: Error) => {
      if (err) return res.status(500).json();
      return res
        .status(204)
        .cookie("SessionVis", "false", { maxAge: parseInt(process.env.SESSION_MAX_AGE as string) })
        .json();
    });
  }
}
