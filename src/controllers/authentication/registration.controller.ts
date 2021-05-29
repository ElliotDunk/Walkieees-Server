import { Account } from "../../types";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Accounts from "../../models/accounts.model";
import validate from "../../utils/validation/authenticationValidation";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import subscribeEmail from "../../utils/subscription/subscribeEmail";

const window: any = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default class {
  static register(req: Request, res: Response): void {
    Accounts.findOne({ email: req.body.email }, async (err: Error, user: Account) => {
      if (err) return res.status(500).json();
      if (user) return res.status(409).json();
      //Validate data sent to server
      if (
        !validate({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          DOB: req.body.dob,
          terms: req.body.terms,
        })
      ) {
        return res.status(403).json();
      }

      //Hash password
      await bcrypt.hash(req.body.password, 10, (err: Error, hashedPassword: string) => {
        if (err) return res.status(500).json();
        //Sanitize inputs (validator.escape)
        const facebookID: string | undefined = req.body.facebookID ? DOMPurify.sanitize(req.body.facebookID) : undefined;
        const twitterID: string | undefined = req.body.twitterID ? DOMPurify.sanitize(req.body.twitterID) : undefined;
        const googleID: string | undefined = req.body.googleID ? DOMPurify.sanitize(req.body.googleID) : undefined;
        const accountData: Account = {
          email: DOMPurify.sanitize(req.body.email),
          password: DOMPurify.sanitize(hashedPassword),
          firstName: DOMPurify.sanitize(req.body.firstName),
          lastName: DOMPurify.sanitize(req.body.lastName),
          dateOfBirth: DOMPurify.sanitize(req.body.dob),
          dateCreated: Date.now(),
          terms: DOMPurify.sanitize(req.body.terms),
          facebookID: facebookID,
          twitterID: twitterID,
          googleID: googleID,
        };

        Accounts.create(accountData, async (err: Error, newAccount: Account) => {
          if (err) return res.status(500).json();
          //Add user to marketing list database collection with correct permissions
          if (req.body.marketingEmails === "true") subscribeEmail(req.body.email, newAccount._id);
          req.login(newAccount, (err: Error) => {
            if (err) return res.status(500).json();
            //SessionVis cookie allows client to see if user is authenticated as normal Session cookie is HTTPOnly
            return res
              .status(201)
              .json()
              .cookie("SessionVis", newAccount.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE as string) });
          });
        });
      });
    });
  }
}
