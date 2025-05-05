import { TransactionRepository } from "../repositories/transaction.repository.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.util.js";

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  createTransaction = async (transaction: InputTransaction) =>
    await this.transactionRepository.create(transaction);

  getAllByUserId = async (userId: string) =>
    await this.transactionRepository.getAllByUserId(userId);

  deleteTransaction = async (transactionId: string, userId: string) => {
    const transaction = await this.transactionRepository.getById(transactionId);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this transaction"
      );
    }

    await this.transactionRepository.delete(transactionId);
  };
}
