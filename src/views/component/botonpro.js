import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingButton({ children, onClick, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      disabled={loading || disabled}
      className={`px-5 py-3 rounded-2xl font-medium text-white shadow-lg transition
        ${loading || disabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
    >
      {loading ? (
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Loading...</span>
        </motion.div>
      ) : (
        children
      )}
    </motion.button>
  );
}
