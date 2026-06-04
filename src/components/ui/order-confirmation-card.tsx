import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderConfirmationCardProps {
  orderId: string;
  paymentMethod: string;
  dateTime: string;
  totalAmount: React.ReactNode;
  onGoToAccount: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
  labels?: {
    orderId?: string;
    paymentMethod?: string;
    dateTime?: string;
    total?: string;
  };
}

export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToAccount,
  title = "Your order has been successfully submitted",
  buttonText = "Go to my account",
  icon,
  className,
  labels,
}) => {
  const details: Array<{ label: string; value: React.ReactNode; isBold?: boolean }> = [
    { label: labels?.orderId ?? "Order ID", value: orderId },
    { label: labels?.paymentMethod ?? "Payment Method", value: paymentMethod },
    { label: labels?.dateTime ?? "Date & Time", value: dateTime },
    { label: labels?.total ?? "Total", value: totalAmount, isBold: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut", staggerChildren: 0.08 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-xl p-6 sm:p-8",
        className,
      )}
    >
      <motion.div variants={itemVariants} className="flex justify-center">
        {icon ?? (
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-emerald-500/40">
            <CheckCircle2 className="!h-10 !w-10 text-emerald-500" />
          </span>
        )}
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="mt-5 text-center text-xl sm:text-2xl font-semibold tracking-tight"
      >
        {title}
      </motion.h2>

      <motion.div variants={itemVariants} className="mt-6 divide-y divide-border">
        {details.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <span className={cn("text-muted-foreground", item.isBold && "text-foreground font-semibold text-base")}>
              {item.label}
            </span>
            <span className={cn("text-foreground", item.isBold ? "font-bold text-base" : "font-medium")}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6">
        <Button onClick={onGoToAccount} className="w-full h-11 rounded-xl" size="lg">
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmationCard;
