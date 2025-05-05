import mongoose from "mongoose";

interface ITransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

interface ITransactionToJSON {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

transactionSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.userId;
    delete ret.updatedAt;
    return ret;
  },
});

const Transaction = mongoose.model<
  ITransaction,
  mongoose.Model<ITransaction & ITransactionToJSON>
>("Transaction", transactionSchema);

export default Transaction;
