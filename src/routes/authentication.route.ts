import express, { Router } from "express";
import passport from "passport";
import registrationController from "../controllers/authentication/registration.controller";
import logInController from "../controllers/authentication/logIn.controller";
import logOutController from "../controllers/authentication/logOut.controller";
import resetPasswordController from "../controllers/authentication/resetPassword.controller";

const router: Router = express.Router();

router.post("/login", logInController.local);

router.delete("/logout", logOutController.logout);

router.post("/register", registrationController.register);

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback", logInController.facebookCallback);

router.get("/twitter", passport.authenticate("twitter"));
router.get("/twitter/callback", logInController.twitterCallback);

router.get("/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));
router.get("/google/callback", logInController.googleCallback);

router.post("/request/resetpassword", resetPasswordController.requestReset);
router.put("/resetpassword", resetPasswordController.resetPassword);

export default router;
