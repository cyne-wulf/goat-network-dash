# Atlas Operator Console ✦ Hello GOAT x402

End-to-end Hello GOAT paid request flow with a neon operator cockpit: the dashboard issues the 402 challenge, executes the on-chain payment through viem, persists proofs/logs, and wraps everything in an observability-grade UI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwind-css&logoColor=white)](#)
[![Viem](https://img.shields.io/badge/viem-2.x-1a1a1a)](#)
[![Node](https://img.shields.io/badge/Node.js-20+-43853D?logo=node.js&logoColor=white)](#)

> **Mission brief**  
> Track activations, unlock Hello GOAT via x402, and hand judges a complete proof + audit trail without leaving the console shell.

---

## ✨ Highlights
- **Flashy mission control** – neon hero, animated signal ticker, and glass panels for proofs, readiness, and Hello GOAT actions.
- **x402 autopilot** – 402 challenge → invoice modal → automated pay + retries with explorer links and copyable summaries.
- **Persistent observability** – `data/logs.json` and `data/proofs.json` power a live `/logs` timeline and the Proof of Payment panel.
- **Operator-focused UX** – activation checklist, status cards, and nav slices for Onboarding, Identity, Payments, Transactions, Webhooks, and Settings.

---

## 🌐 Deployments
- **Primary** – run locally or on any Node host via `npm run dev` / `npm run start` to keep API routes and payment proofs fully functional.
- **GitHub Pages preview** – automatic build from `main` lives at [cyne-wulf.github.io/goat-network-dash](https://cyne-wulf.github.io/goat-network-dash). This is a static snapshot meant for judges, so the Hello GOAT panel is read-only and API-backed flows are disabled (see on-screen banner).

The workflow sits in `.github/workflows/deploy.yml` and removes the API routes before performing a static export so pages can be hosted on GitHub Pages.

---

## 🚀 Quickstart
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create env file**
   ```bash
   cp .env.local.example .env.local
   ```
3. **Fill every variable** listed in [Environment Variables](#environment-variables) with real RPC URLs, keys, and explorer bases.
4. *(Optional)* **Start a local chain**  
   ```bash
   npm run chain
   ```
5. **Run the console**
   ```bash
   npm run dev
   ```
6. **Visit the UI**  
   - Dashboard: `http://localhost:3000`  
   - Live logs: `http://localhost:3000/logs`

---

## 🧠 Hello GOAT 402 Flow
1. Dashboard issues `POST /api/x402` without a body → backend answers with HTTP 402 and an invoice payload.
2. UI displays the invoice modal, then automatically re-posts `{ invoiceId, action: "pay" }` until settlement (retry limited).
3. `proofService` uses `CHAIN_RPC_URL`, `GOAT_PAYER_PRIVATE_KEY`, and `GOAT_RECEIVER_ADDRESS` to execute the tiny transfer with viem, waits for settlement, and stores `{ txHash, explorerUrl, settledAt }` in `data/proofs.json`.
4. The Hello GOAT payload (message + receipt + proof) is returned to the client, which updates `progressStore`.
5. Every hop logs to `data/logs.json`, powering the `/logs` inspector with request/response badges and expandable payloads.

---

## 🔭 Observability Surfaces
- **Proof of Payment card** – shows agent identity, the freshest tx hash, explorer deep link, and the “Copy summary” action for judges.
- **Activation checklist** – five non-negotiable steps mapped to the Sub-agent Beacon spec with resolver-backed states.
- **Logs view** – SWR-driven stream with chips for direction, HTTP status, attempts, error codes, and payload detail blocks.
- **Signal ticker** – hero-level marquee summarizing signer health, RPC status, and ops bot deploys in real time.

---

## 🧰 Stack
| Area | Tech |
| --- | --- |
| App shell | Next.js App Router, Server Components, React 18 |
| Styling | Tailwind CSS, custom gradients, shadcn/ui |
| State | Zustand stores (`progressStore`, `consoleSettings`) |
| Chain | viem for payments, optional Foundry Anvil devnet |
| Tooling | ESLint, Vitest, tw-animate, PostCSS |

---

## Environment Variables
Provide your own secrets locally; nothing is committed.
- `CHAIN_RPC_URL`
- `GOAT_PAYER_PRIVATE_KEY`
- `GOAT_RECEIVER_ADDRESS`
- `CHAIN_EXPLORER_BASE`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_PROJECT_NAME`
- (Optional UX seeds) `NEXT_PUBLIC_WALLET_ADDRESS`, `NEXT_PUBLIC_ERC8004_ID`, `NEXT_PUBLIC_X402_MERCHANT_ID`, `NEXT_PUBLIC_X402_MERCHANT_STATUS`, `NEXT_PUBLIC_AGENT_WEBHOOK_URL`, `NEXT_PUBLIC_AGENT_WEBHOOK_VERIFIED`, `NEXT_PUBLIC_AGENT_WEBHOOK_VERIFIED_AT`
- (Static demo toggle) `NEXT_PUBLIC_STATIC_BUILD` (set to `true` in the GitHub Pages workflow so the Hello GOAT panel advertises read-only mode)

---

## Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the compiled app |
| `npm run lint` | ESLint over the repo |
| `npm run test` | Vitest unit suite (activation resolvers, helpers, etc.) |
| `npm run chain` | Starts `anvil --chain-id 31337` for local experiments |

---

## Data & Logs
- `data/logs.json` – chronological entries containing level, event, direction, HTTP status, request IDs, payloads.
- `data/proofs.json` – append-only proof ledger storing tx metadata.
- `/logs` – SWR-powered page that fetches `/api/logs`, renders chips for INFO/ERROR, and expands payloads for auditing.

---

## ✅ Activation Checklist
- 402 challenge issues invoices
- Payment action writes a viem proof under `/data`
- Hello GOAT UI updates the progress store + renders the latest proof card
- Logs endpoint/page expose every step for auditing

---

## 🧪 Manual QA Script
1. Populate `.env.local` with valid RPC, keys, receiver, and explorer base URL values.
2. Run `npm run dev`.
3. Visit `http://localhost:3000` and click **Say Hello GOAT**.
4. Verify the modal shows invoice details, then wait for the success toast.
5. Confirm the dashboard updates the Proof card (hash + timestamp + explorer link).
6. Visit `http://localhost:3000/logs` and confirm invoice/payment entries are present.
7. Inspect `data/logs.json` and `data/proofs.json` to ensure new entries were appended.

---

## 🎤 Demo Script
1. Start `npm run dev` and open `http://localhost:3000`.
2. Spotlight the neon hero, Proof card, and Activation checklist tiles.
3. Trigger **Say Hello GOAT**; narrate 402 → pay → success while status tiles animate.
4. Jump to `/logs` to reveal the timeline chips and expand payloads.
5. Return to Proof, click **Copy summary**, and mention the explorer link for the settled transaction.
