import { Account } from "../types";
import passport from "passport";
import LocalStrategy from "passport-local";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";
import GoogleStrategy from "passport-google-oauth";
import Accounts from "../models/accounts.model";
import bcrypt from "bcrypt";

export default function passportConfig() {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Accounts.findById({ _id: id }, (err: Error, user: Account) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      done(null, user);
    });
  });

  //Local strategy for username and passport login only
  passport.use(
    new LocalStrategy.Strategy({ usernameField: "email", passwordField: "password" }, (email: string, password: string, done: any) => {
      Accounts.findOne({ email: email }, async (err: Error, account: Account) => {
        if (err) return done(null, false);
        if (!account) return done(null, false);
        if (!(await bcrypt.compare(password, account.password as string))) return done(null, false);
        return done(null, account);
      });
    })
  );

  passport.use(
    new FacebookStrategy.Strategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        callbackURL: "https://localhost:8443/api/authenticate/facebook/callback",
        passReqToCallback: true,
      },
      (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        if (req.user) {
          Accounts.updateOne({ _id: req.user._id }, { facebookID: profile._json.id }, (err: any, raw: any) => {
            if (err) return done(err, false);
            return done(null, req.user);
          });
        } else {
          Accounts.findOne({ facebookID: profile._json.id }, (err: Error, account: Account) => {
            if (err) return done(null, false);
            if (!account) return done(null, false, { facebookID: profile._json.id });
            return done(null, account);
          });
        }
      }
    )
  );

  passport.use(
    new TwitterStrategy.Strategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
        callbackURL: "https://localhost:8443/api/authenticate/twitter/callback",
        passReqToCallback: true,
      },
      function (req: any, token: string, tokenSecret: string, profile: any, done: any) {
        if (req.user) {
          Accounts.updateOne({ _id: req.user._id }, { twitterID: profile._json.id_str }, (err: Error) => {
            if (err) return done(err, false);
            return done(null, req.user);
          });
        } else {
          Accounts.findOne({ twitterID: profile._json.id_str }, (err: Error, account: Account) => {
            if (err) return done(null, false);
            if (!account) return done(null, false, { twitterID: profile._json.id_str });
            return done(null, account);
          });
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy.OAuth2Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "https://localhost:8443/api/authenticate/google/callback",
        passReqToCallback: true,
      },
      (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        if (req.user) {
          Accounts.updateOne({ _id: req.user._id }, { googleID: profile.id }, (err: Error) => {
            if (err) return done(err, false);
            return done(null, req.user);
          });
        } else {
          Accounts.findOne({ googleID: profile.id }, (err: Error, account: Account) => {
            if (err) return done(null, false);
            if (!account) return done(null, false, { googleID: profile.id });
            return done(null, account);
          });
        }
      }
    )
  );
}
