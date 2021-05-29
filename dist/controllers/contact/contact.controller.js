"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendEmail_1 = __importDefault(require("../../utils/email/sendEmail"));
class default_1 {
    static contact(req, res) {
        const html = `<div><h5>Name - ${req.body.firstName} ${req.body.lastName}</h5><h5>Email - ${req.body.email}</h5><p>Message - ${req.body.message}</p></div>`;
        sendEmail_1.default("elliotdunk@outlook.com", "Walkieees Contact Form", html)
            .then(() => {
            res.status(200).json();
        })
            .catch(() => {
            res.status(500).json();
        });
    }
}
exports.default = default_1;
