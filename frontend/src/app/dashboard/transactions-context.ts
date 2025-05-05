import { createContext } from "react";

const TransactionsContext = createContext<{
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}>({ transactions: [], setTransactions: () => {} });

export default TransactionsContext;
