"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountsSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now },
    terms: { type: String, required: true },
    facebookID: { type: String, unique: true, sparse: true },
    twitterID: { type: String, unique: true, sparse: true },
    googleID: { type: String, unique: true, sparse: true },
});
exports.default = mongoose_1.default.model("Accounts", accountsSchema);
