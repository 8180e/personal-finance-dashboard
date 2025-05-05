import mongoose from "mongoose";

interface IBudget extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
}

interface IBudgetToJSON {
  id: string;
  category: string;
  amount: number;
}

const budgetSchema = new mongoose.Schema<IBudget>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

budgetSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.userId;
    return ret;
  },
});

const Budget = mongoose.model<IBudget, mongoose.Model<IBudget & IBudgetToJSON>>(
  "Budget",
  budgetSchema
);

export default Budget;
