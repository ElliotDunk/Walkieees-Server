"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PasswordReset = new mongoose_1.default.Schema({
    userID: { type: mongoose_1.default.Types.ObjectId, required: true, unique: true },
    createdAt: { type: Date, default: Date.now(), required: true },
});
//Index below is created to delete documents after set amaount of seconds (can be upto a minute after due to the way MongoDB works)
PasswordReset.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(process.env.PASSWORD_RESET_EXPIRATION_SECONDS) });
exports.default = mongoose_1.default.model("PasswordReset", PasswordReset);
