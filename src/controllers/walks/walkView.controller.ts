import Walks from "../../models/walks.model";
import { Request, Response } from "express";
import { Document } from "mongoose";

export default class {
  static async get(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const walk: Document | null = await Walks.findOne({ _id: id });
      res.status(walk !== null ? 200 : 404).json(walk);
    } catch {
      res.status(404).json();
    }
  }
}
