import { BudgetRepository } from "./budget.repository.js";
import Budget from "../models/budget.model.js";

export class MongoBudgetRepository implements BudgetRepository {
  create = async (budget: InputBudget) => {
    const newBudget = await Budget.create(budget);
    return newBudget.toJSON();
  };

  getAllByUserId = async (userId: string) => {
    const budgets = await Budget.find({ userId });
    return budgets.map((budget) => budget.toJSON());
  };

  update = async (budgetId: string, amount: number) => {
    await Budget.updateOne({ _id: budgetId }, { $set: { amount } });
  };

  deleteBudget = async (budgetId: string) => {
    await Budget.deleteOne({ _id: budgetId });
  };

  getByUserIdAndCategory = async (userId: string, category: string) => {
    const budget = await Budget.findOne({ userId, category });
    return budget && budget.toJSON();
  };

  getById = async (budgetId: string) => {
    const budget = await Budget.findById(budgetId);
    return budget && { ...budget.toJSON(), userId: budget.userId.toString() };
  };
}
