import express from "express";

import cors from "cors";

import { FRONTEND_URLS } from "./config/env.config.js";

import authRouter from "./routes/auth.route.js";
import transactionsRouter from "./routes/transactions.route.js";
import budgetRouter from "./routes/budgets.route.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({ origin: FRONTEND_URLS.split(",") }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/transactions", transactionsRouter);
app.use("/budgets", budgetRouter);

app.use(errorHandler);

export default app;
