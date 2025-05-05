import { createContext } from "react";

const BudgetsContext = createContext<{
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}>({ budgets: [], setBudgets: () => {} });

export default BudgetsContext;
