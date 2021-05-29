import axios from "axios";
import { Request, Response, NextFunction } from "express";

interface GeocodeData {
  coordinates: {
    [key: string]: number;
  };
  location: string;
}

export default function (req: Request, res: Response, next: NextFunction) {
  const country: string = req.query.country !== undefined ? (req.query.country as string) : "GB";
  const limit: string = req.query.limit !== undefined ? (req.query.limit as string) : (process.env.SEARCH_DEFAULT_LIMIT as string);

  //If input has latitude and longitude already specified just move on
  if (req.query.lat && req.query.lng) return next();
  //Call mapbox api to turn string location in geocode data (latitude and longitude) to be used for distance serach in the MongoDB database
  axios
    .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.query.location}.json?&country=${country}&limit=${limit.toString()}&access_token=${process.env.MAPBOX_KEY}`)
    .then((response) => {
      const coordinatesArr: [number, number] = response.data.features[0].center;
      req.query.lat = coordinatesArr[0].toString();
      req.query.lng = coordinatesArr[1].toString();
      req.query.location = response.data.features[0].place_name;
      return next();
    })
    .catch((err) => {
      return res.status(404).json();
    });
}
