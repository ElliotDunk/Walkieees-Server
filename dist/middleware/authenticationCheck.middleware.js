"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (req.isAuthenticated())
        return next();
    if (!req.isAuthenticated())
        return res.status(403).json();
    return res.status(500).json();
}
exports.default = default_1;
