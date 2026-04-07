import express from "express";
import { togglePin } from "../controller/question-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.patch("/:id/pin", protect, togglePin);

export default router;
