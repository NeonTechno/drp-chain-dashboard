# 🔗 DRP Chain Status Dashboard

A terminal-style, cyberpunk blockchain monitoring dashboard for the **Decentralized Rights Protocol** — tracking live block production, token metrics, node health, and on-chain activity.

![DRP Dashboard](https://img.shields.io/badge/DRP-Testnet-00ff88?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNVYybC0xMCA1TDIgN3YxMHoiLz48L3N2Zz4=)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

- **Live Block Feed** — Simulated block production with hash, validator, tx count, and gas metrics
- **Token Dashboard** — Real-time $RIGHTS (governance) and $DeRi (utility) price + supply tracking
- **Node Health Monitor** — Animated status indicators for validator and relay nodes across Ghana and global peers
- **Mempool Visualizer** — Pending transaction queue with priority levels
- **Proof-of-Status Tracker** — AI-verified activity feed (farmers, students, vendors, innovators)
- **Cyberpunk Terminal UI** — Dark theme with neon green/cyan/magenta accents, scanline effects

## 🚀 Quick Start

```bash
git clone https://github.com/NeonTechno/drp-chain-dashboard.git
cd drp-chain-dashboard
# Open index.html in your browser — no build step needed!
open index.html
```

## 🛠 Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (zero dependencies)
- CSS custom properties for theming
- Web Animations API for smooth transitions
- Designed to connect to a real DRP node RPC endpoint

## 🔌 Connecting to a Real Node

Edit `api-mock.js` and replace `MOCK_MODE = true` with your node's RPC URL:

```js
const NODE_RPC = 'http://your-drp-node:26657';
const MOCK_MODE = false;
```

## 🗺 Roadmap

- [ ] WebSocket live connection to DRP testnet RPC
- [ ] Block explorer drill-down (click block → view transactions)
- [ ] Wallet connect + $DeRi balance lookup
- [ ] AI Elder activity feed (Project Lazarus events)
- [ ] Cross-chain bridge status (Cosmos IBC channels)
- [ ] Deploy to Vercel / Render

## 📁 Project Structure

```
drp-chain-dashboard/
├── index.html        # Main dashboard shell
├── styles.css        # Cyberpunk terminal theme
├── dashboard.js      # UI logic, animations, data binding
├── api-mock.js       # Mock data engine (swap for real RPC)
└── README.md
```

## 🌍 About DRP

The **Decentralized Rights Protocol** is a blockchain-based system using AI and ethical governance to make food, healthcare, education, and basic needs more accessible — validated first in Ghana, with global alignment to UN Sustainable Development Goals.

**Tokens:** `$RIGHTS` (governance) · `$DeRi` (utility)  
**Stack:** Cosmos SDK · C++ core · Claude + Gemini AI · Render hosting

---

*Built by [@NeonTechno](https://github.com/NeonTechno) · Decentralized Rights Protocol*
