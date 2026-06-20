# Menstrual Health and Period Tracker

A comprehensive and user-friendly web application designed to help females track their menstrual cycles, predict upcoming periods, and monitor health symptoms with privacy and ease.

# 🌸 Menstrual Health and Period Tracker

An intuitive, aesthetically pleasing, and privacy-focused web application designed to help individuals track their menstrual cycles, understand their body phases, log daily moods, and maintain a personal health journal.

---

# 🚀 Features & Functionality

# 1. User Authentication & Greeting
* **Personalized Greeting:** Welcomes the logged-in user dynamically based on the time of day (e.g., *“Hello, chandani! 🌙 Wind down, self-care time 🧘‍♀️”*).

* **Session Control:** Features a high-visibility **Logout** button in the header navigation to securely end the active user session.

### 2. Live Cycle Phase Analytics
* **PHASE Card:** Tracks the user's current cycle stage in real-time (e.g., **Luteal Phase**) and calculates the exact day of the current cycle (e.g., **Day 28**).
* **NEXT PERIOD Card:** Provides a predictive countdown to the next anticipated period date (e.g., **Jun 21 / In 1 days**).
* **SYNC Gauge:** Displays a visual circular metric showing a percentage score of cycle consistency and predictability (e.g., **95% SYNC - Very regular! 🎯**).

### 3. Recent Mood Tracker
* **Weekly Glance Log:** Maps out emotional data and physical states from Sunday to Saturday using expressive emojis:
  * 😤 *Stressed / Irritated*
  * 🤢 *Nauseous / Unwell*
  * 😌 *Calm / Relaxed*
  * 💪 *Energetic / Strong*
  * 😵‍💫 *Overwhelmed / Dizzy*

### 4. Interactive Cycle Calendar
* **Monthly Overview Grid:** A structured calendar mapping the current month (e.g., **June 2026**) complete with historical mood emojis pinned to logged days.
* **Predictive Indicators:** Automatically maps future cycles with a crystal ball icon (`🔮`) to mark predicted period days ahead of time.
* **Proactive Smart Alerts:** Features an active reminder banner below the grid to prompt timely action (e.g., *“🔔 Period in 1 day! Stock up and prepare 💕”*).

---

## 🛠️ Main Navigation & Modules

The header contains dedicated options to route between core aspects of the system:

| Option | Functional Purpose |
| :--- | :--- |
| **🏠 Dashboard** | The main control center containing cycle cards, mood logs, and the calendar overview. |
| **🩺 Health Hub** | Educational space offering insights, symptoms breakdowns, and phase-specific advice. |
| **💖 Mood & Support** | Deep dive into emotional trends, cyclical patterns, and specialized care recommendations. |
| **✍️ Journal** | A private digital diary to record physical symptoms, reflections, and notes. |
| **🔔 Reminders** | Configuration hub for customizing notifications, medication times, or phase alerts. |

---

## 📝 User Actions & Usage Flow

### Logging a Period
1. Open the primary **Dashboard**.
2. Click the prominent pink **`+ Log Period`** button situated right below the top header.
3. Use the interface to submit current cycle dates, instantly recalculating the calendar grid, prediction windows, and regularity score.

### Changing Calendar Views
* Use the left (`<`) and right (`>`) arrow controls located directly next to the month label (e.g., **June 2026**) on the calendar component to navigate between previous months and future projections.
## 🛠️ Tech Stack
* **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
* **Deployment**: Vercel

## 📖 How to Run
1. Clone the repo: `git clone https://github.com/Chandani-saw85/menstrual-health-and-period-tracker.git`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
