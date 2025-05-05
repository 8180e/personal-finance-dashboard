import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useContext } from "react";
import TransactionsContext from "@/app/dashboard/transactions-context";
import BudgetsContext from "@/app/dashboard/budgets-context";

const chartConfig = {
  budget: { label: "Budget", color: "#3b82f6" },
  expense: { label: "Expense", color: "#ef4444" },
} satisfies ChartConfig;

const BudgetRadarChart = () => {
  const { budgets } = useContext(BudgetsContext);
  const { transactions } = useContext(TransactionsContext);
  const chartData = budgets.map(({ category, amount }) => ({
    category: category,
    budget: amount,
    expense: transactions
      .filter((transaction) => transaction.category === category)
      .reduce(
        (acc, { amount, type }) => acc + amount * (type === "INCOME" ? -1 : 1),
        0
      ),
  }));

  let recommendation = "";

  const maxExpense = chartData.reduce(
    (max, current) =>
      current.budget - current.expense < max.budget - max.expense
        ? current
        : max,
    chartData[0]
  );
  if (maxExpense.expense > maxExpense.budget) {
    recommendation = `You've exceeded your ${maxExpense.category} budget`;
  }

  return budgets.length ? (
    <div className="mx-auto aspect-square max-h-[250px] w-1/2">
      <ChartContainer config={chartConfig}>
        <RadarChart data={chartData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarAngleAxis dataKey="category" />
          <PolarGrid />
          <Radar
            dataKey="budget"
            fill="var(--color-budget)"
            fillOpacity={0.6}
          />
          <Radar dataKey="expense" fill="var(--color-expense)" />
        </RadarChart>
      </ChartContainer>
      <div className="text-center text-sm">{recommendation}</div>
    </div>
  ) : (
    <div className="text-center">Add a budget to see this chart</div>
  );
};

export default BudgetRadarChart;
