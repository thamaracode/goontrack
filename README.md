# 🟣 GOONTRACK — Playful Personal Habit Arcade

> **A private personal habit/session tracker disguised as a playful arcade-style statistics app.**
> *Duolingo × fitness tracker × arcade game × weird personal statistics dashboard.* 🎨

---

## 🎮 Concept & Design

* **Playful Brutalism + Soft Gradients**: Dark purple base (`#100B1F`) with thick rounded borders, 3D chunky drop shadows, and vibrant pop colors (`#8B5CF6`, `#F472B6`, `#FACC15`, `#22D3EE`, `#34D399`).
* **Animated Vector Mascot (Blobby)**: Handcrafted inline SVG character whose expressions dynamically morph based on stats & streaks (`😐`, `🙂`, `😎`, `🔥`, `🤯`, `🫠`, `💀`).
* **Mobile-First WebView / PWA**: `100dvh`, bottom navigation tabs (🏠 Home, 📊 Stats, 🏆 Awards, 📈 History, ⚙️ Settings) on mobile + sidebar on desktop.
* **100% Offline Vector Artwork**: Zero external images or CDN dependencies.

---

## 📱 Features

1. **🏠 Home**:
   - Animated vector mascot with speech quotes
   - `12 DAYS STREAK 🔥` hero counter
   - Today's quick badges (`⏱️ 42m`, `⚡ 2 sessions`)
   - 3 Chunky cards (Streak, This Month, Total Time)
   - `[ ＋ LOG SESSION ]`, `[ ⚡ QUICK +15m ]`, `[ ⏱️ IN THE ZONE ]`
2. **📊 Stats**:
   - Chunky vector weekly bar chart (Mon - Sun)
   - 6 Key metrics (sessions, total duration, avg duration, longest session, active day, peak hour)
   - 20-week vector tile calendar heatmap
3. **🏆 Awards**:
   - Handcrafted vector achievement badges (First Blood, 7 Days, Night Owl, Century 100, Marathon, Consistent 30, Chaos & Melt, Hyperdrive)
4. **📈 History**:
   - Chronological timeline grouped by Today / Yesterday / Date with mood badges (`😐 🙂 😈 🫠 💀`) and quick deletion
5. **⚙️ Settings**:
   - 100% Local-first storage, procedural Web Audio arcade sound toggle, JSON export/import, demo seeding, and factory reset

---

## 🚀 How to Run

### Development Server
```bash
npm run dev
```
Open `http://localhost:3001` (or `http://localhost:3000`).

### Zero-Dependency Standalone Preview
Double click `standalone_preview.html` in any browser.
