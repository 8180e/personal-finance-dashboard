import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CardWithHeader from "./card-with-header";
import { useContext } from "react";
import TransactionsContext from "@/app/dashboard/transactions-context";
import Button from "./custom-button";

const formSchema = z.object({
  category: z.string().nonempty(),
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
});

const TransactionForm = () => {
  const { setTransactions } = useContext(TransactionsContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "", amount: 0, type: "INCOME" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data: transaction } = await axios.post("/transactions", values);
    setTransactions((transactions) => [...transactions, transaction]);
  };

  return (
    <CardWithHeader
      title="Transaction Form"
      description="Create a new transaction"
      className="m-8 w-1/2 mx-auto"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          noValidate
        >
          {[
            { name: "category", label: "Category", type: "text" },
            {
              name: "amount",
              label: "Amount",
              type: "number",
              min: 0,
              step: 0.01,
            },
          ].map(({ name, label, ...props }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as "category" | "amount"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...props}
                      onChange={
                        name === "amount"
                          ? ({ target: { value } }) =>
                              // change amount to number
                              field.onChange(Number(value))
                          : field.onChange
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting}>Submit</Button>
        </form>
      </Form>
    </CardWithHeader>
  );
};

export default TransactionForm;
