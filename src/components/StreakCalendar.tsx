import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCalendarDays } from "@/lib/dummy-data";
import { format, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StreakCalendar() {
  const [current, setCurrent] = useState(new Date());
  const year = current.getFullYear();
  const month = current.getMonth();
  const days = getCalendarDays(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const statusColor: Record<string, string> = {
    success: "bg-success",
    missed: "bg-missed/60",
    future: "bg-secondary/40",
    today: "bg-primary/30 ring-2 ring-primary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-card border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrent(subMonths(current, 1))}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {format(current, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrent(addMonths(current, 1))}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors active:scale-95"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-muted-foreground/60 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        <AnimatePresence mode="wait">
          {days.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.01 }}
              className={`aspect-square rounded-lg ${statusColor[day.status]} transition-all duration-200`}
              title={`${day.date}: ${day.status}`}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> Logged</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-missed/60" /> Missed</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/30 ring-1 ring-primary" /> Today</span>
      </div>
    </motion.div>
  );
}
