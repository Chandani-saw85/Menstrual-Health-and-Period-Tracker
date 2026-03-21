import { addDays, subDays, differenceInDays, format } from "date-fns";

export interface CycleEntry {
  id: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
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

export interface Reminder {
  id: string;
  type: "period" | "medicine" | "exercise";
  message: string;
  date: string;
}

export const MOODS = [
  { emoji: "😊", label: "Happy", color: "#FFD93D" },
  { emoji: "😌", label: "Calm", color: "#6BCB77" },
  { emoji: "😢", label: "Sad", color: "#4D96FF" },
  { emoji: "😤", label: "Angry", color: "#FF6B6B" },
  { emoji: "😴", label: "Tired", color: "#C084FC" },
  { emoji: "🤢", label: "Nauseous", color: "#86EFAC" },
  { emoji: "😰", label: "Anxious", color: "#FB923C" },
  { emoji: "🥰", label: "Loved", color: "#F472B6" },
  { emoji: "💪", label: "Strong", color: "#34D399" },
  { emoji: "😵‍💫", label: "Dizzy", color: "#A78BFA" },
  { emoji: "🤗", label: "Grateful", color: "#FBBF24" },
  { emoji: "😔", label: "Low", color: "#94A3B8" },
];

export const SYMPTOMS = [
  "Cramps", "Headache", "Bloating", "Back pain", "Fatigue",
  "Breast tenderness", "Acne", "Nausea", "Cravings", "Insomnia",
];

export function predictNextPeriod(cycles: CycleEntry[]): Date | null {
  if (cycles.length === 0) return null;
  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  if (cycles.length >= 2) {
    const gaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      gaps.push(differenceInDays(sorted[i].startDate, sorted[i + 1].startDate));
    }
    const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    return addDays(sorted[0].startDate, avg);
  }
  return addDays(sorted[0].startDate, 28);
}

export function getCyclePhase(cycles: CycleEntry[]) {
  if (cycles.length === 0) return { phase: "Unknown", day: 0, description: "Start logging to see your cycle phase!", icon: "🌸" };
  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const d = differenceInDays(new Date(), sorted[0].startDate);
  if (d < 0) return { phase: "Pre-Period", day: 0, description: "Getting ready...", icon: "🌙" };
  if (d <= 5) return { phase: "Menstrual", day: d + 1, description: "Rest & recharge. Be gentle with yourself 💕", icon: "🩸" };
  if (d <= 13) return { phase: "Follicular", day: d + 1, description: "Energy rising! Perfect for new beginnings ✨", icon: "🌱" };
  if (d <= 16) return { phase: "Ovulation", day: d + 1, description: "Peak energy & glow! You're radiant 🌟", icon: "🌸" };
  return { phase: "Luteal", day: d + 1, description: "Wind down, self-care time 🧘‍♀️", icon: "🌙" };
}

export function getSyncScore(cycles: CycleEntry[]): number {
  if (cycles.length < 3) return 0;
  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const gaps = [];
  for (let i = 0; i < sorted.length - 1; i++) gaps.push(differenceInDays(sorted[i].startDate, sorted[i + 1].startDate));
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const std = Math.sqrt(gaps.reduce((s, g) => s + (g - avg) ** 2, 0) / gaps.length);
  return Math.max(0, Math.min(100, Math.round(100 - std * 10)));
}

export const DIET_TIPS = [
  { phase: "Menstrual", icon: "🥗", tips: ["Iron-rich foods: spinach, lentils, red meat", "Dark chocolate (yes, really!)", "Warm soups and herbal teas", "Bananas for potassium", "Avoid excess salt & caffeine"], color: "pink" },
  { phase: "Follicular", icon: "🥑", tips: ["Light, fresh foods: salads & smoothies", "Fermented foods for gut health", "Lean proteins: chicken, fish, tofu", "Sprouted grains & seeds", "Citrus fruits for Vitamin C"], color: "mint" },
  { phase: "Ovulation", icon: "🍓", tips: ["Anti-inflammatory foods: berries, turmeric", "Fiber-rich veggies: broccoli, kale", "Healthy fats: avocado, nuts", "Stay hydrated!", "Light meals, avoid heavy foods"], color: "peach" },
  { phase: "Luteal", icon: "🍠", tips: ["Complex carbs: sweet potato, quinoa", "Magnesium-rich: dark chocolate, almonds", "B-vitamin foods: eggs, whole grains", "Chamomile or peppermint tea", "Calcium-rich foods: yogurt, cheese"], color: "purple" },
];

