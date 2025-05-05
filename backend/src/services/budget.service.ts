import { BudgetRepository } from "../repositories/budget.repository.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.util.js";

export class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  createBudget = async (budget: InputBudget) => {
    const existingBudget = await this.budgetRepository.getByUserIdAndCategory(
      budget.userId,
      budget.category
    );
    if (existingBudget) {
      throw new ConflictError("You already have a budget of the same category");
    }
    return this.budgetRepository.create(budget);
  };

  updateBudget = async (budgetId: string, userId: string, amount: number) => {
    const budget = await this.budgetRepository.getById(budgetId);

    if (!budget) {
      throw new NotFoundError("Budget not found");
    }

    if (budget.userId !== userId) {
      throw new UnauthorizedError("You do not own this budget");
    }

    await this.budgetRepository.update(budgetId, amount);
  };

  deleteBudget = async (budgetId: string, userId: string) => {
    const budget = await this.budgetRepository.getById(budgetId);

    if (!budget) {
      throw new NotFoundError("Budget not found");
    }

    if (budget.userId !== userId) {
      throw new UnauthorizedError("You do not own this budget");
    }

    await this.budgetRepository.deleteBudget(budgetId);
  };

  getBudgetsByUserId = async (userId: string) =>
    await this.budgetRepository.getAllByUserId(userId);
}
