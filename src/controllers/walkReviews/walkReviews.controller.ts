import { Request, Response } from "express";
import WalkReivews from "../../models/walkReviews.model";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import WalkReviews, { WalkReview } from "../../models/walkReviews.model";
import { isValidObjectId } from "mongoose";

const window: any = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export default class {
  static retrieveAll(req: Request, res: Response) {
    WalkReivews.findOne(
      { walkID: req.params.id },
      (err: Error, reviews: WalkReview) => {
        if (err) return res.status(500).json(err);
        if (!reviews) return res.status(404).json();
        return res.status(200).json(reviews.reviews);
      }
    );
  }

  static create(req: Request, res: Response) {
    //Make Sure All Data Is Present and In Correct Type (UserID Will Be Present If Authentication Check Passed)
    if (req.body.walkID === undefined || typeof req.body.walkID !== "string")
      return res.status(400).json();
    if (req.body.userID === undefined || typeof req.body.userID !== "string")
      return res.status(400).json();
    if (req.body.rating === undefined || typeof req.body.rating !== "string")
      return res.status(400).json();
    if (req.body.title === undefined || typeof req.body.title !== "string")
      return res.status(400).json();
    if (
      req.body.reviewText === undefined ||
      typeof req.body.reviewText !== "string"
    )
      return res.status(400).json();

    //Sanitize Inputs Before Use
    const review: any = {
      userID: req.body.userID,
      rating: DOMPurify.sanitize(req.body.rating),
      title: DOMPurify.sanitize(req.body.title),
      reviewText: DOMPurify.sanitize(req.body.reviewText),
    };

    //Make Sure User Hasn't Created A Review Before
    WalkReviews.findOne(
      { walkID: req.body.walkID },
      (err: Error, existingReview: WalkReview) => {
        if (err) return res.status(500).json();
        if (!existingReview) {
          return WalkReviews.create(
            {
              walkID: req.body.walkID,
              reviews: [review],
            },
            (err: Error) => {
              if (err) return res.status(500).json();
              return res.status(201).json();
            }
          );
        }

        for (let i = 0; i < existingReview.reviews.length; i++) {
          if (existingReview.reviews[i].userID == req.body.userID) return res.status(403).json();
          if (i === existingReview.reviews.length - 1){
            console.log("Passed");

            //Add review to existing document
            let newReview: WalkReview = existingReview;
            newReview.reviews.push(review);
            //_ID cannot be updated
            delete newReview["_id"];
            WalkReviews.updateOne(newReview, (err: Error) => {
              console.error(err);
              if (err) return res.status(500).json();
              return res.status(201).json();
            });
          }
        }

        //Check if user already has a review for this walk
        // existingReview.reviews.forEach((element: any) => {
        //   if (element.userID == req.body.userID) return res.status().json();

        //   console.log("Passed");

        //   //Add review to existing document
        //   let newReview: WalkReview = existingReview;
        //   newReview.reviews.push(review);
        //   //_ID cannot be updated
        //   delete newReview["_id"];
        //   WalkReviews.updateOne(newReview, (err: Error) => {
        //     console.error(err);
        //     if (err) return res.status(500).json();
        //     return res.status(201).json();
        //   });
        // });
      }
    );
  }

  static delete(req: Request, res: Response) {
    //Make Sure All Data Is Present and In Correct Type (UserID Will Be Present If Authentication Check Passed)
    if (req.body.walkID === undefined || typeof req.body.walkID !== "string")
      return res.status(400).json();
    if (req.body.userID === undefined || typeof req.body.userID !== "string")
      return res.status(400).json();
    if (req.body.reviewID === undefined || typeof req.body.userID !== "string")
      return res.status(400).json();

    //Retrieve Walk
    WalkReviews.findOne(
      { walkID: req.body.walkID },
      (err: Error, walkReviews: WalkReview) => {
        if (err) return res.status(500).json();

        const result = walkReviews.reviews.filter((obj: any) => {
          return obj._id != req.body.reviewID;
        });

        console.log(result);
      }
    );
  }
}
