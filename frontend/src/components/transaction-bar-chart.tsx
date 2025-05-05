import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useContext } from "react";
import TransactionsContext from "@/app/dashboard/transactions-context";
import predictIncomeAndExpense from "@/utils/predictIncomeAndExpense";

const chartConfig = {
  income: {
    label: "Income",
    color: "#3b82f6",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const TransactionBarChart = () => {
  const { transactions } = useContext(TransactionsContext);
  const data = transactions.reduce((acc, { createdAt, amount, type }) => {
    const date = new Date(createdAt);
    const month = date.toLocaleString("default", { month: "long" });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    acc[month][type.toLowerCase() as "income" | "expense"] += amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  const chartData = Object.entries(data).map(
    ([month, { income, expense }]) => ({
      month,
      income,
      expense,
    })
  );

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  chartData.push({
    month: `${nextMonth.toLocaleString("default", {
      month: "long",
    })} (Predicted)`,
    ...predictIncomeAndExpense(data),
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-1/2">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default TransactionBarChart;
