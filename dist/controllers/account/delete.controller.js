"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
class default_1 {
    static delete(req, res) {
        var _a;
        const userID = req.user._id;
        //Remove user from request
        req.logout();
        //Destroy session in database to prevent unauthorised access
        (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy();
        //Change SessionVis to tell client user is no longer authenticated as normal Session cookie is HTTPOnly
        accounts_model_1.default.deleteOne({ _id: userID }, (err) => {
            if (err)
                return res.status(500).json();
            return res
                .status(204)
                .cookie("SessionVis", "false", { maxAge: parseInt(process.env.SESSION_MAX_AGE) })
                .json();
        });
    }
}
exports.default = default_1;
