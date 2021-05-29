import express, { Router } from "express";
import geocodeMiddleware from "../middleware/geocode.middleware";
import walksSearchController from "../controllers/walks/walksSearch.controller";
import walksViewController from "../controllers/walks/walkView.controller";
import walkController from "../controllers/walks/walk.controller";
import authenticationCheck from "../middleware/authenticationCheck.middleware";

const router: Router = express.Router();

router.get("/search", geocodeMiddleware, walksSearchController.search);

router.get("/walkview/:id", walksViewController.get);

router.get("/userwalks", authenticationCheck, walksSearchController.userWalks);

router.post("/create", authenticationCheck, walkController.create);

export default router;
