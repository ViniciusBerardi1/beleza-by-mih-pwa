import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Toast({ mensagem, onFechar }) {
  useEffect(() => {
    const t = setTimeout(onFechar, 3000);
    return () => clearTimeout(t);
  }, [onFechar]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg rounded-2xl px-5 py-3 flex items-center gap-3 max-w-[90vw]"
    >
      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">
        ✓
      </span>
      <span className="text-sm font-medium text-gray-700">
        {mensagem}
      </span>
    </motion.div>
  );
}
