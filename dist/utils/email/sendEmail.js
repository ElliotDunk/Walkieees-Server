"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(recipientEmail, subject, html, senderEmail, senderPassword) {
    return new Promise((resolve, reject) => {
        const smtpTrans = nodemailer_1.default.createTransport({
            host: "smtp.zoho.eu",
            port: 465,
            secure: true,
            auth: {
                user: senderEmail || process.env.DEFAULT_EMAIL_USER,
                pass: senderPassword || process.env.DEFAULT_EMAIL_PASSWORD,
            },
        });
        let mailOpts = {
            from: senderEmail || "elliotdunk@outlook.com",
            to: recipientEmail,
            subject: subject,
            html: html,
        };
        smtpTrans.sendMail(mailOpts, (err, response) => {
            if (err)
                return reject();
            return resolve();
        });
    });
}
exports.default = sendEmail;
