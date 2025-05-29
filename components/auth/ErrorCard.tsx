import { Header } from "@/components/auth/Header";
import { BackButton } from "./BackButton";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export const ErrorCard = ({ message }: { message: string }) => {
  return (
    <Card className="w-[400px shadow-md">
      <CardHeader>
        <Header label={message} />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
