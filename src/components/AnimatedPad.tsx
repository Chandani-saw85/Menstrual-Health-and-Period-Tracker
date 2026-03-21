import { motion } from "framer-motion";

const AnimatedPad = () => (
  <motion.div
    className="relative w-16 h-20 animate-float"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {/* Pad body */}
    <div className="absolute inset-0 rounded-[40%] bg-gradient-to-b from-rose-100 to-rose-50 border border-rose-200/50 shadow-sm" />
    {/* Wings */}
    <div className="absolute top-1/2 -left-2 w-5 h-3 rounded-full bg-rose-100/80 -translate-y-1/2 rotate-[-10deg]" />
    <div className="absolute top-1/2 -right-2 w-5 h-3 rounded-full bg-rose-100/80 -translate-y-1/2 rotate-[10deg]" />
    {/* Center accent */}
    <motion.div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-8 rounded-full"
      style={{
        background: "linear-gradient(180deg, hsla(340, 80%, 72%, 0.3), hsla(340, 80%, 60%, 0.15))",
      }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);

export default AnimatedPad;
