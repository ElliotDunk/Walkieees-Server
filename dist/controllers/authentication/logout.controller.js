"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    static logout(req, res) {
        var _a;
        //Remove user from request
        req.logout();
        //Destroy session in database to prevent unauthorised access
        (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy((err) => {
            if (err)
                return res.status(500).json();
        });
        //Change SessionVis to tell client user is no longer authenticated as normal Session cookie is HTTPOnly
        return res
            .status(200)
            .cookie("SessionVis", "false", { maxAge: parseInt(process.env.SESSION_MAX_AGE) })
            .json();
    }
}
exports.default = default_1;
