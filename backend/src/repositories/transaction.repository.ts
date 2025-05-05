export interface TransactionRepository {
  create: (transaction: InputTransaction) => Promise<OutputTransaction>;
  getAllByUserId: (userId: string) => Promise<OutputTransaction[]>;
  getById: (transactionId: string) => Promise<InputTransaction | null>;
  delete: (transactionId: string) => Promise<void>;
}
