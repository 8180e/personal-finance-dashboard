interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
}
