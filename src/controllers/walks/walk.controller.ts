//@ts-nocheck
import { Request, Response } from "express";
import path from "path";
import mongoose from "mongoose";
import Walks from "../../models/walks.model";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { Account } from "../../types";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
});

export default class {
  static create(req: Request, res: Response) {
    const mongooseID = mongoose.Types.ObjectId();
    let fileIndex = 0;

    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: "walks-images-bucket",
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(
            null,
            `${mongooseID}/${fileIndex++}${path.extname(file.originalname)}`
          );
        },
      }),
    });

    const arrayUpload = upload.array("images[]");
    arrayUpload(req, res, (err: any) => {
      if (err) return res.status(500).json();

      const user: Account = req.user as string;
      let imageURL = req.files.map(function (file: any) {
        return file.location;
      });

      const walk = {
        title: req.body.title,
        locationTitle: req.body.locationTitle,
        description: req.body.description,
        userID: user._id,
        imageUrl: imageURL,
        location: {
          type: "Point",
          coordinates: [req.body.longitude, req.body.latitude],
        },
      };
      Walks.create(walk, (err: Error, newWalk: Document) => {
        if (err) return res.status(500);
        if (!newWalk) return res.status(500).json();
        return res.status(201).json();
      });
    });
  }
}
//Sanitization, Virus Scanning, Image Resizing
