import { body } from "express-validator";
import validationErrorHandler from "./validationErrorHandler.middleware.js";

const budgetValidator = [
  body("category").isString().withMessage("Category must be a string"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .toFloat()
    .custom((amount) => amount > 0)
    .withMessage("Amount must be greater than 0"),
  validationErrorHandler,
];

export default budgetValidator;
