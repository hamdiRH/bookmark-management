import { AlertCircle, WifiOff } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

interface ErrorCardProps {
  title: string;
  message: string;
  retry?: () => void;
  isOffline?: boolean;
}

export function ErrorCard({ title, message, retry, isOffline }: ErrorCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 text-center">
        {isOffline ? (
          <WifiOff className="mx-auto h-12 w-12 text-gray-400" />
        ) : (
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        {retry && (
          <Button onClick={retry} className="mt-4">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}