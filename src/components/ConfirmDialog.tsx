"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      button: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    warning: {
      button: "bg-[#F59E0B] hover:bg-[#D97706] text-white",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    info: {
      button: "bg-gradient-to-r from-[#00F2EA] to-[#6F3FF5] text-white",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <Card 
        className="p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            variant="ghost"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={variantConfig[variant].button}
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
