"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_twitter_1 = __importDefault(require("passport-twitter"));
const passport_google_oauth_1 = __importDefault(require("passport-google-oauth"));
const accounts_model_1 = __importDefault(require("../models/accounts.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function passportConfig() {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => {
        accounts_model_1.default.findById({ _id: id }, (err, user) => {
            if (err)
                return done(err);
            if (!user)
                return done(null, false);
            done(null, user);
        });
    });
    //Local strategy for username and passport login only
    passport_1.default.use(new passport_local_1.default.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
        accounts_model_1.default.findOne({ email: email }, (err, account) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return done(null, false);
            if (!account)
                return done(null, false);
            if (!(yield bcrypt_1.default.compare(password, account.password)))
                return done(null, false);
            return done(null, account);
        }));
    }));
    passport_1.default.use(new passport_facebook_1.default.Strategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/api/authenticate/facebook/callback",
        passReqToCallback: true,
    }, (req, accessToken, refreshToken, profile, done) => {
        if (req.user) {
            accounts_model_1.default.updateOne({ _id: req.user._id }, { facebookID: profile._json.id }, (err) => {
                if (err)
                    return done(err, false);
                return done(null, req.user);
            });
        }
        else {
            accounts_model_1.default.findOne({ facebookID: profile._json.id }, (err, account) => {
                if (err)
                    return done(null, false);
                if (!account)
                    return done(null, false, { facebookID: profile._json.id });
                return done(null, account);
            });
        }
    }));
    passport_1.default.use(new passport_twitter_1.default.Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "/api/authenticate/twitter/callback",
        passReqToCallback: true,
    }, function (req, token, tokenSecret, profile, done) {
        if (req.user) {
            accounts_model_1.default.updateOne({ _id: req.user._id }, { twitterID: profile._json.id_str }, (err) => {
                if (err)
                    return done(err, false);
                return done(null, req.user);
            });
        }
        else {
            accounts_model_1.default.findOne({ twitterID: profile._json.id_str }, (err, account) => {
                if (err)
                    return done(null, false);
                if (!account)
                    return done(null, false, { twitterID: profile._json.id_str });
                return done(null, account);
            });
        }
    }));
    passport_1.default.use(new passport_google_oauth_1.default.OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/authenticate/google/callback",
        passReqToCallback: true,
    }, (req, accessToken, refreshToken, profile, done) => {
        if (req.user) {
            accounts_model_1.default.updateOne({ _id: req.user._id }, { googleID: profile.id }, (err) => {
                if (err)
                    return done(err, false);
                return done(null, req.user);
            });
        }
        else {
            accounts_model_1.default.findOne({ googleID: profile.id }, (err, account) => {
                if (err)
                    return done(null, false);
                if (!account)
                    return done(null, false, { googleID: profile.id });
                return done(null, account);
            });
        }
    }));
}
exports.default = passportConfig;
