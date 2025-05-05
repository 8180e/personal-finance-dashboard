import { body } from "express-validator";
import validationErrorHandler from "./validationErrorHandler.middleware.js";

const transactionValidator = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .toFloat()
    .custom((amount) => amount > 0)
    .withMessage("Amount must be greater than 0"),
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  body("category").isString().withMessage("Category must be a string"),
  validationErrorHandler,
];

export default transactionValidator;
