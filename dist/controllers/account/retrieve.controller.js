"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marketingList_model_1 = __importDefault(require("../../models/marketingList.model"));
class default_1 {
    static view(req, res) {
        marketingList_model_1.default.findOne({ email: req.user.email }, (err, document) => {
            if (err)
                return res.status(500).json();
            if (document)
                return res.status(200).json(Object.assign(Object.assign({}, req.user._doc), { marketingEmails: "On" }));
            return res.status(200).json(Object.assign(Object.assign({}, req.user._doc), { marketingEmails: "Off" }));
        });
    }
}
exports.default = default_1;
