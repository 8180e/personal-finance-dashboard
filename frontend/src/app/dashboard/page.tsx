import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getCookie } from "@/utils/cookies";
import { Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import TransactionsContext from "./transactions-context";
import BudgetsContext from "./budgets-context";
import { Skeleton } from "@/components/ui/skeleton";

const ChartAreaInteractive = lazy(
  () => import("@/components/chart-area-interactive")
);
const DataTable = lazy(() => import("@/components/data-table"));
const TransactionForm = lazy(() => import("@/components/transaction-form"));
const BudgetForm = lazy(() => import("@/components/budget-form"));
const TransactionBarChart = lazy(
  () => import("@/components/transaction-bar-chart")
);
const TransactionPieChart = lazy(
  () => import("@/components/transaction-pie-chart")
);
const BudgetRadarChart = lazy(() => import("@/components/budget-radar-chart"));

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data }: { data: Transaction[] } = await axios.get(
        "/transactions"
      );
      setTransactions(data);
    };
    const fetchBudgets = async () => {
      const { data }: { data: Budget[] } = await axios.get("/budgets");
      setBudgets(data);
    };
    fetchTransactions();
    fetchBudgets();
  }, []);

  if (!getCookie("token")) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <TransactionsContext.Provider
                value={{ transactions, setTransactions }}
              >
                <BudgetsContext.Provider value={{ budgets, setBudgets }}>
                  <div className="flex gap-4 m-4">
                    <Suspense
                      fallback={
                        <Skeleton className="m-8 w-1/2 mx-auto bg-muted" />
                      }
                    >
                      <TransactionForm />
                    </Suspense>
                    <Suspense
                      fallback={
                        <Skeleton className="m-8 w-1/2 mx-auto bg-muted" />
                      }
                    >
                      <BudgetForm />
                    </Suspense>
                  </div>
                  <div className="px-4 lg:px-6">
                    <Suspense
                      fallback={
                        <Skeleton className="m-8 w-full mx-auto bg-muted" />
                      }
                    >
                      <ChartAreaInteractive />
                    </Suspense>
                  </div>
                  <div className="flex items-center justify-center flex-wrap gap-4 xl:flex-nowrap">
                    <Suspense
                      fallback={
                        <Skeleton className="m-8 w-1/2 mx-auto bg-muted" />
                      }
                    >
                      <TransactionBarChart />
                      <div className="flex items-center w-1/2">
                        <TransactionPieChart />
                      </div>
                      <BudgetRadarChart />
                    </Suspense>
                  </div>
                  <Suspense
                    fallback={<Skeleton className="w-full mx-auto bg-muted" />}
                  >
                    <DataTable />
                  </Suspense>
                </BudgetsContext.Provider>
              </TransactionsContext.Provider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
