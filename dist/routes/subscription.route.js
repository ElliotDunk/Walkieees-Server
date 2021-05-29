"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailSubscription_controller_1 = __importDefault(require("../controllers/emailSubscription/emailSubscription.controller"));
const router = express_1.default.Router();
router.post("/email", emailSubscription_controller_1.default.post);
router.delete("/email", emailSubscription_controller_1.default.delete);
exports.default = router;
