/**
 * Neural Canvas Design: AI Processing animation
 * Shows a neural-network-like animation while "processing" the prediction
 */
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface PredictionLoaderProps {
  label?: string;
}

export default function PredictionLoader({
  label = "Procesando predicción...",
}: PredictionLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-6"
    >
      {/* Animated brain icon with pulse rings */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-20 h-20 rounded-full bg-indigo-500/20 -m-2"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="absolute inset-0 w-20 h-20 rounded-full bg-indigo-500/10 -m-2"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full"
          />
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs text-slate-400 mt-1"
        >
          Analizando variables del modelo...
        </motion.p>
      </div>
    </motion.div>
  );
}
