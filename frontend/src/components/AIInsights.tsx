import { motion } from "framer-motion";
import { getWeeklySummary, getPatternInsight } from "@/lib/dummy-data";
import ReactMarkdown from "react-markdown";
import { Brain, BarChart3, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

export default function AIInsights() {
  const summary = getWeeklySummary();
  const pattern = getPatternInsight();
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data)
  });
  const isPremium = user?.subscriptionPlan === "paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5 text-primary" />
        AI Insights
      </h3>

      <div className="space-y-3">
        <div className="rounded-xl bg-secondary/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary/80 mb-2">
            <BarChart3 className="h-3 w-3" />
            Weekly Summary
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-purple-400 mb-2">
            <Brain className="h-3 w-3" />
            Pattern Detection
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{pattern}</p>
        </div>
      </div>

      {!isPremium && (
        <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-amber-500/20 z-10">
          <Lock className="h-8 w-8 text-amber-500 mb-3" />
          <h3 className="font-bold text-foreground">Premium Feature</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Unlock personalized AI insights to optimize your streak.</p>
          <Link to="/profile" className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold px-5 py-2 rounded-lg text-sm transition-colors">
            Upgrade Now
          </Link>
        </div>
      )}
    </motion.div>
  );
}
