import { Account } from "../../types";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

function thirdPartyAuthenticate(req: Request, res: Response, err: Error, user: any, info: any) {
  if (err) return res.status(500).json();
  if (!user) {
    //Store third party service user id in JWT so can be sent to client in new URL
    const token: string = jwt.sign(info, process.env.JWT_SECRET as string);
    res.redirect(`https://localhost:3000/register/${token}`);
  }
  if (user) {
    req.logIn(user, (err) => {
      if (err) res.status(401).json();
      // Extra SessionVis cookie allows the client to see if user is logged in as normal session cookie is HTTPOnly
      return res.cookie("SessionVis", user.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE as string) }).redirect(`https://localhost:3000`);
    });
  }
}

export default class {
  static local(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate("local", (err: Error, user: Account, info: any) => {
      if (err) return res.status(401).json();
      if (!user) return res.status(401).json();
      req.logIn(user, (err) => {
        if (err) res.status(401).json();
        return res
          .status(200)
          .cookie("SessionVis", user.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE as string) })
          .json();
      });
    })(req, res, next);
  }

  static facebookCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("facebook", (err: any, user: any, info: any) => {
      //Authorize account (link to existing account) instead of creating or login in
      if (req.user && err && err.code === 11000) return res.redirect("https://localhost:3000/profile/409");
      if (req.user && err && err.code !== 11000) return res.redirect("https://localhost:3000/profile/500");
      if (req.user && !err) return res.redirect("https://localhost:3000/profile");
      //Authenticate the user (log in or register)
      thirdPartyAuthenticate(req, res, err, user, info);
    })(req, res, next);
  }

  static twitterCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("twitter", (err: any, user: any, info: any) => {
      //Authorize account (link to existing account) instead of creating or loggin in
      if (req.user && err && err.code === 11000) return res.redirect("https://localhost:3000/profile/409");
      if (req.user && err && err.code !== 11000) return res.redirect("https://localhost:3000/profile/500");
      if (req.user && !err) return res.redirect("https://localhost:3000/profile");
      //Authenticate the user (log in or register)
      thirdPartyAuthenticate(req, res, err, user, info);
    })(req, res, next);
  }

  static googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("google", (err: any, user: any, info: any) => {
      //Authorize account (link to existing account) instead of creating or login in
      if (req.user && err && err.code === 11000) return res.redirect("https://localhost:3000/profile/409");
      if (req.user && err && err.code !== 11000) return res.redirect("https://localhost:3000/profile/500");
      if (req.user && !err) return res.redirect("https://localhost:3000/profile");
      //Authenticate the user (log in or register)
      thirdPartyAuthenticate(req, res, err, user, info);
    })(req, res, next);
  }
}
