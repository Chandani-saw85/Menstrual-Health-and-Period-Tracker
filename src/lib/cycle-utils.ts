import { addDays, differenceInDays, format, isWithinInterval, subDays } from "date-fns";

export interface CycleEntry {
  id: string;
  startDate: Date;
  endDate?: Date;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  label: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export const MOODS = [
  { emoji: "😊", label: "Happy", color: "hsl(45, 90%, 65%)" },
  { emoji: "😌", label: "Calm", color: "hsl(160, 50%, 65%)" },
  { emoji: "😢", label: "Sad", color: "hsl(210, 60%, 65%)" },
  { emoji: "😤", label: "Irritated", color: "hsl(0, 70%, 65%)" },
  { emoji: "😴", label: "Tired", color: "hsl(260, 40%, 70%)" },
  { emoji: "🤢", label: "Nauseous", color: "hsl(90, 40%, 60%)" },
  { emoji: "😰", label: "Anxious", color: "hsl(30, 70%, 65%)" },
  { emoji: "🥰", label: "Loved", color: "hsl(340, 80%, 72%)" },
];

export const CYCLE_LENGTH = 28;
export const PERIOD_LENGTH = 5;

export function predictNextPeriod(cycles: CycleEntry[]): Date | null {
  if (cycles.length === 0) return null;
  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const lastCycle = sorted[0];

  if (cycles.length >= 2) {
    const gaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      gaps.push(differenceInDays(sorted[i].startDate, sorted[i + 1].startDate));
    }
    const avgLength = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    return addDays(lastCycle.startDate, avgLength);
  }

  return addDays(lastCycle.startDate, CYCLE_LENGTH);
}

export function getCyclePhase(cycles: CycleEntry[]): { phase: string; day: number; description: string } {
  if (cycles.length === 0) return { phase: "No Data", day: 0, description: "Log your first cycle to get started" };

  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const lastStart = sorted[0].startDate;
  const daysSince = differenceInDays(new Date(), lastStart);

  if (daysSince < 0) return { phase: "Pre-Period", day: 0, description: "Your period hasn't started yet" };
  if (daysSince <= 5) return { phase: "Menstrual", day: daysSince + 1, description: "Take it easy and stay hydrated 💧" };
  if (daysSince <= 13) return { phase: "Follicular", day: daysSince + 1, description: "Energy rising! Great time for new projects ✨" };
  if (daysSince <= 16) return { phase: "Ovulation", day: daysSince + 1, description: "Peak energy and confidence 🌟" };
  return { phase: "Luteal", day: daysSince + 1, description: "Wind down and practice self-care 🌙" };
}

export function getCycleSyncScore(cycles: CycleEntry[]): number {
  if (cycles.length < 3) return 0;
  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const gaps = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    gaps.push(differenceInDays(sorted[i].startDate, sorted[i + 1].startDate));
  }
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avg, 2), 0) / gaps.length;
  const std = Math.sqrt(variance);
  const score = Math.max(0, Math.min(100, Math.round(100 - std * 10)));
  return score;
}

export function getDailyInsight(cycles: CycleEntry[]): string {
  const { phase } = getCyclePhase(cycles);
  const insights: Record<string, string[]> = {
    "Menstrual": [
      "Iron-rich foods like spinach and lentils can help replenish your body.",
      "Gentle yoga or stretching can ease cramps naturally.",
      "Warm compresses on your lower abdomen can provide relief.",
    ],
    "Follicular": [
      "Your body is primed for high-intensity workouts!",
      "This is a great time to start new creative projects.",
      "Your skin may glow more during this phase — enjoy it!",
    ],
    "Ovulation": [
      "You may feel more social and communicative today.",
      "Peak fertility window — plan accordingly.",
      "Try strength training for maximum results.",
    ],
    "Luteal": [
      "Craving carbs? Complex carbs like oats can help stabilize mood.",
      "Prioritize sleep — your body needs extra rest.",
      "Magnesium-rich foods can help reduce PMS symptoms.",
    ],
  };
  const phaseInsights = insights[phase] || ["Log your cycle to get personalized insights!"];
  return phaseInsights[Math.floor(Math.random() * phaseInsights.length)];
}

// Generate sample data
export function generateSampleData() {
  const today = new Date();
  const cycles: CycleEntry[] = [
    { id: "1", startDate: subDays(today, 84), endDate: subDays(today, 79) },
    { id: "2", startDate: subDays(today, 56), endDate: subDays(today, 51) },
    { id: "3", startDate: subDays(today, 27), endDate: subDays(today, 22) },
  ];

  const moods: MoodEntry[] = Array.from({ length: 14 }, (_, i) => {
    const moodIndex = Math.floor(Math.random() * MOODS.length);
    return {
      id: String(i),
      date: format(subDays(today, 13 - i), "yyyy-MM-dd"),
      mood: MOODS[moodIndex].emoji,
      label: MOODS[moodIndex].label,
    };
  });

  const journals: JournalEntry[] = [
    { id: "1", date: format(subDays(today, 2), "yyyy-MM-dd"), content: "Feeling more energetic today. Went for a long walk and practiced some mindfulness." },
    { id: "2", date: format(subDays(today, 5), "yyyy-MM-dd"), content: "Had some cramps but a warm bath helped a lot. Need to remember to drink more water." },
  ];

  return { cycles, moods, journals };
}