export const EXERCISE_TIPS = [
  { phase: "Menstrual", icon: "🧘‍♀️", exercises: ["Gentle yoga & stretching", "Light walking (15-20 mins)", "Deep breathing exercises", "Restorative poses"], color: "pink" },
  { phase: "Follicular", icon: "🏃‍♀️", exercises: ["Cardio: running, dancing, cycling", "Strength training", "HIIT workouts", "Try something new!"], color: "mint" },
  { phase: "Ovulation", icon: "💃", exercises: ["High-intensity training", "Group fitness classes", "Swimming or dance", "Push your limits!"], color: "sunflower" },
  { phase: "Luteal", icon: "🚶‍♀️", exercises: ["Pilates & light yoga", "Nature walks", "Gentle swimming", "Foam rolling & stretching"], color: "purple" },
];

export const MEDICINE_INFO = [
  { name: "Ibuprofen", desc: "Anti-inflammatory for cramps & pain", icon: "💊", safe: true },
  { name: "Paracetamol", desc: "For mild pain & headaches", icon: "💊", safe: true },
  { name: "Iron Supplements", desc: "If you experience heavy bleeding", icon: "🩸", safe: true },
  { name: "Magnesium", desc: "Helps with cramps & mood swings", icon: "✨", safe: true },
  { name: "Evening Primrose Oil", desc: "May help with breast tenderness", icon: "🌸", safe: true },
  { name: "Ginger Tea", desc: "Natural remedy for nausea & cramps", icon: "🍵", safe: true },
];

export const SUPPORT_MESSAGES = [
  "You are strong, beautiful, and capable of handling anything! 💪🌸",
  "Your body is doing amazing things. Give it the love it deserves! 💕",
  "It's okay to rest. Taking care of yourself is not selfish! 🧘‍♀️",
  "This too shall pass. Better days are coming! 🌈",
  "You're not alone in this. Millions of women experience the same thing! 🤗",
  "Treat yourself today — you deserve it! 🎀",
  "Listen to your body. It knows what it needs! 🌿",
  "Remember: periods are a sign of health and strength! 💪",
];

export function generateSampleData() {
  const today = new Date();
  const cycles: CycleEntry[] = [
    { id: "1", startDate: subDays(today, 112), endDate: subDays(today, 107) },
    { id: "2", startDate: subDays(today, 84), endDate: subDays(today, 79) },
    { id: "3", startDate: subDays(today, 55), endDate: subDays(today, 50) },
    { id: "4", startDate: subDays(today, 27), endDate: subDays(today, 22) },
  ];
  const moods: MoodEntry[] = Array.from({ length: 14 }, (_, i) => {
    const m = MOODS[Math.floor(Math.random() * MOODS.length)];
    return { id: String(i), date: format(subDays(today, 13 - i), "yyyy-MM-dd"), mood: m.emoji, label: m.label };
  });
  const journals: JournalEntry[] = [
    { id: "1", date: format(subDays(today, 1), "yyyy-MM-dd"), content: "Feeling good today! Had a nice walk in the park and drank lots of water. 🌿" },
    { id: "2", date: format(subDays(today, 4), "yyyy-MM-dd"), content: "Some cramps today but yoga really helped. Grateful for self-care routines. 🧘‍♀️" },
    { id: "3", date: format(subDays(today, 8), "yyyy-MM-dd"), content: "High energy! Went for a run and felt amazing afterwards. 🏃‍♀️" },
  ];
  return { cycles, moods, journals };
}
