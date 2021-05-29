import express, { Router } from "express";
import authenticationCheck from "../middleware/authenticationCheck.middleware";
import retrieveReviewsController from "../controllers/walkReviews/walkReviews.controller"

const router: Router = express.Router();

router.get("/walk/:id", retrieveReviewsController.retrieveAll);

// router.get("/create", authenticationCheck, retrieveReviewsController.create);
router.get("/create", retrieveReviewsController.create);

// router.get("/create", authenticationCheck, retrieveReviewsController.delete);
router.get("/delete", retrieveReviewsController.delete);

export default router;
