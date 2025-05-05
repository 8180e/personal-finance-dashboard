import { body } from "express-validator";
import validationErrorHandler from "./validationErrorHandler.middleware.js";

const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validationErrorHandler,
];

export default signupValidator;
