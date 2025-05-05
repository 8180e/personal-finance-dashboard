import express from "express";

import authenticateToken from "../middlewares/authenticateToken.middleware.js";

import transactionValidator from "../middlewares/validation/transaction.validation.middleware.js";
import idValidator from "../middlewares/validation/id.validation.middleware.js";

import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactions.controller.js";

const route = express.Router();

route.use(authenticateToken);

route.post("/", transactionValidator, createTransaction);
route.get("/", getTransactions);
route.delete("/:id", idValidator, deleteTransaction);

export default route;
