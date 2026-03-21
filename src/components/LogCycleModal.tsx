import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CycleEntry } from "@/lib/cycle-utils";
import { X, CalendarPlus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: CycleEntry) => void;
}

const LogCycleModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = () => {
    onAdd({
      id: Date.now().toString(),
      startDate: new Date(startDate),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="glass-card-elevated p-6 w-full max-w-sm relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Log Period</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="block text-sm text-muted-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={handleSubmit} className="btn-gradient w-full mt-4 text-sm">
              Save
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogCycleModal;
