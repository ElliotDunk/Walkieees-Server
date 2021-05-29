"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function thirdPartyAuthenticate(req, res, err, user, info) {
    if (err)
        return res.status(500).json();
    if (!user) {
        //Store third party service user id in JWT so can be sent to client in new URL
        const token = jsonwebtoken_1.default.sign(info, process.env.JWT_SECRET);
        res.redirect(`https://localhost:3000/register/${token}`);
    }
    if (user) {
        req.logIn(user, (err) => {
            if (err)
                res.status(401).json();
            // Extra SessionVis cookie allows the client to see if user is logged in as normal session cookie is HTTPOnly
            return res.cookie("SessionVis", user.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE) }).redirect(`https://localhost:3000`);
        });
    }
}
class default_1 {
    static local(req, res, next) {
        passport_1.default.authenticate("local", (err, user, info) => {
            if (err)
                return res.status(401).json();
            if (!user)
                return res.status(401).json();
            req.logIn(user, (err) => {
                if (err)
                    res.status(401).json();
                return res
                    .status(200)
                    .cookie("SessionVis", user.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE) })
                    .json();
            });
        })(req, res, next);
    }
    static facebookCallback(req, res, next) {
        passport_1.default.authenticate("facebook", (err, user, info) => {
            //Authorize account (link to exisiting account) instead of creating or loggin in
            if (req.user && err && err.code === 11000)
                return res.redirect("https://localhost:3000/profile/409");
            if (req.user && err && err.code !== 11000)
                return res.redirect("https://localhost:3000/profile/500");
            if (req.user && !err)
                return res.redirect("https://localhost:3000/profile");
            //Auhenticate the user (log in or register)
            thirdPartyAuthenticate(req, res, err, user, info);
        })(req, res, next);
    }
    static twitterCallback(req, res, next) {
        passport_1.default.authenticate("twitter", (err, user, info) => {
            //Authorize account (link to exisiting account) instead of creating or loggin in
            if (req.user && err && err.code === 11000)
                return res.redirect("https://localhost:3000/profile/409");
            if (req.user && err && err.code !== 11000)
                return res.redirect("https://localhost:3000/profile/500");
            if (req.user && !err)
                return res.redirect("https://localhost:3000/profile");
            //Auhenticate the user (log in or register)
            thirdPartyAuthenticate(req, res, err, user, info);
        })(req, res, next);
    }
    static googleCallback(req, res, next) {
        passport_1.default.authenticate("google", (err, user, info) => {
            //Authorize account (link to exisiting account) instead of creating or loggin in
            if (req.user && err && err.code === 11000)
                return res.redirect("https://localhost:3000/profile/409");
            if (req.user && err && err.code !== 11000)
                return res.redirect("https://localhost:3000/profile/500");
            if (req.user && !err)
                return res.redirect("https://localhost:3000/profile");
            //Auhenticate the user (log in or register)
            thirdPartyAuthenticate(req, res, err, user, info);
        })(req, res, next);
    }
}
exports.default = default_1;
