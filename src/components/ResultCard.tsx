/**
 * Neural Canvas Design: Result Card for displaying prediction outputs
 */
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  color: "indigo" | "emerald" | "rose" | "amber" | "blue";
  delay?: number;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: "text-indigo-500",
    border: "border-indigo-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "text-emerald-500",
    border: "border-emerald-100",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    icon: "text-rose-500",
    border: "border-rose-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "text-amber-500",
    border: "border-amber-100",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-500",
    border: "border-blue-100",
  },
};

export default function ResultCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay = 0,
}: ResultCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colors.icon}`} />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-heading font-bold ${colors.text} font-mono-nums`}>
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-slate-400">{suffix}</span>
        )}
      </div>
    </motion.div>
  );
}
