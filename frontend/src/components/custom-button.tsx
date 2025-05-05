import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const CustomButton = (props: React.ComponentProps<"button">) => (
  <Button type="submit" className="w-full" {...props}>
    {props.disabled ? (
      <>
        <Loader2 className="animate-spin" />
        Please wait
      </>
    ) : (
      props.children
    )}
  </Button>
);

export default CustomButton;
