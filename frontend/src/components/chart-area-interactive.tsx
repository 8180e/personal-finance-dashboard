import { useState, useEffect, useContext } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const ChartAreaInteractive = () => {
  const { transactions } = useContext(TransactionsContext);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Filter data based on time range
  const filteredData = transactions.filter((item) => {
    const date = new Date(item.createdAt);
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Group data by day
  const data = filteredData.reduce((acc, { createdAt, amount, type }) => {
    const date = new Date(createdAt);
    const day = date.toISOString().split("T")[0];
    if (!acc[day]) {
      acc[day] = { income: 0, expense: 0 };
    }
    acc[day][type.toLowerCase() as "income" | "expense"] += amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Map data to chart format
  const chartData = Object.entries(data).map(([date, { income, expense }]) => ({
    date,
    income,
    expense,
  }));
  chartData.push({
    date: `${tomorrow.toISOString().split("T")[0]} (Predicted)`,
    ...predictIncomeAndExpense(data),
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
          >
            <defs>
              <linearGradient id="fillincome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillexpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value, index) => {
                const date = new Date(value);
                return (
                  date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }) + (index === chartData.length - 1 ? " (Predicted)" : "")
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillexpense)"
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillincome)"
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartAreaInteractive;
