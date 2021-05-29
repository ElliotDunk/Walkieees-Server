import express, { Router } from "express";
import retrieveController from "../controllers/account/retrieve.controller";
import deleteController from "../controllers/account/delete.controller";
import authenticationCheck from "../middleware/authenticationCheck.middleware";

const router: Router = express.Router();

router.get("/retrieve", authenticationCheck, retrieveController.view);

router.delete("/delete", authenticationCheck, deleteController.delete);

export default router;
