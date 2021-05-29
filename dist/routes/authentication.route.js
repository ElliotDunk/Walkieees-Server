"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const registration_controller_1 = __importDefault(require("../controllers/authentication/registration.controller"));
const logIn_controller_1 = __importDefault(require("../controllers/authentication/logIn.controller"));
const logOut_controller_1 = __importDefault(require("../controllers/authentication/logOut.controller"));
const resetPassword_controller_1 = __importDefault(require("../controllers/authentication/resetPassword.controller"));
const router = express_1.default.Router();
router.post("/login", logIn_controller_1.default.local);
router.delete("/logout", logOut_controller_1.default.logout);
router.post("/register", registration_controller_1.default.register);
router.get("/facebook", passport_1.default.authenticate("facebook"));
router.get("/facebook/callback", logIn_controller_1.default.facebookCallback);
router.get("/twitter", passport_1.default.authenticate("twitter"));
router.get("/twitter/callback", logIn_controller_1.default.twitterCallback);
router.get("/google", passport_1.default.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));
router.get("/google/callback", logIn_controller_1.default.googleCallback);
router.post("/request/resetpassword", resetPassword_controller_1.default.requestReset);
router.put("/resetpassword", resetPassword_controller_1.default.resetPassword);
exports.default = router;