/// <reference types="../../src/types/transaction" />
import { TransactionRepository } from "../../src/repositories/transaction.repository";

export class FakeTransactionRepository implements TransactionRepository {
  private transactions: (InputTransaction & OutputTransaction)[] = [];

  create = async (
    transaction: InputTransaction
  ): Promise<OutputTransaction> => {
    const newTransaction = {
      ...transaction,
      id: this.transactions.length.toString(),
    };
    this.transactions.push(newTransaction);
    const { userId: _, ...transactionWithoutUserId } = newTransaction;
    return transactionWithoutUserId;
  };

  getAllByUserId = async (userId: string): Promise<OutputTransaction[]> =>
    this.transactions
      .filter((t) => t.userId === userId)
      .map((t) => ({ ...t, userId: undefined }));

  getById = async (transactionId: string): Promise<InputTransaction | null> =>
    this.transactions.find((t) => t.id === transactionId) || null;

  delete = async (transactionId: string): Promise<void> => {
    this.transactions = this.transactions.filter((t) => t.id !== transactionId);
  };
}
