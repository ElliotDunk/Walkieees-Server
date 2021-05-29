import express, { Router } from "express";
import emailSubscriptionController from "../controllers/emailSubscription/emailSubscription.controller";

const router: Router = express.Router();

router.post("/email", emailSubscriptionController.post);

router.delete("/email", emailSubscriptionController.delete);

export default router;
