import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";

export type Tag = "work" | "health" | "learning" | "personal";

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  tags: Tag[];
  createdAt: Date;
}

export interface StreakData {
  current: number;
  longest: number;
  totalDays: number;
  weeklyScore: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface DayStatus {
  date: string;
  status: "success" | "missed" | "future" | "today";
}

const sampleEntries: Omit<Entry, "id">[] = [
  { date: format(subDays(new Date(), 0), "yyyy-MM-dd"), content: "Reviewed pull requests and shipped the new dashboard feature", tags: ["work"], createdAt: new Date() },
  { date: format(subDays(new Date(), 1), "yyyy-MM-dd"), content: "30 min morning run + stretching routine", tags: ["health"], createdAt: subDays(new Date(), 1) },
  { date: format(subDays(new Date(), 2), "yyyy-MM-dd"), content: "Finished chapter 4 of Designing Data-Intensive Applications", tags: ["learning"], createdAt: subDays(new Date(), 2) },
  { date: format(subDays(new Date(), 3), "yyyy-MM-dd"), content: "Fixed auth bug, deployed to staging", tags: ["work"], createdAt: subDays(new Date(), 3) },
  { date: format(subDays(new Date(), 4), "yyyy-MM-dd"), content: "Called mom, organized apartment", tags: ["personal"], createdAt: subDays(new Date(), 4) },
  { date: format(subDays(new Date(), 5), "yyyy-MM-dd"), content: "Built a side project prototype with React", tags: ["learning", "work"], createdAt: subDays(new Date(), 5) },
  { date: format(subDays(new Date(), 6), "yyyy-MM-dd"), content: "Yoga session + meal prepped for the week", tags: ["health", "personal"], createdAt: subDays(new Date(), 6) },
  { date: format(subDays(new Date(), 8), "yyyy-MM-dd"), content: "Wrote documentation for the API", tags: ["work"], createdAt: subDays(new Date(), 8) },
  { date: format(subDays(new Date(), 9), "yyyy-MM-dd"), content: "Completed online course module on system design", tags: ["learning"], createdAt: subDays(new Date(), 9) },
  { date: format(subDays(new Date(), 10), "yyyy-MM-dd"), content: "Gym session — legs day", tags: ["health"], createdAt: subDays(new Date(), 10) },
  { date: format(subDays(new Date(), 11), "yyyy-MM-dd"), content: "Pair programming session on payments integration", tags: ["work"], createdAt: subDays(new Date(), 11) },
  { date: format(subDays(new Date(), 12), "yyyy-MM-dd"), content: "Read 2 articles on distributed systems", tags: ["learning"], createdAt: subDays(new Date(), 12) },
  { date: format(subDays(new Date(), 14), "yyyy-MM-dd"), content: "Journaled and planned next quarter goals", tags: ["personal"], createdAt: subDays(new Date(), 14) },
  { date: format(subDays(new Date(), 15), "yyyy-MM-dd"), content: "Deployed v2.0 of the product", tags: ["work"], createdAt: subDays(new Date(), 15) },
  { date: format(subDays(new Date(), 16), "yyyy-MM-dd"), content: "Morning swim + cold shower", tags: ["health"], createdAt: subDays(new Date(), 16) },
  { date: format(subDays(new Date(), 17), "yyyy-MM-dd"), content: "Attended a tech meetup downtown", tags: ["learning", "personal"], createdAt: subDays(new Date(), 17) },
  { date: format(subDays(new Date(), 18), "yyyy-MM-dd"), content: "Code review marathon — 8 PRs", tags: ["work"], createdAt: subDays(new Date(), 18) },
  { date: format(subDays(new Date(), 20), "yyyy-MM-dd"), content: "Built a CLI tool for batch processing", tags: ["work", "learning"], createdAt: subDays(new Date(), 20) },
  { date: format(subDays(new Date(), 21), "yyyy-MM-dd"), content: "Hiked a new trail — 12km", tags: ["health", "personal"], createdAt: subDays(new Date(), 21) },
];

export function getEntries(): Entry[] {
  return sampleEntries.map((e, i) => ({ ...e, id: `entry-${i}` }));
}

export function getStreakData(): StreakData {
  return { current: 7, longest: 21, totalDays: 47, weeklyScore: 86 };
}

export function getCalendarDays(year: number, month: number, entries: any[] = []): DayStatus[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start, end });
  const entryDates = new Set(entries.map(e => e.date));
  const today = format(new Date(), "yyyy-MM-dd");

  return days.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    if (dateStr > today) return { date: dateStr, status: "future" };
    if (dateStr === today) return { date: dateStr, status: entryDates.has(dateStr) ? "success" : "today" };
    return { date: dateStr, status: entryDates.has(dateStr) ? "success" : "missed" };
  });
}

export function getBadges(): Badge[] {
  return [
    { id: "1", name: "First Step", emoji: "👣", description: "Logged your first day", earned: true, earnedDate: "2024-12-01" },
    { id: "2", name: "Week Warrior", emoji: "⚡", description: "7-day streak", earned: true, earnedDate: "2024-12-08" },
    { id: "3", name: "Unstoppable", emoji: "🔥", description: "21-day streak", earned: true, earnedDate: "2024-12-22" },
    { id: "4", name: "Monthly Master", emoji: "👑", description: "30-day streak", earned: false },
    { id: "5", name: "Centurion", emoji: "💎", description: "100-day streak", earned: false },
    { id: "6", name: "Comeback Kid", emoji: "🦅", description: "Restarted after a miss", earned: true, earnedDate: "2025-01-05" },
  ];
}

export function getAISuggestions(): string[] {
  return [
    "Write 3 bullet points about what you learned today",
    "Do a 10-minute desk stretch routine",
    "Send a thank-you message to a colleague",
    "Read one article on a topic you're curious about",
    "Organize your workspace for 5 minutes",
  ];
}

export function getWeeklySummary(): string {
  return "You focused mostly on **work** this week (4 entries), with consistent **health** activity. Your learning entries peaked mid-week. Consider adding more personal time on weekends.";
}

export function getPatternInsight(): string {
  return "You tend to skip Sundays — try setting a lighter goal for weekends. Work entries dominate your log (52%), followed by learning (26%).";
}

export const tagColors: Record<Tag, string> = {
  work: "bg-blue-500/20 text-blue-400",
  health: "bg-emerald-500/20 text-emerald-400",
  learning: "bg-purple-500/20 text-purple-400",
  personal: "bg-amber-500/20 text-amber-400",
};

export const tagEmojis: Record<Tag, string> = {
  work: "💼",
  health: "💪",
  learning: "📚",
  personal: "🏡",
};
