import { Request, Response, NextFunction } from "express";
import { MongoTransactionRepository } from "../repositories/mongo.transaction.repository.js";
import { TransactionService } from "../services/transaction.service.js";

const transactionRepository = new MongoTransactionRepository();
const transactionService = new TransactionService(transactionRepository);

const createTransaction = async (
  { body: transaction, user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdTransaction = await transactionService.createTransaction({
      ...transaction,
      userId: user!.id,
    });
    res.status(201).json(createdTransaction);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (
  { user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await transactionService.getAllByUserId(user!.id);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (
  { params: { id }, user }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await transactionService.deleteTransaction(id, user!.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export { createTransaction, getTransactions, deleteTransaction };
