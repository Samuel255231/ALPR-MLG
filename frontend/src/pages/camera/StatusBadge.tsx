"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Wrench, XCircle } from "lucide-react";
import { type ReactNode } from "react";

type StatusType = "Actif" | "En maintenance" | "En panne";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap: Record<
    StatusType,
    { className: string; icon: ReactNode; label: string }
  > = {
    Actif: {
      className: "bg-green-500 text-white dark:bg-green-600",
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
      label: "Actif",
    },
    "En maintenance": {
      className: "bg-yellow-500 text-black dark:bg-yellow-600",
      icon: <Wrench className="w-4 h-4 mr-1" />,
      label: "En maintenance",
    },
    "En panne": {
      className: "bg-red-500 text-white dark:bg-red-600",
      icon: <XCircle className="w-4 h-4 mr-1" />,
      label: "En panne",
    },
  };

  const { className, icon, label } = statusMap[status];

  return (
    <Badge variant="secondary" className={className}>
      {icon}
      {label}
    </Badge>
  );
}
