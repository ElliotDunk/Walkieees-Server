import { Request, Response } from "express";

export default class {
  static logout(req: Request, res: Response): Response<any> {
    //Remove user from request
    req.logout();
    //Destroy session in database to prevent unauthorised access
    req.session?.destroy((err: Error) => {
      if (err) return res.status(500).json();
    });
    //Change SessionVis to tell client user is no longer authenticated as normal Session cookie is HTTPOnly
    return res
      .status(200)
      .cookie("SessionVis", "false", { maxAge: parseInt(process.env.SESSION_MAX_AGE as string) })
      .json();
  }
}
