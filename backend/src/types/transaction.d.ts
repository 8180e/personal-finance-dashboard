interface InputTransaction {
  userId: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
}

interface OutputTransaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: Date;
}
