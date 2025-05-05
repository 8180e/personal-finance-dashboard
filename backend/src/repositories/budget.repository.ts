export interface BudgetRepository {
  create: (budget: InputBudget) => Promise<OutputBudget>;
  getAllByUserId: (userId: string) => Promise<OutputBudget[]>;
  update: (budgetId: string, amount: number) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
  getByUserIdAndCategory: (
    userId: string,
    category: string
  ) => Promise<OutputBudget | null>;
  getById: (budgetId: string) => Promise<InputBudget | null>;
}
