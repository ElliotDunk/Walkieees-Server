import { Account } from "../../types";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Accounts from "../../models/accounts.model";
import PasswordReset from "../../models/passwordReset.model";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/email/sendEmail";
import validate from "../../utils/validation/authenticationValidation";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window: any = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

interface PasswordResetDocument extends Partial<Document> {
  _id?: mongoose.Types.ObjectId | string;
  expires?: Date;
  userID: mongoose.Types.ObjectId;
}

export default class resetPasswordController {
  //requestReset generates password reset token in document to allow password resets, then sends an email to the user
  static requestReset(req: Request, res: Response) {
    Accounts.findOne({ email: req.body.email }, async (err: Error, account: Account) => {
      if (err) return res.status(500).json();
      if (!account) return res.status(404).json();
      //Delete any pre existing permissions to reset passwords
      await PasswordReset.findOneAndDelete({ userID: account.id });
      //Create document giving permission to reset password
      PasswordReset.create({ userID: account.id }, async (err: Error, passwordResetDocument: PasswordResetDocument) => {
        if (err) return res.status(500).json();
        //Create JWT token containing id of reset document in mongoDB (expiration is multiplied by 1000 to convert to milliseconds)
        const token = jwt.sign({ id: passwordResetDocument._id, expiration: Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRATION_SECONDS as string) * 1000 }, process.env.JWT_SECRET as string);
        //Data to be sent in email (user name, link to reset password containing token)
        let data = {
          link: `https://localhost:3000/resetpassword/${token}`,
          firstName: account.firstName,
        };
        //Render email from ejs with supplied data
        const emailHTML: Promise<string> = ejs.renderFile("src/emailTemplates/resetPassword.ejs", data);
        await sendEmail(account.email as string, "Reset Password", await emailHTML)
          .then(() => {
            return res.status(200).json();
          })
          .catch(() => {
            return res.status(500).json();
          });
      });
    });
  }

  //resetPassword checks to make sure the correct document exists in the database to reset the password, the validates the inputted data
  static resetPassword(req: Request, res: Response) {
    PasswordReset.findOne({ _id: req.body.id }, (err: Error, resetDocument: PasswordResetDocument) => {
      if (err) return res.status(500);
      if (!resetDocument) return res.status(404).json();
      Accounts.findOne({ _id: resetDocument.userID }, async (err: Error, account: Account) => {
        if (err) return res.status(500).json();
        if (!account) return res.status(404).json();
        //Validate password and confirm password are the same
        if (!validate({ password: req.body.password, confirmPassword: req.body.confirmPassword })) return res.status(422).json();
        //Make sure new password isn't the same as the old password
        if (await bcrypt.compare(req.body.password, account.password as string)) return res.status(409).json();
        //Sanitize and new password
        const newEncrpytedPassword = await bcrypt.hash(DOMPurify.sanitize(req.body.password), 10);
        //Udate new password
        Accounts.findOneAndUpdate({ _id: resetDocument.userID }, { password: newEncrpytedPassword }, async (err: Error) => {
          if (err) return res.status(500).json();
          //Delete reset passwor ddocument so it cant be used multiple times
          await PasswordReset.findOneAndDelete({ _id: req.body.id });
          return res.status(200).json();
        });
      });
    });
  }
}
