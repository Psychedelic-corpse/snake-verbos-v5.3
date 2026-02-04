# Con-Jugando Verbos en Español (v5.5)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🎯 About

**Con-Jugando Verbos** is an interactive educational Progressive Web App (PWA) designed to make Spanish verb conjugation practice engaging and fun for students. The name is a clever wordplay combining "con" (with), "jugando" (playing), and "conjugating" verbs!

The game features two memorable characters—**Linda** (Petrol Blue theme) and **Leus** (Pink theme)—who guide players through a serpentine board game where each tile represents a Spanish verb waiting to be conjugated.

---

## ✨ Key Features

### 🐍 **Snake Board Logic**
- **10×6 Grid Layout**: 60 tiles representing different Spanish verbs
- **S-Curve Pathing**: The board follows an intuitive serpentine pattern:
  - Row 1: Left to Right
  - Row 2: Right to Left
  - And so on, creating natural gameplay flow
- **Visual Indicators**: Player positions marked with color-coded dots (Cyan for Linda, Pink for Leus)

### 🎲 **Smart Learning Engine**
- **Intelligent Collision Detection**: If players land on the same tile, the system automatically assigns a **new tense** to avoid repetitive practice
- **8 Tense Variations**:
  - Presente
  - Futuro (Perífrasis)
  - Pretérito Perfecto Compuesto
  - Imperativo
  - Futuro Simple
  - Condicional
  - Gerundio
  - Pretérito Indefinido
- **Adaptive Difficulty**: The game tracks which verb-tense combinations have been practiced and encourages variety

### 📱 **Native PWA Experience**
- **iOS Optimization**:
  - Full-screen mode (no browser chrome)
  - Black translucent status bar
  - Prevents unwanted zoom on input focus
  - Native "Save to Notes" sharing via `navigator.share()`
- **Android Support**:
  - Clipboard copy functionality
  - Toast notifications for feedback
  - Full mobile optimization
- **Offline Capable**: Game data persists locally

### 👤 **Character System**
- **Linda** (Petrol Blue theme):
  - Primary character
  - Cool, composed personality
  - Cyan-based color palette (cyan-600 to cyan-950)
  
- **Leus** (Pink theme):
  - Secondary character (two-player mode)
  - Energetic, fun personality
  - Rose/Pink-based color palette (rose-500 to rose-950)

### 🌙 **Day/Night Modes**
- **Light Mode**: Bright indigo-to-cyan gradient background, optimal for classroom projectors
- **Dark Mode**: Slate-based palette with reduced eye strain, perfect for student personal devices
- **Persistent Preference**: Theme selection saved across sessions

### 📤 **Class Report Integration**
- **End-Game Summary**: Shows all conjugations practiced by each player
- **Native Sharing** (iOS):
  - Tap "📤 Compartir / Guardar Nota" to save report to Apple Notes
  - Perfect for students to email reports to teachers
- **Copy to Clipboard** (Android/Desktop):
  - Tap "📋 Copiar Texto" to copy report text
  - Includes success toast notification
- **Pre-formatted Export**: Reports include player names, verbs, tenses, and celebration emoji

### 🎮 **Game Modes**
- **1 Jugador (Single Player)**: Solo practice against the clock
- **2 Jugadores (Dual Player)**: Competitive gameplay with collision detection
- **Undo Function**: Revert last move (back one tile)
- **Hard Reset**: Return to main menu at any time

### 📖 **Comprehensive Game Guide**
- **Built-in "Cómo Jugar" Modal**:
  - Objective explanation
  - Turn mechanics
  - Smart learning system breakdown
  - Class report information
  - Pro tips (theme toggle, undo, menu navigation)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.1.6 | React framework with App Router |
