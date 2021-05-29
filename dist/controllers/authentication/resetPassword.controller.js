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
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const passwordReset_model_1 = __importDefault(require("../../models/passwordReset.model"));
const ejs_1 = __importDefault(require("ejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = __importDefault(require("../../utils/email/sendEmail"));
const authenticationValidation_1 = __importDefault(require("../../utils/validation/authenticationValidation"));
const validator_1 = __importDefault(require("validator"));
class resetPasswordController {
    //requestReset generates password reset token in document to allow password resets, then sends an email to the user
    static requestReset(req, res) {
        accounts_model_1.default.findOne({ email: req.body.email }, (err, account) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(500).json();
            if (!account)
                return res.status(404).json();
            //Delete any pre existing permissions to reset passwords
            yield passwordReset_model_1.default.findOneAndDelete({ userID: account.id });
            //Create document giving permission to reset password
            passwordReset_model_1.default.create({ userID: account.id }, (err, passwordResetDocument) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return res.status(500).json();
                //Create JWT token containing id of reset document in mongoDB (expiration is multiplied by 1000 to convert to milliseconds)
                const token = jsonwebtoken_1.default.sign({ id: passwordResetDocument._id, expiration: Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRATION_SECONDS) * 1000 }, process.env.JWT_SECRET);
                //Data to be sent in email (user name, link to reset password containing token)
                let data = {
                    link: `https://localhost:3000/resetpassword/${token}`,
                    firstName: account.firstName,
                };
                //Render email from ejs with supplied data
                const emailHTML = ejs_1.default.renderFile("src/emailTemplates/resetPassword.ejs", data);
                yield sendEmail_1.default(account.email, "Reset Password", yield emailHTML)
                    .then(() => {
                    return res.status(200).json();
                })
                    .catch(() => {
                    return res.status(500).json();
                });
            }));
        }));
    }
    //resetPassword checks to make sure the correct document exists in the database to reset the password, the validates the inputted data
    static resetPassword(req, res) {
        passwordReset_model_1.default.findOne({ _id: req.body.id }, (err, resetDocument) => {
            if (err)
                return res.status(500);
            if (!resetDocument)
                return res.status(404).json();
            accounts_model_1.default.findOne({ _id: resetDocument.userID }, (err, account) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return res.status(500).json();
                if (!account)
                    return res.status(404).json();
                //Validate password and confirm password are the same
                if (!authenticationValidation_1.default({ password: req.body.password, confirmPassword: req.body.confirmPassword }))
                    return res.status(422).json();
                //Make sure new password isn't the same as the old password
                if (yield bcrypt_1.default.compare(req.body.password, account.password))
                    return res.status(409).json();
                //Sanitize and new password
                const newEncrpytedPassword = yield bcrypt_1.default.hash(validator_1.default.unescape(req.body.password), 10);
                //Udate new password
                accounts_model_1.default.findOneAndUpdate({ _id: resetDocument.userID }, { password: newEncrpytedPassword }, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return res.status(500).json();
                    //Delete reset passwor ddocument so it cant be used multiple times
                    yield passwordReset_model_1.default.findOneAndDelete({ _id: req.body.id });
                    return res.status(200).json();
                }));
            }));
        });
    }
}
exports.default = resetPasswordController;
