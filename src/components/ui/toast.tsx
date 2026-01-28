"use client";

import * as React from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-100 flex flex-col items-end justify-start gap-3 p-4 sm:p-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[toast.type];

  const styles = {
    success: {
      container:
        "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100/50",
      icon: "text-green-600",
      title: "text-green-900",
      description: "text-green-700",
      progress: "bg-green-500",
    },
    error: {
      container:
        "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg shadow-red-100/50",
      icon: "text-red-600",
      title: "text-red-900",
      description: "text-red-700",
      progress: "bg-red-500",
    },
    info: {
      container:
        "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg shadow-purple-100/50",
      icon: "text-purple-600",
      title: "text-purple-900",
      description: "text-purple-700",
      progress: "bg-purple-500",
    },
    warning: {
      container:
        "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg shadow-amber-100/50",
      icon: "text-amber-600",
      title: "text-amber-900",
      description: "text-amber-700",
      progress: "bg-amber-500",
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={cn(
        "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ease-out",
        style.container,
        isExiting ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
      )}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-white/30">
        <div
          className={cn("animate-toast-progress h-full", style.progress)}
          style={{
            animationDuration: `${toast.duration}ms`,
          }}
        />
      </div>

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="shrink-0">
          <Icon className={cn("h-6 w-6", style.icon)} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <h3 className={cn("leading-tight font-semibold", style.title)}>
            {toast.title}
          </h3>
          {toast.description && (
            <p className={cn("text-sm leading-snug", style.description)}>
              {toast.description}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "shrink-0 rounded-lg p-1 transition-colors hover:bg-white/50",
            style.icon
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Add animation to globals.css
