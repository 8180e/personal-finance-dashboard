import express from "express";

import authenticateToken from "../middlewares/authenticateToken.middleware.js";

import budgetValidator from "../middlewares/validation/budget.validation.middleware.js";
import idValidator from "../middlewares/validation/id.validation.middleware.js";

import {
  createBudget,
  deleteBudget,
  updateBudget,
  getBudgets,
} from "../controllers/budgets.controller.js";

const route = express.Router();

route.use(authenticateToken);

route.post("/", budgetValidator, createBudget);
// budgetValidator.slice(1) only checks the amount
route.patch("/:id", idValidator, budgetValidator.slice(1), updateBudget);
route.delete("/:id", idValidator, deleteBudget);
route.get("/", getBudgets);

export default route;
