import { Request, Response } from "express";
import sendEmail from "../../utils/email/sendEmail";

export default class {
  static contact(req: Request, res: Response) {
    const html = `<div><h5>Name - ${req.body.firstName} ${req.body.lastName}</h5><h5>Email - ${req.body.email}</h5><p>Message - ${req.body.message}</p></div>`;
    sendEmail("elliotdunk@outlook.com", "Walkieees Contact Form", html)
      .then(() => {
        res.status(200).json();
      })
      .catch(() => {
        res.status(500).json();
      });
  }
}
