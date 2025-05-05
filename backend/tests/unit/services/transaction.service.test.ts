import { describe, it, expect } from "vitest";
import { TransactionService } from "../../../src/services/transaction.service";
import { FakeTransactionRepository } from "../../mocks/fake.transaction.repository";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../src/utils/errors.util";

describe("createTransaction", () => {
  it("creates a transaction", async () => {
    const transactionRepository = new FakeTransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    const transaction = {
      userId: "1",
      amount: 100,
      type: "EXPENSE" as "INCOME" | "EXPENSE",
      category: "Groceries",
    };
    const transaction2 = {
      userId: "2",
      amount: 200,
      type: "INCOME" as "INCOME" | "EXPENSE",
      category: "Salary",
    };

    const createdTransaction = await transactionService.createTransaction(
      transaction
    );
    const createdTransaction2 = await transactionService.createTransaction(
      transaction2
    );

    expect(createdTransaction).toEqual({
      id: "0",
      amount: 100,
      type: "EXPENSE",
      category: "Groceries",
    });
    expect(createdTransaction2).toEqual({
      id: "1",
      amount: 200,
      type: "INCOME",
      category: "Salary",
    });
  });
});

describe("getTransactionsByUserId", () => {
  it("returns all transactions for a user", async () => {
    const transactionRepository = new FakeTransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    const transaction = {
      userId: "1",
      amount: 100,
      type: "EXPENSE" as "INCOME" | "EXPENSE",
      category: "Groceries",
    };
    const transaction2 = {
      userId: "1",
      amount: 200,
      type: "INCOME" as "INCOME" | "EXPENSE",
      category: "Salary",
    };
    const transaction3 = {
      userId: "2",
      amount: 300,
      type: "INCOME" as "INCOME" | "EXPENSE",
      category: "Salary",
    };

    transactionRepository.create(transaction);
    transactionRepository.create(transaction2);
    transactionRepository.create(transaction3);

    const transactions = await transactionService.getAllByUserId("1");
    const transactions2 = await transactionService.getAllByUserId("2");

    expect(transactions).toEqual([
      { id: "0", amount: 100, type: "EXPENSE", category: "Groceries" },
      { id: "1", amount: 200, type: "INCOME", category: "Salary" },
    ]);
    expect(transactions2).toEqual([
      { id: "2", amount: 300, type: "INCOME", category: "Salary" },
    ]);
  });
});

describe("deleteTransaction", () => {
  it("deletes a transaction", async () => {
    const transactionRepository = new FakeTransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    const transaction = {
      userId: "1",
      amount: 100,
      type: "EXPENSE" as "INCOME" | "EXPENSE",
      category: "Groceries",
    };
    const transaction2 = {
      userId: "1",
      amount: 200,
      type: "INCOME" as "INCOME" | "EXPENSE",
      category: "Salary",
    };

    transactionRepository.create(transaction);
    transactionRepository.create(transaction2);

    const deletedTransaction = await transactionService.deleteTransaction(
      "0",
      "1"
    );

    expect(deletedTransaction).toBeUndefined();

    const transactions = await transactionService.getAllByUserId("1");

    expect(transactions).toEqual([
      { id: "1", amount: 200, type: "INCOME", category: "Salary" },
    ]);
  });

  it("throws error if transaction does not exist", async () => {
    const transactionRepository = new FakeTransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    await expect(
      transactionService.deleteTransaction("0", "1")
    ).rejects.toThrow(NotFoundError);
  });

  it("throws error if user does not own transaction", async () => {
    const transactionRepository = new FakeTransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    const transaction = {
      userId: "2",
      amount: 100,
      type: "EXPENSE" as "INCOME" | "EXPENSE",
      category: "Groceries",
    };

    transactionRepository.create(transaction);

    await expect(
      transactionService.deleteTransaction("0", "1")
    ).rejects.toThrow(UnauthorizedError);
  });
});
