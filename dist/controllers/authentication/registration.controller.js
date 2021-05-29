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
const bcrypt_1 = __importDefault(require("bcrypt"));
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const authenticationValidation_1 = __importDefault(require("../../utils/validation/authenticationValidation"));
const validator_1 = __importDefault(require("validator"));
const subscribleEmail_1 = __importDefault(require("../../utils/subscription/subscribleEmail"));
class default_1 {
    static register(req, res) {
        accounts_model_1.default.findOne({ email: req.body.email }, (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(500).json();
            if (user)
                return res.status(409).json();
            //Validate data sent to server
            if (!authenticationValidation_1.default({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                DOB: req.body.dob,
                terms: req.body.terms,
            })) {
                return res.status(403).json();
            }
            //Hash password
            yield bcrypt_1.default.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err)
                    return res.status(500).json();
                //Sanitize inputs (validator.escape)
                const facebookID = req.body.facebookID ? validator_1.default.unescape(req.body.facebookID) : undefined;
                const twitterID = req.body.twitterID ? validator_1.default.unescape(req.body.twitterID) : undefined;
                const googleID = req.body.googleID ? validator_1.default.unescape(req.body.googleID) : undefined;
                const accountData = {
                    email: validator_1.default.unescape(req.body.email),
                    password: validator_1.default.unescape(hashedPassword),
                    firstName: validator_1.default.unescape(req.body.firstName),
                    lastName: validator_1.default.unescape(req.body.lastName),
                    dateOfBirth: validator_1.default.unescape(req.body.dob),
                    dateCreated: Date.now(),
                    terms: validator_1.default.unescape(req.body.terms),
                    facebookID: facebookID,
                    twitterID: twitterID,
                    googleID: googleID,
                };
                accounts_model_1.default.create(accountData, (err, newAccount) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return res.status(500).json();
                    //Add user to marketing list database collection with correct permissions
                    if (req.body.marketingEmails === "true")
                        subscribleEmail_1.default(req.body.email, newAccount._id);
                    req.login(newAccount, (err) => {
                        if (err)
                            return res.status(500).json();
                        //SessionVis cookie allows client to see if user is authentcaited as normal Session cookie is HTTPOnly
                        return res
                            .status(201)
                            .json()
                            .cookie("SessionVis", newAccount.id, { maxAge: parseInt(process.env.SESSION_MAX_AGE) });
                    });
                }));
            });
        }));
    }
}
exports.default = default_1;
