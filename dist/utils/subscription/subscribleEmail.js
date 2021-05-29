"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marketingList_model_1 = __importDefault(require("../../models/marketingList.model"));
const authenticationValidation_1 = __importDefault(require("../../utils/validation/authenticationValidation"));
function subscribeEmail(email, userID) {
    if (!authenticationValidation_1.default({ email: email }))
        return;
    marketingList_model_1.default.findOne({ email: email }, (err, response) => {
        if (err)
            return;
        if (response)
            return;
        if (!response) {
            const newSubscription = { userID: userID, email: email };
            marketingList_model_1.default.create(newSubscription, (err) => {
                if (err)
                    return;
                return;
            });
        }
    });
}
exports.default = subscribeEmail;
