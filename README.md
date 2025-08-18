# 🗳️ Solana Voting dApp

A decentralized voting application built on **Solana** using the **Anchor framework** for the smart contract and **Next.js** for the frontend.

---

## 📁 Project Structure

```
voting/
├── programs/
│   └── voting/           # Anchor smart contract programs
│       ├── src/
│       │   ├── instructions/ # Program instructions (create_poll, vote, etc.)
│       │   └── state/        # Account states (Poll, Candidate, Voter, etc.)
│       └── Cargo.toml
├── voting-frontend/    # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # React components 
│   │   │   ├── create/     # Poll creation page
│   │   │   ├── polls/[pollId]/ # Dynamic poll details page
│   │   │   ├── services/   # Solana RPC and program interaction
│   │   │   └── store/      # Redux-like store management
│   │   └── utils/      # Utility functions and interfaces
│   ├── package.json    # Frontend dependencies
│   └── next.config.ts
├── Anchor.toml           # Anchor workspace configuration
├── Cargo.toml            # Rust workspace dependencies
└── LICENSE
```

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
- **Languages:** TypeScript (Frontend), Rust (Smart Contract)
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
```

### 🛠️ Local Setup

Follow these steps to set up both the **smart contract** and **frontend** locally:  

### 1. Clone the Repositories
```bash
# Clone the repo
git clone https://github.com/sthitasahu/solana-voting.git
cd solana-voting

# Build and deploy the Anchor program (smart contract) to Solana Devnet
anchor build
anchor deploy

# Navigate to the frontend directory
cd voting-frontend

# Install frontend dependencies
pnpm install

# Start the Next.js development server
pnpm dev
```
Now open 👉 `http://localhost:3000` in your browser.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

---

### 📜 License  

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.  

You are free to:  
- ✅ Use the code for personal and commercial projects  
- ✅ Modify and distribute it  
- ✅ Learn and build upon it  

But you must:  
- ⚖️ Include the original copyright and license notice in any copy  
- ⚖️ Provide attribution to the authors 

