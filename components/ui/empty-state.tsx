import { FolderPlus } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: () => void;
  actionLabel?: string;
}

export function EmptyState({ title, message, action, actionLabel }: EmptyStateProps) {
  return (
    <Card className={cn("w-full", "rounded-md border bg-popover shadow-md")}>
      <CardContent className="pt-6 text-center">
        <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        {action && actionLabel && (
          <Button onClick={action} className="mt-4 rounded-md border bg-primary text-white">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
