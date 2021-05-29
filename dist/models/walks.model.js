"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const locationSchema = new mongoose_1.default.Schema({
    type: String,
    coordinates: [Number, Number],
}, { _id: false });
const walksSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    locationTitle: { type: String, required: true },
    description: { type: String, required: true },
    userID: { type: mongoose_1.default.Types.ObjectId, required: true },
    imageURL: { type: String, required: true },
    location: { type: locationSchema, required: true },
    activities: String,
    views: [Date],
    dateCreated: { type: Date, required: true, default: Date.now },
});
exports.default = mongoose_1.default.model("Walks", walksSchema);
