import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tag } from "@/lib/dummy-data";
import StreakDisplay from "@/components/StreakDisplay";
import StreakCalendar from "@/components/StreakCalendar";
import LogEntry from "@/components/LogEntry";
import BadgeGrid from "@/components/BadgeGrid";
import AIInsights from "@/components/AIInsights";
import RecentEntries from "@/components/RecentEntries";
import { Flame } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm tracking-tight text-foreground">No Zero Days</span>
          </div>
          <Link to="/profile" className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground hover:ring-2 hover:ring-primary transition-all">
            AK
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-24">
        <StreakDisplay />
        <LogEntry />
        <StreakCalendar />
        <RecentEntries />
        <div className="grid grid-cols-1 gap-5">
          <BadgeGrid />
          <AIInsights />
        </div>
      </main>
    </div>
  );
};

export default Index;
