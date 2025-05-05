import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import axios from "axios";
import { setCookie } from "@/utils/cookies";
import CardWithHeader from "./card-with-header";
import Button from "./custom-button";

export function AuthForm({
  className,
  method,
  ...props
}: React.ComponentProps<"div"> & { method: "sign-up" | "sign-in" }) {
  const formShape: {
    name?: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
  } = { email: z.string().email(), password: z.string().min(6) };

  const fields: {
    name: "name" | "email" | "password";
    type: string;
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "johndoe@example.com",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "********",
    },
  ];

  if (method === "sign-up") {
    formShape.name = z.string().nonempty();
    fields.unshift({
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "John Doe",
    });
  }

  const formSchema = z.object(formShape);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      data: { token },
    } = await axios.post(`auth/${method}`, values);
    setCookie("token", token, 1);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    navigate("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardWithHeader
        title={`Sign ${method === "sign-up" ? "up" : "in"} to your account`}
        description={
          method === "sign-up"
            ? "Enter your email below to create your account"
            : "Enter your details below to sign in"
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              {fields.map(({ name, label, ...props }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...props}
                          {...field}
                          value={field.value as string | undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex flex-col gap-3">
                <Button disabled={form.formState.isSubmitting}>
                  {method === "sign-up" ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {method === "sign-in" ? (
                <>
                  Don't have an account?
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?
                  <Link to="/sign-in" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardWithHeader>
    </div>
  );
}
