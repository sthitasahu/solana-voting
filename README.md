# THIS IS A SOLANA DECENTRALIZED VOTING APPLICATION

# 🗳️ Solana Voting dApp

A decentralized voting application built on **Solana** using the **Anchor framework** for the smart contract and **Next.js** for the frontend.

---

## ✨ Features

- Create new polls with a description and start/end times.
- Register candidates for a poll.
- Vote for candidates in active polls.
- Prevents duplicate votes and duplicate candidate registrations.
- Displays poll details and live voting results.
- Error handling for common scenarios (poll not active, poll not found, voter already voted, etc.).

---

## 🛠️ Tech Stack

- **Smart Contract:** [Anchor](https://www.anchor-lang.com/) (Rust framework for Solana programs)  
- **Frontend:** [Next.js](https://nextjs.org/) + [React](https://react.dev/)  
- **Wallet Integration:** [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)  
- **Language:** TypeScript Rust 
- **Blockchain:** Solana Devnet 

---
## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (>=16)  
- [Yarn](https://yarnpkg.com/) or npm  
- [Rust](https://www.rust-lang.org/)  
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli)  
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)  

Check versions:

```bash
solana --version
anchor --version
rustc  --version
node -v
yarn -v

## 🛠️ Local Setup

Follow these steps to set up both the **smart contract** and **frontend** locally:  

### 1. Clone the Repositories
```bash
# Clone the repo
git clone https://github.com/sthitasahu/solana-voting.git
cd solana-voting

# In a new terminal, build and deploy the program/smart contract
anchor build
anchor deploy

# Frontend setup
cd voting-frontend
pnpm install
pnpm dev
Now open 👉 http://localhost:3000 in your browser.









