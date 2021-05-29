"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const geocode_middleware_1 = __importDefault(require("../middleware/geocode.middleware"));
const walksSearch_controller_1 = __importDefault(require("../controllers/walks/walksSearch.controller"));
const walkView_controller_1 = __importDefault(require("../controllers/walks/walkView.controller"));
const authenticationCheck_middleware_1 = __importDefault(require("../middleware/authenticationCheck.middleware"));
const router = express_1.default.Router();
router.get("/search", geocode_middleware_1.default, walksSearch_controller_1.default.search);
router.get("/walk/:id", walkView_controller_1.default.get);
router.get("/userwalks", authenticationCheck_middleware_1.default, walksSearch_controller_1.default.userWalks);
exports.default = router;
