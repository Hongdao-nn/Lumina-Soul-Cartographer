# Lumina: The Soul Cartographer

Lumina is a premium, highly interactive web application designed to map and decipher the user's metaphysical placements. Combining precise astrological coordinate engines, interactive 3D constellation systems, Web Audio synthesizers, and real-time AI agent counseling, Lumina operates as an advanced holographic cockpit for self-discovery and soul navigation.

Developed as a capstone project for the Google 5-Day AI Agents: Intensive Vibe Coding Course.

---

## Core Capabilities

### 1. Astrological Placements Engine
- Calibrates sidereal mappings based on geographical coordinates, local time, and date parameters.
- Employs an exact mathematical model to extract Sun, Moon, Ascendant, Mars, and Saturn placements.
- Features case-insensitive search matching and fallback defaults for over 38 global and Vietnamese cities, ensuring smooth, error-free map generation.

### 2. Holographic Constellation Labyrinth
- Interactive 3D SVG chòm sao map that responds dynamically to mouse pointer positioning using parallax tilt transforms.
- Built-in slow-rotating coordinate radar grid (120s linear loop) that creates a deep, retro-futuristic navigation feel.
- Dynamic energy laser lines flowing between nodes: locked paths display slow, faint pulses (16s cycle), while decrypted paths accelerate into fast, glowing, shadow-cast laser runs (3.5s cycle).

### 3. Sphinx Decryption Console
- Restricts access to vital placements (Sun, Moon, Ascendant, etc.) under specific semantic riddles.
- Conducts real-time semantic alignment checks on user reflections to unlock coordinate links.
- Instantly active on load to ensure high engagement and immediate interactivity.

### 4. Healer Chat Sanctuary
- Empathetic AI counseling journal tailored to active planetary transits.
- Integrates a real-time sentiment scoring widget that reflects the user's emotional, logical, and intuitive alignment based on conversations.

### 5. Tarot Sanctuary & Oracle Synthesis
- Duplicate-free Fisher-Yates shuffle engine drawing from the 22 Major Arcana cards.
- Solves 3D hover-to-flip styling race conditions using synchronous state guards (refs), locking flipped cards flat on the table while keeping hover actions active on dealt cards.
- Direct Gemini oracle synthesis interpreting the past, present, and future trajectory of love, career, or spiritual paths.

### 6. Cosmic Conclave Debate Portal
- Convenes a celestial council of detuned AI personalities to debate deep philosophical prompts.
- Employs a detuned dual-oscillator (sawtooth and triangle waves) through a low-pass filter to generate atmospheric background sound pads.

### 7. Secure Personal Sanctum & Archive
- LocalStorage-backed authentication system allowing users to sign up, log in, and secure their profiles.
- Integrated Gemini API Key management, letting users paste and encrypt their API keys locally for private requests.
- Sacred Archive panel to log, review, and reload archived Natal charts, Conclave debates, and Tarot spreads.

---

## Ambient Sound & Particle Engineering

- **Dual-Canvas System**: Uses a background canvas for a swirling galaxy particle storm and an independent top-level transparent canvas (zIndex 99999) to render sharp, unblurred, multi-colored cursor stardust trails.
- **Synthesized Audio Feedback**: Injects an AudioContext chime sequence when clicking anywhere on the screen, delivering a satisfying, low-volume arpeggiated chime feedback.
- **Mix-Blend-Mode Screen Nebulas**: Employs multiple floating, highly blurred background nebula divs with screen blend modes and 0.55 opacity, blending cyan, magenta, violet, and gold into luminous cosmic clouds.

---

## Technical Stack

- **Framework**: React 19, Vite 8 (ES Module structure).
- **Styling**: Vanilla CSS utilizing dark-mode glassmorphic design tokens and hardware-accelerated animations.
- **Icons**: Lucide React.
- **Synthesizer**: Web Audio API (oscillators, gains, bi-quad filters).
- **Verification**: Built and validated with Oxlint (0 errors, 0 warnings).

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
1. Clone the repository to your local workspace:
   ```bash
   git clone <repository-url>
   cd nomoredream
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your web browser.

4. Verify formatting and compile safety:
   ```bash
   npm run lint
   ```

5. Build the production application bundle:
   ```bash
   npm run build
   ```
   Deploy the generated `dist/` directory contents to Vercel, Netlify, or Github Pages.
