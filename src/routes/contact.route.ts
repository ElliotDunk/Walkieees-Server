import express, { Router } from "express";
import contactController from "../controllers/contact/contact.controller";

const router: Router = express.Router();

router.post("", contactController.contact);

export default router;
