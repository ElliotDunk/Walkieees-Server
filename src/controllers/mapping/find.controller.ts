import axios from "axios";
import { Request, Response } from "express";

interface GeocodeData {
  coordinates: {
    [key: string]: number;
  };
  location: string;
}

export default class {
  static find(req: Request, res: Response) {
    const country: string =
      req.query.country !== undefined ? (req.query.country as string) : "GB";
    const location: string | null = req.query.location as string;
    const limit: number =
      req.query.limit !== undefined
        ? parseInt(req.query.limit as string)
        : parseInt(process.env.SEARCH_DEFAULT_LIMIT as string);

    //Call mapbox api to turn string location in geocode data (latitude and longitude)
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?&country=${country}&limit=${limit.toString()}&access_token=${
          process.env.MAPBOX_KEY
        }`
      )
      .then((response) => {
        if (response.data.features.length <= 0) return res.status(404).json();
        return res.status(200).json(response.data.features);
      })
      .catch((err) => {
        return res.status(500).json();
      });
  }
}
