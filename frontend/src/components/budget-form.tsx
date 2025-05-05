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
import CardWithHeader from "./card-with-header";
import { useContext } from "react";
import BudgetsContext from "@/app/dashboard/budgets-context";
import Button from "./custom-button";

const formSchema = z.object({
  category: z.string().nonempty(),
  amount: z.number().positive(),
});

const BudgetForm = () => {
  const { setBudgets } = useContext(BudgetsContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "", amount: 0 },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data: budget } = await axios.post("/budgets", values);
    setBudgets((budgets) => [...budgets, budget]);
  };

  return (
    <CardWithHeader
      title="Budget Form"
      description="Create a new budget"
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
          <Button disabled={form.formState.isSubmitting}>Submit</Button>
        </form>
      </Form>
    </CardWithHeader>
  );
};

export default BudgetForm;
