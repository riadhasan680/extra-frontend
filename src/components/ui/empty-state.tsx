import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-border/50 bg-muted/20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-sm">
        {description}
      </p>
      {action}
    </div>
  );
}
