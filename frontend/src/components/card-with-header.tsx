import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const CardWithHeader = ({
  className,
  title,
  description,
  children,
}: {
  className?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default CardWithHeader;
