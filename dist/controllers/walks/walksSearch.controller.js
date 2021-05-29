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
const walks_model_1 = __importDefault(require("../../models/walks.model"));
class default_1 {
    static search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const latitude = req.query.lat;
            const longitude = req.query.lng;
            const location = req.query.location || null;
            const maxDistance = req.query.maxDist !== undefined ? parseInt(req.query.maxDist) : parseInt(process.env.SEARCH_DEFAULT_MAX_DIST);
            const minDistance = req.query.minDist !== undefined ? parseInt(req.query.minDist) : parseInt(process.env.SEARCH_DEFAULT_MIN_DIST);
            const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : parseInt(process.env.SEARCH_DEFAULT_LIMIT);
            try {
                const walks = yield walks_model_1.default.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [latitude, longitude],
                            },
                            $maxDistance: maxDistance,
                            $minDistance: minDistance,
                        },
                    },
                }).limit(limit);
                res.status(walks !== null ? 200 : 404).json({
                    coordinates: { latitude, longitude },
                    location: location,
                    maxDistance: maxDistance,
                    minDistance: minDistance,
                    limit: limit,
                    walks: walks,
                });
            }
            catch (_a) {
                res.status(404).json();
            }
        });
    }
    static userWalks(req, res) {
        walks_model_1.default.find({ userID: req.user._id }, (err, walks) => {
            if (err)
                return res.status(500).json();
            if (!walks)
                return res.status(404).json();
            return res.status(200).json(walks);
        });
    }
}
exports.default = default_1;
