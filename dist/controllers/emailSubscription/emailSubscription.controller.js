"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marketingList_model_1 = __importDefault(require("../../models/marketingList.model"));
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const authenticationValidation_1 = __importDefault(require("../../utils/validation/authenticationValidation"));
const validator_1 = __importDefault(require("validator"));
class default_1 {
    static post(req, res) {
        if (!authenticationValidation_1.default({ email: req.body.email }))
            return res.status(400).json();
        //Check if email is already in database
        accounts_model_1.default.findOne({ email: req.body.email }, (err, account) => {
            if (err)
                return res.status(500).json();
            let userID = null;
            if (account)
                userID = account._id;
            const newSubscription = { userID: userID, email: validator_1.default.unescape(req.body.email) };
            marketingList_model_1.default.create(newSubscription, (err) => {
                if (err)
                    return res.status(500).json();
                return res.status(201).json();
            });
        });
    }
    static delete(req, res) {
        if (!authenticationValidation_1.default({ email: req.body.email }))
            return res.status(400).json();
        //Check if email is already in database
        marketingList_model_1.default.deleteOne({ email: req.body.email }, (err) => {
            if (err)
                return res.status(500).json();
            return res.status(200).json();
        });
    }
}
exports.default = default_1;
