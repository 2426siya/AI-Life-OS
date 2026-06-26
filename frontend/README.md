# 🌌 Nexus AI — Intelligent AI Operations Platform

Nexus AI is a state-of-the-art, high-performance landing page for a modern AI-powered operations and analytics platform. Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Framer Motion, it features interactive elements, sleek dark-mode aesthetics, and modern glassmorphism design.

---

## ✨ Features
* **Interactive Mouse-Glow Effects**: Dynamic background radial gradient following the user's cursor.
* **Modern Gradients & Grid Backgrounds**: Sleek dark UI matching modern SaaS design patterns.
* **Intelligent Animations**: Micro-interactions, smooth hover transitions, and viewport-triggered animations powered by Framer Motion.
* **Core Landing Sections**:
  * **Navbar**: Responsive glassmorphic navigation header.
  * **Hero**: Clear value proposition with interactive dashboard forecasting previews.
  * **Features**: Highlights Fast Performance, Modern UI, and Security.
  * **Workflow**: Shows how raw data is collected, processed, and visualized.
  * **Pricing**: Clean interactive subscription tier cards.
  * **FAQ**: Accordion styled frequently asked questions.
  * **Footer**: Full site mapping and copyright indicators.

---

## 🛠️ Technology Stack
* **Frontend Library**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vite.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` compiler)
* **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have Node.js installed (version 18+ recommended) and npm.

### 2. Install Dependencies
Clone the repository, navigate into the directory, and install the package dependencies:
```bash
npm install
```

### 3. Start Development Server
Run the local Vite dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
Compile TypeScript and bundle the frontend into the static production-ready `dist/` directory:
```bash
npm run build
```

---

## 📁 Project Structure
```text
frontend/
├── dist/                # Production build output
├── public/              # Static public assets (favicons, etc.)
├── src/
│   ├── assets/          # Project assets (images, icons)
│   ├── components/      # UI Components (Hero, Navbar, Features, Pricing, etc.)
│   ├── App.tsx          # Main App Component (Glow background, layout grid)
│   ├── main.tsx         # App entry point
│   └── index.css        # Tailwind CSS imports & global styles
├── package.json         # Dependency configuration
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # SPA routing configuration for Vercel
└── vite.config.ts       # Vite build configurations with relative base pathing
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
