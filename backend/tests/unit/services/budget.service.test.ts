import { describe, it, expect } from "vitest";
import { BudgetService } from "../../../src/services/budget.service";
import { FakeBudgetRepository } from "../../mocks/fake.budget.repository";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../src/utils/errors.util";

describe("createBudget", () => {
  it("creates a budget", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };
    const budget2 = { userId: "2", amount: 200, category: "Groceries" };

    const createdBudget = await budgetService.createBudget(budget);
    const createdBudget2 = await budgetService.createBudget(budget2);

    expect(createdBudget).toEqual({
      id: "0",
      amount: 100,
      category: "Groceries",
    });

    expect(createdBudget2).toEqual({
      id: "1",
      amount: 200,
      category: "Groceries",
    });
  });

  it("throws error if user already has a budget of the same category", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };
    const budget2 = { userId: "1", amount: 200, category: "Groceries" };

    await budgetService.createBudget(budget);

    await expect(budgetService.createBudget(budget2)).rejects.toThrow(
      ConflictError
    );
  });
});

describe("updateBudget", () => {
  it("updates a budget", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };
    const budget2 = { userId: "1", amount: 200, category: "Transportation" };

    await budgetRepository.create(budget);
    await budgetRepository.create(budget2);

    await budgetService.updateBudget("0", "1", 500);
    await budgetService.updateBudget("1", "1", 400);

    const updatedBudget = await budgetRepository.getByUserIdAndCategory(
      "1",
      "Groceries"
    );
    const updatedBudget2 = await budgetRepository.getByUserIdAndCategory(
      "1",
      "Transportation"
    );

    expect(updatedBudget).toEqual({
      id: "0",
      amount: 500,
      category: "Groceries",
    });

    expect(updatedBudget2).toEqual({
      id: "1",
      amount: 400,
      category: "Transportation",
    });
  });

  it("throws error if budget does not exist", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    await expect(budgetService.updateBudget("0", "1", 500)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws error if user does not own budget", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };

    await budgetRepository.create(budget);

    await expect(budgetService.updateBudget("0", "2", 500)).rejects.toThrow(
      UnauthorizedError
    );
  });
});

describe("deleteBudget", () => {
  it("deletes a budget", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };
    const budget2 = { userId: "1", amount: 200, category: "Transportation" };

    await budgetRepository.create(budget);
    await budgetRepository.create(budget2);

    await budgetService.deleteBudget("0", "1");

    const deletedBudget = await budgetRepository.getByUserIdAndCategory(
      "1",
      "Groceries"
    );
    const undeletedBudget = await budgetRepository.getByUserIdAndCategory(
      "1",
      "Transportation"
    );

    expect(deletedBudget).toBeNull();
    expect(undeletedBudget).toEqual({
      id: "1",
      amount: 200,
      category: "Transportation",
    });
  });

  it("throws error if budget does not exist", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    await expect(budgetService.deleteBudget("0", "1")).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws error if user does not own budget", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };

    await budgetRepository.create(budget);

    await expect(budgetService.deleteBudget("0", "2")).rejects.toThrow(
      UnauthorizedError
    );
  });
});

describe("getBudgetsByUserId", () => {
  it("gets budgets by user id", async () => {
    const budgetRepository = new FakeBudgetRepository();
    const budgetService = new BudgetService(budgetRepository);

    const budget = { userId: "1", amount: 100, category: "Groceries" };
    const budget2 = { userId: "1", amount: 200, category: "Transportation" };
    const budget3 = { userId: "2", amount: 300, category: "Groceries" };

    await budgetRepository.create(budget);
    await budgetRepository.create(budget2);
    await budgetRepository.create(budget3);

    const budgets = await budgetService.getBudgetsByUserId("1");

    expect(budgets).toEqual([
      { id: "0", amount: 100, category: "Groceries" },
      { id: "1", amount: 200, category: "Transportation" },
    ]);
  });
});
