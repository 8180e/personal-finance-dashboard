import { TransactionRepository } from "./transaction.repository.js";
import Transaction from "../models/transaction.model.js";

export class MongoTransactionRepository implements TransactionRepository {
  create = async (transaction: InputTransaction) => {
    const newTransaction = await Transaction.create(transaction);
    return newTransaction.toJSON();
  };

  getAllByUserId = async (userId: string) => {
    const transactions = await Transaction.find({ userId });
    return transactions.map((transaction) => transaction.toJSON());
  };

  getById = async (transactionId: string) => {
    const transaction = await Transaction.findById(transactionId);
    return (
      transaction && {
        ...transaction.toJSON(),
        userId: transaction.userId.toString(),
      }
    );
  };

  delete = async (transactionId: string) => {
    await Transaction.deleteOne({ _id: transactionId });
  };
}
