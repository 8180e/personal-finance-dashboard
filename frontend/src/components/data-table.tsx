import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import axios from "axios";
import TransactionsContext from "@/app/dashboard/transactions-context";
import { useContext, useMemo } from "react";
import BudgetsContext from "@/app/dashboard/budgets-context";
import DataTablePagination from "./data-table-pagination";
import { generateCsv, download, mkConfig } from "export-to-csv";

const DeleteButton = ({
  type,
  id,
}: {
  type: "transaction" | "budget";
  id: string;
}) => {
  const { setTransactions } = useContext(TransactionsContext);
  const { setBudgets } = useContext(BudgetsContext);
  const handleClick = async () => {
    await axios.delete(`/${type}s/${id}`);
    if (type === "transaction") {
      setTransactions((transactions) =>
        transactions.filter((transaction) => transaction.id !== id)
      );
    } else {
      setBudgets((budgets) => budgets.filter((budget) => budget.id !== id));
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Trash2 />
    </Button>
  );
};

const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className="w-64">{row.original.category}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        className={
          row.original.type === "INCOME" ? "bg-blue-600" : "bg-red-600"
        }
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "createdAt",
    header: () => "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
  },
  {
    id: "delete",
    cell: ({ row }) => <DeleteButton type="transaction" id={row.original.id} />,
  },
];

const budgetColumns: ColumnDef<Budget>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className="w-64">{row.original.category}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => row.original.amount,
  },
  {
    id: "delete",
    cell: ({ row }) => <DeleteButton type="budget" id={row.original.id} />,
  },
];

const csvConfig = mkConfig({ useKeysAsHeaders: true });

const DataTable = () => {
  const { transactions } = useContext(TransactionsContext);
  const { budgets } = useContext(BudgetsContext);

  const transactionsData = useMemo(
    // Reverse the order of transactions so that the most recent transactions
    // are at the top
    () => [...transactions].reverse(),
    [transactions]
  );

  const transactionsTable = useReactTable({
    data: transactionsData,
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const budgetsTable = useReactTable({
    data: budgets,
    columns: budgetColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const downloadCSV = () => {
    const csvData = transactionsData.map((transaction) => ({
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    }));
    const csv = generateCsv(csvConfig)(csvData);
    download(csvConfig)(csv);
  };

  return (
    <Tabs
      defaultValue="transactions"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 flex **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {transactionsTable
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="transactions"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {transactionsTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {transactionsTable.getRowModel().rows?.length ? (
                transactionsTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={transactionColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={transactionsTable} />
      </TabsContent>
      <TabsContent
        value="budgets"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {budgetsTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {budgetsTable.getRowModel().rows?.length ? (
                budgetsTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={budgetColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={budgetsTable} />
      </TabsContent>
      <Button onClick={() => downloadCSV()}>Export to CSV</Button>
    </Tabs>
  );
};

export default DataTable;
