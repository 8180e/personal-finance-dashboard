import express from "express";

import signupValidator from "../middlewares/validation/auth.validation.middleware.js";

import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signupValidator, signup);
router.post("/sign-in", signin);

export default router;
