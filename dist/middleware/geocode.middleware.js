"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function default_1(req, res, next) {
    const country = req.query.country !== undefined ? req.query.country : "GB";
    const limit = req.query.limit !== undefined ? req.query.limit : process.env.SEARCH_DEFAULT_LIMIT;
    //If input has latitude and longitude already specified just move on
    if (req.query.lat && req.query.lng)
        return next();
    //Call mapbox api to turn string location in geocode data (latitude and longitude) to be used for distance serach in the MongoDB database
    axios_1.default
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.query.location}.json?&country=${country}&limit=${limit.toString()}&access_token=${process.env.MAPBOX_KEY}`)
        .then((response) => {
        const coordinatesArr = response.data.features[0].center;
        req.query.lat = coordinatesArr[0].toString();
        req.query.lng = coordinatesArr[1].toString();
        req.query.location = response.data.features[0].place_name;
        return next();
    })
        .catch((err) => {
        return res.status(404).json();
    });
}
exports.default = default_1;
