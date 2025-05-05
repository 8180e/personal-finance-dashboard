import { param } from "express-validator";
import validationErrorHandler from "./validationErrorHandler.middleware.js";

const idValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
  validationErrorHandler,
];

export default idValidator;
