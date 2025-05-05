import { Request, Response, NextFunction } from "express";
import { MongoBudgetRepository } from "../repositories/mongo.budget.repository.js";
import { BudgetService } from "../services/budget.service.js";

const budgetRepository = new MongoBudgetRepository();
const budgetService = new BudgetService(budgetRepository);

const createBudget = async (
  { body: budget, user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newBudget = await budgetService.createBudget({
      ...budget,
      userId: user!.id,
    });
    res.status(201).json(newBudget);
  } catch (error) {
    next(error);
  }
}

const updateBudget = async (
  { params: { id }, body: { amount }, user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await budgetService.updateBudget(id, user!.id, amount);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (
  { params: { id }, user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await budgetService.deleteBudget(id, user!.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getBudgets = async (
  { user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgets = await budgetService.getBudgetsByUserId(user!.id);
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

export { createBudget, updateBudget, deleteBudget, getBudgets };