| **React** | 18.3.1 | UI library |
| **Vite** | 6.4.1 | Build tool & dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | 11.0.8 | Smooth animations & transitions |
| **Lucide React** | 0.344.0 | Icon library |
| **Canvas Confetti** | 1.9.4 | Celebration effects |
| **TypeScript** | 5.8.2 | Type-safe development |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Psychedelic-corpse/snake-verbos-v5.3.git
cd snake-verbos-v5.3

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will auto-reload as you edit files.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
snake-verbos-v5.3/
├── app/
│   ├── layout.tsx          # Root layout with PWA metadata
│   └── page.tsx            # Main game component (958 lines)
├── public/
│   └── icon.png            # PWA icon (192x192 recommended)
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment config
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # This file
```

### Key Files

**`app/page.tsx`** (958 lines)
- Main game logic and all UI components
- Components: RulesModal, ReportModal, MainMenu, GameBoard, DiceAnimation, ConjugationCard, SummaryScreen
- Game state management with React hooks
- Smart collision detection algorithm
- Native API integrations (navigator.share, navigator.clipboard)

**`app/layout.tsx`**
- PWA metadata configuration
- Favicon and iOS home screen icon setup
- Viewport settings (no zoom, full screen)
- Theme color declaration

---

## 🎮 How to Play

### Single Player Mode
1. Click **"1 Jugador"** from the main menu
2. Choose character (Linda - Cyan or Leus - Pink)
3. Press **"🎲 Lanzar Dado"** (Roll Dice) to move
4. Conjugate the verb shown in the card for the selected tense
5. Reach **"LLEGADA"** (tile 60) to win
6. View your summary and generate a class report

### Two Player Mode
1. Click **"2 Jugadores"** from the main menu
2. Players alternate turns
3. If both players land on the same tile, a new tense is automatically assigned
4. First to reach "LLEGADA" wins
5. Both players' histories appear in the final report

### Tips
- Use **📖 Cómo Jugar** button for comprehensive game guide
- Toggle **🌙/☀️** for dark mode (easier on eyes)
- Press **↩️** to undo your last move
- Click **🏠** to return to main menu

---

## 🌐 Progressive Web App Features

### Install as App
- **iOS**: Tap Share → Add to Home Screen
- **Android**: Menu → Install app
- **Desktop**: Browser menu → Install (Chrome/Edge)

### Offline Support
- Game data persists locally using browser storage
- Works without internet connection once loaded

### Native Capabilities
- Full-screen immersive experience
- Offline functionality
- Home screen icon
- Splash screen on launch

---

## 📊 Educational Value

Perfect for:
- **Spanish Language Classes**: A1-B2 proficiency levels
- **Classroom Engagement**: Interactive, competitive gameplay
- **Homework & Practice**: Students can practice at home
- **Assessment**: Teachers can review student progress reports
- **Vocabulary Building**: 60 essential Spanish verbs included

### Verbs Included
SALIDA, Abrir, Salir, Desayunar, Volver, Preferir, Llegar, Poder, Empezar, Ir, Pedir, Llamarse, Probar, Jugar, Leer, Seguir, Almorzar, Vestirse, Hacer, Poner, Acostarse, Vivir, Hablar, Pensar, Levantarse, Tener, Poder, Cerrar, Ser, Tomar, Estar, Dormir, Entender, Mirar, Ver, Coger, Acabar, Soler, Despertarse, Poner, Venir, Oler, Saber, Querer, Valer, Suponer, Creer, Tener, Traducir, Correr, Conducir, Gastar, Irse, Pensar, Nadar, Parecer, Bañarse, Pagar, Casarse, LLEGADA

---

## 🚀 Deployment

### Deploy to Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Psychedelic-corpse/snake-verbos-v5.3)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deployment Configuration
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

---

## 🔧 Development

### Available Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Create production bundle
npm run preview  # Preview production build locally
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting (configured in vercel.json)
- **Tailwind CSS**: Utility-first, responsive design

---

## 📱 Browser Support

| Browser | Minimum Version | Support |
|---------|-----------------|---------|
| Chrome | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Samsung Internet | 14+ | ✅ Full |

---

## 🐛 Troubleshooting

### Icon not displaying on iOS home screen
- Ensure `public/icon.png` exists (192x192 recommended)
- Clear browser cache and try again
- Reinstall the app to home screen

### Game not saving progress
- Check browser storage is enabled
- Ensure JavaScript is enabled
- Clear cache and reload

### Sharing not working
- iOS: Make sure to use Safari or in-app browsers with share support
- Android: Check clipboard permissions are granted

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📞 Contact & Support

- **GitHub Repository**: [Psychedelic-corpse/snake-verbos-v5.3](https://github.com/Psychedelic-corpse/snake-verbos-v5.3)
- **Issues**: [Report a bug](https://github.com/Psychedelic-corpse/snake-verbos-v5.3/issues)
- **Live Demo**: [snake-verbos-v5.3.vercel.app](https://snake-verbos-v5.3.vercel.app)

---

## 🎉 Version History

| Version | Date | Changes |
|---------|------|---------|
| v5.5 | Feb 4, 2026 | Report Modal with native iOS/Android sharing |
| v5.4 | Feb 3, 2026 | Added comprehensive Rules Modal |
| v5.3 | Feb 2, 2026 | Initial release with Vite + PWA setup |

---

**Built with ❤️ for Spanish learners everywhere.**
