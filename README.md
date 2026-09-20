# TRACE — Your Life, Connected
> *"Every moment leaves a trace."*  
> A 100% client-side, zero-backend digital storytelling museum that connects fragmented digital receipts into coherent personal life narratives.

---

## 🌟 Overview

In the modern world, our lives are fragmented across dozens of digital silos: grocery tickets, music streams, transit waybills, UPI payments, and festive purchases. Individually, each record is just a row of data. But when connected, they tell the story of who we were, how we lived, and where we were going.

**TRACE** transforms raw, disparate digital receipt archives into an interactive, evidence-backed narrative museum with:
- **Interactive Relationship Graph**: Force-directed network mapping temporal, contextual, spatial, and habitual connections between records.
- **Evidence-Backed Narrative Chapters**: Strict separation of *Directly Observed Facts* vs. *Analytical Interpretations*.
- **Circadian & Habit Insights**: 24-hour time-of-day clock heatmaps, category volume distributions, and annual lifestyle migrations.
- **Receipt Explorer**: Full search, multi-filter, and sorting engine across hundreds of thousands of receipts with instant pagination.
- **Leave Your Trace**: Personal receipt creation stored 100% locally with private client-side persistence.

---

## 📊 Integrated Datasets

TRACE integrates three real-world datasets client-side without any server dependencies:

| Archive | Records | Time Span | Key Signals & Dimensions |
| :--- | :--- | :--- | :--- |
| **Daily Household Archive** | **2,461 Receipts** | 2015 – 2021 | Morning train commute routines, breakfast tokens, recurring subscriptions, Diwali festival ledgers, cash-to-digital payment migrations. |
| **Audio & Cultural Stream Archive** | **149,860 Streams** | 2013 – 2024 | 11 years of Spotify listening history, desktop web player to smartphone transitions, nocturnal insomnia listening reels, vinyl album sessions. |
| **Urban Transact Archive** | **10,267 Records** | 2023 – 2024 | Multi-city mobility circuits across 40+ transit hubs, wellness and cinema commerce, AI anomaly & risk sentinels (all PII strictly masked). |

---

## 🛡️ Privacy, Security & Data Sanitization

- **100% Client-Side**: No backend servers, no analytics beacons, no cookies.
- **Data Sanitization**: All credit card numbers, personal identifiers, street addresses, and dates of birth are completely masked or excluded.
- **Zero Injections**: Zero instances of `dangerouslySetInnerHTML` or `eval()`.
- **Local Persistence**: User-created personal receipts are saved only in the user's browser `localStorage`.

---

## ⚡ Technical Architecture & Stack

- **Framework**: React 18 (Vite 6)
- **Styling**: Tailwind CSS (Dark-mode editorial museum aesthetic with amber, sage, and lavender accents)
- **Icons**: Lucide React
- **Architecture**:
  - `src/data/`: Modular dataset adapters (`householdAdapter.js`, `spotifyAdapter.js`, `transactionAdapter.js`)
  - `src/engine/`: Pure algorithmic business logic (`relationshipEngine.js`, `chapterAesthetics.js`)
  - `src/components/`: Reusable, accessible UI components with full ARIA dialog specifications and keyboard shortcuts

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/snehp17/TRACE.git
cd TRACE

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
```

---

## ⌨️ Accessibility & Shortcuts

- **Esc**: Close any active receipt inspection drawer or modal.
- **Left / Right Arrows (← / →)**: Navigate between story chapters on the narrative timeline.
- **Tab / Enter**: Full keyboard accessibility across buttons, filters, and interactive cards.

---

## 📜 License

MIT License — Built for the Digital Life Archive & Storytelling Challenge.
