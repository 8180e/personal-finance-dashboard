import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useContext, useState } from "react";
import TransactionsContext from "@/app/dashboard/transactions-context";

const thisMonth = new Date().getMonth();

const TransactionPieChart = () => {
  const { transactions } = useContext(TransactionsContext);
  const [colors, setColors] = useState<Record<string, string>>({});

  const transactionsOfThisMonth = transactions.filter(
    ({ createdAt }) => new Date(createdAt).getMonth() === thisMonth
  );
  const data = transactionsOfThisMonth.reduce(
    (acc, { category, amount, type }) => {
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0 };
      }
      acc[category][type.toLowerCase() as "income" | "expense"] += amount;
      return acc;
    },
    {} as Record<string, { income: number; expense: number }>
  );
  const chartData = Object.entries(data).map(
    ([category, { income, expense }]) => ({
      category,
      amount: Math.abs(income - expense),
      fill: `var(--color-${category.replace(/\s/g, "")})`,
    })
  );

  const chartConfig = transactions.reduce(
    (acc, { category, type }) => {
      const categoryWithoutSpaces = category.replace(/\s/g, "");

      if (!colors[categoryWithoutSpaces]) {
        setColors((colors) => ({
          ...colors,
          // if type is income, generate a random blue hue, otherwise generate
          // a random red hue
          [categoryWithoutSpaces]: `hsl(${
            type === "INCOME" ? 240 : 0
          }, 100%, ${Math.floor(Math.random() * 31 + 50)}%)`,
        }));
      }

      return {
        ...acc,
        [categoryWithoutSpaces]: {
          label: category,
          color: colors[categoryWithoutSpaces],
        },
      };
    },
    { amount: { label: "Amount" } }
  ) satisfies ChartConfig;

  const totalAmount = Object.values(data).reduce(
    (acc, { income, expense }) => acc + income - expense,
    0
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full md:4/5 lg:w-3/4 xl:w-2/3"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) =>
              viewBox &&
              "cx" in viewBox &&
              "cy" in viewBox && (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {Math.abs(totalAmount).toFixed(2)}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) + 24}
                    className="fill-muted-foreground"
                  >
                    Total {totalAmount >= 0 ? "Income" : "Expense"}
                  </tspan>
                </text>
              )
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default TransactionPieChart;
