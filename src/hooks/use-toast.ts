import { useToast as useToastContext } from "@/components/ui/toast";

export const useToast = () => {
  const { addToast } = useToastContext();

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
  }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
    duration?: number;
  }) => {
    let type: "info" | "error" | "success" = "info";
    
    if (variant === "destructive") type = "error";
    if (variant === "success") type = "success";
    
    addToast({
      title,
      description,
      type,
      duration,
    });
  };

  return { toast };
};
