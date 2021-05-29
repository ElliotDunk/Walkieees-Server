"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const find_controller_1 = __importDefault(require("../controllers/mapping/find.controller"));
const authenticationCheck_middleware_1 = __importDefault(require("../middleware/authenticationCheck.middleware"));
const router = express_1.default.Router();
router.get("/find", authenticationCheck_middleware_1.default, find_controller_1.default.find);
exports.default = router;
