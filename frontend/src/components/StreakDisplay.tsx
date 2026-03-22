import { motion } from "framer-motion";
import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function StreakDisplay() {
  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: () => api.get("/entries/streak").then(res => res.data)
  });

  if (!streak) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div className="streak-glow inline-flex flex-col items-center rounded-3xl bg-card px-10 py-8 border border-border">
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl font-black tracking-tight text-primary"
        >
          {streak.current}
        </motion.div>
        <div className="mt-1 flex items-center gap-1.5 text-primary/80">
          <Flame className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-widest">Day Streak</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <StatCard icon={<Trophy className="h-4 w-4 text-amber-400" />} label="Longest" value={`${streak.longest} days`} delay={0.1} />
        <StatCard icon={<Calendar className="h-4 w-4 text-accent" />} label="Total Days" value={String(streak.totalDays)} delay={0.15} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-blue-400" />} label="This Week" value={`${streak.weeklyScore}%`} delay={0.2} />
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl bg-card border border-border p-4 card-hover"
    >
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
    </motion.div>
  );
}
