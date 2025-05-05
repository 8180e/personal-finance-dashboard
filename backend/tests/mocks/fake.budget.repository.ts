/// <reference types="../../src/types/budget" />
import { BudgetRepository } from "../../src/repositories/budget.repository";

export class FakeBudgetRepository implements BudgetRepository {
  private budgets: (InputBudget & OutputBudget)[] = [];

  create = async (budget: InputBudget) => {
    const newBudget = { ...budget, id: this.budgets.length.toString() };
    this.budgets.push(newBudget);
    return { ...newBudget, userId: undefined };
  };

  getAllByUserId = async (userId: string) =>
    this.budgets
      .filter((b) => b.userId === userId)
      .map((b) => ({ ...b, userId: undefined }));

  update = async (budgetId: string, amount: number) => {
    this.budgets = this.budgets.map((b) => {
      if (b.id === budgetId) {
        return { ...b, amount };
      }
      return b;
    });
  };

  deleteBudget = async (budgetId: string) => {
    this.budgets = this.budgets.filter((b) => b.id !== budgetId);
  };

  getByUserIdAndCategory = async (userId: string, category: string) => {
    const budget = this.budgets.find(
      (b) => b.userId === userId && b.category === category
    );
    return budget ? { ...budget, userId: undefined } : null;
  };

  getById = async (budgetId: string) =>
    this.budgets.find((b) => b.id === budgetId) || null;
}
