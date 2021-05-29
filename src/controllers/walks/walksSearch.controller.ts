import Walks from "../../models/walks.model";
import { Request, Response } from "express";
import { Document } from "mongoose";

export default class {
  static async search(req: Request, res: Response): Promise<void> {
    const latitude: string = req.query.lat as string;
    const longitude: string = req.query.lng as string;
    const location: string | null = (req.query.location as string) || null;
    const maxDistance: number = req.query.maxDist !== undefined ? parseInt(req.query.maxDist as string) : parseInt(process.env.SEARCH_DEFAULT_MAX_DIST as string);
    const minDistance: number = req.query.minDist !== undefined ? parseInt(req.query.minDist as string) : parseInt(process.env.SEARCH_DEFAULT_MIN_DIST as string);
    const limit: number = req.query.limit !== undefined ? parseInt(req.query.limit as string) : parseInt(process.env.SEARCH_DEFAULT_LIMIT as string);

    try {
      const walks: Document[] | null = await Walks.find({
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
    } catch {
      res.status(404).json();
    }
  }

  static userWalks(req: any, res: Response) {
    Walks.find({ userID: req.user._id }, (err: Error, walks: Document[]) => {
      if (err) return res.status(500).json();
      if (!walks) return res.status(404).json();
      return res.status(200).json(walks);
    });
  }
}
