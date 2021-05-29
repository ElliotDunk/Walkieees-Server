import express, { Router } from "express";
import findController from "../controllers/mapping/find.controller";
import authenticationCheck from "../middleware/authenticationCheck.middleware";

const router: Router = express.Router();

router.get("/find", authenticationCheck, findController.find);

export default router;
