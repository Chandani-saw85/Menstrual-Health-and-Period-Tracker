/**
 * Local Database Service
 * Handles all data persistence using localStorage.
 * In production, replace with Supabase/API calls.
 */

import { CycleEntry, MoodEntry, JournalEntry, Reminder } from "./cycle-utils";
import { format, subDays } from "date-fns";

const KEYS = {
  CYCLES: "pt_cycles",
  MOODS: "pt_moods",
  JOURNALS: "pt_journals",
  REMINDERS: "pt_reminders",
  SYMPTOMS: "pt_symptoms",
  USER_PREFS: "pt_user_prefs",
} as const;

export interface SymptomEntry {
  id: string;
  date: string;
  symptoms: string[];
}

export interface UserPrefs {
  name: string;
  cycleLength: number;
  periodLength: number;
}

// ─── Helpers ────────────────────────────────────────────────

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Cycles ─────────────────────────────────────────────────

export function getCycles(): CycleEntry[] {
  const raw = get<any[]>(KEYS.CYCLES, []);
  return raw.map((c) => ({
    ...c,
    startDate: new Date(c.startDate),
    endDate: c.endDate ? new Date(c.endDate) : undefined,
  }));
}

export function saveCycle(entry: CycleEntry) {
  const cycles = getCycles();
  cycles.push(entry);
  set(KEYS.CYCLES, cycles);
}

export function deleteCycle(id: string) {
  set(KEYS.CYCLES, getCycles().filter((c) => c.id !== id));
}

// ─── Moods ──────────────────────────────────────────────────

export function getMoods(): MoodEntry[] {
  return get<MoodEntry[]>(KEYS.MOODS, []);
}

export function saveMood(entry: MoodEntry) {
  const moods = getMoods().filter((m) => m.date !== entry.date);
  moods.push(entry);
  set(KEYS.MOODS, moods);
}

export function deleteMood(date: string) {
  set(KEYS.MOODS, getMoods().filter((m) => m.date !== date));
}

// ─── Symptoms ───────────────────────────────────────────────

export function getSymptoms(): SymptomEntry[] {
  return get<SymptomEntry[]>(KEYS.SYMPTOMS, []);
}

export function saveSymptoms(entry: SymptomEntry) {
  const symptoms = getSymptoms().filter((s) => s.date !== entry.date);
  symptoms.push(entry);
  set(KEYS.SYMPTOMS, symptoms);
}

// ─── Journal ────────────────────────────────────────────────

export function getJournals(): JournalEntry[] {
  return get<JournalEntry[]>(KEYS.JOURNALS, []);
}

export function saveJournal(entry: JournalEntry) {
  const journals = getJournals().filter((j) => j.id !== entry.id);
  journals.push(entry);
  set(KEYS.JOURNALS, journals);
}

export function deleteJournal(id: string) {
  set(KEYS.JOURNALS, getJournals().filter((j) => j.id !== id));
}

// ─── Reminders ──────────────────────────────────────────────

export function getReminders(): Reminder[] {
  return get<Reminder[]>(KEYS.REMINDERS, []);
}

export function saveReminder(entry: Reminder) {
  const reminders = getReminders();
  reminders.push(entry);
  set(KEYS.REMINDERS, reminders);
}

export function deleteReminder(id: string) {
  set(KEYS.REMINDERS, getReminders().filter((r) => r.id !== id));
}

// ─── User Preferences ──────────────────────────────────────

export function getUserPrefs(): UserPrefs {
  return get<UserPrefs>(KEYS.USER_PREFS, {
    name: "Friend",
    cycleLength: 28,
    periodLength: 5,
  });
}

export function saveUserPrefs(prefs: UserPrefs) {
  set(KEYS.USER_PREFS, prefs);
}

// ─── Seed Sample Data ───────────────────────────────────────

export function seedSampleData() {
  if (getCycles().length > 0) return; // already seeded

  const today = new Date();
  const MOODS_LIST = ["😊", "😌", "😢", "😤", "😴", "🤢", "😰", "🥰", "💪", "😵‍💫"];
  const LABELS = ["Happy", "Calm", "Sad", "Angry", "Tired", "Nauseous", "Anxious", "Loved", "Strong", "Dizzy"];

  // Sample cycles
  const cycles: CycleEntry[] = [
    { id: "s1", startDate: subDays(today, 112), endDate: subDays(today, 107) },
    { id: "s2", startDate: subDays(today, 84), endDate: subDays(today, 79) },
    { id: "s3", startDate: subDays(today, 55), endDate: subDays(today, 50) },
    { id: "s4", startDate: subDays(today, 27), endDate: subDays(today, 22) },
  ];
  set(KEYS.CYCLES, cycles);

  // Sample moods
  const moods: MoodEntry[] = Array.from({ length: 14 }, (_, i) => {
    const idx = Math.floor(Math.random() * MOODS_LIST.length);
    return {
      id: `sm${i}`,
      date: format(subDays(today, 13 - i), "yyyy-MM-dd"),
      mood: MOODS_LIST[idx],
      label: LABELS[idx],
    };
  });
  set(KEYS.MOODS, moods);

  // Sample journals
  const journals: JournalEntry[] = [
    { id: "sj1", date: format(subDays(today, 1), "yyyy-MM-dd"), content: "Feeling good today! Had a nice walk in the park 🌿" },
    { id: "sj2", date: format(subDays(today, 4), "yyyy-MM-dd"), content: "Some cramps but yoga helped. Grateful for self-care 🧘‍♀️" },
  ];
  set(KEYS.JOURNALS, journals);
}

// ─── Clear All Data ─────────────────────────────────────────

export function clearAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
