"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class default_1 {
    static find(req, res) {
        const country = req.query.country !== undefined ? req.query.country : "GB";
        const location = req.query.location;
        const limit = req.query.limit !== undefined
            ? parseInt(req.query.limit)
            : parseInt(process.env.SEARCH_DEFAULT_LIMIT);
        //Call mapbox api to turn string location in geocode data (latitude and longitude)
        axios_1.default
            .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?&country=${country}&limit=${limit.toString()}&access_token=${process.env.MAPBOX_KEY}`)
            .then((response) => {
            if (response.data.features.length <= 0)
                return res.status(404).json();
            return res.status(200).json(response.data.features);
        })
            .catch((err) => {
            return res.status(500).json();
        });
    }
}
exports.default = default_1;
