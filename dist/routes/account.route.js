"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const retrieve_controller_1 = __importDefault(require("../controllers/account/retrieve.controller"));
const delete_controller_1 = __importDefault(require("../controllers/account/delete.controller"));
const authenticationCheck_middleware_1 = __importDefault(require("../middleware/authenticationCheck.middleware"));
const router = express_1.default.Router();
router.get("/retrieve", authenticationCheck_middleware_1.default, retrieve_controller_1.default.view);
router.delete("/delete", authenticationCheck_middleware_1.default, delete_controller_1.default.delete);
exports.default = router;
