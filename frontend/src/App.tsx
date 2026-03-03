import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import AddTransaction from "./components/AddTransaction";
import SavingTips from "./components/SavingTips";
import SmartInsights from "./components/SmartInsights";
import Charts from "./components/Charts";
import AIChatbot from "./components/AIChatbot";

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type Page =
  | "dashboard"
  | "transactions"
  | "add"
  | "tips"
  | "insights"
  | "charts"
  | "ai";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextId, setNextId] = useState(1);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [...prev, { ...tx, id: nextId }]);
    setNextId((id) => id + 1);
  };

  return (
    <div className="app-root">
      <aside className="sidebar">
        <h1 className="sidebar-title">AI Powered Personal Financial Advisor</h1>
        <nav className="sidebar-nav">
          <button
            onClick={() => setPage("dashboard")}
            className={page === "dashboard" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Dashboard
          </button>
          <button
            onClick={() => setPage("transactions")}
            className={page === "transactions" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Transactions
          </button>
          <button
            onClick={() => setPage("add")}
            className={page === "add" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Add Transaction
          </button>
          <button
            onClick={() => setPage("tips")}
            className={page === "tips" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Saving Tips
          </button>
          <button
            onClick={() => setPage("insights")}
            className={page === "insights" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Smart Insights
          </button>
          <button
            onClick={() => setPage("charts")}
            className={page === "charts" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            Charts
          </button>
          <button
            onClick={() => setPage("ai")}
            className={page === "ai" ? "nav-btn nav-btn-active" : "nav-btn"}
          >
            AI Chatbot
          </button>
        </nav>
      </aside>

      <main className="main">
        <header className="main-header">
          <div className="main-title">AI Powered Personal Financial Advisor</div>
          <div className="main-subtitle">
            Track your spending, set budgets, visualize cash flow, and chat with an
            AI assistant for personalised guidance.
          </div>
        </header>

        <section className="main-content">
          {page === "dashboard" && <Dashboard transactions={transactions} />}
          {page === "transactions" && (
            <TransactionList transactions={transactions} />
          )}
          {page === "add" && <AddTransaction addTransaction={addTransaction} />}
          {page === "tips" && <SavingTips transactions={transactions} />}
          {page === "insights" && <SmartInsights transactions={transactions} />}
          {page === "charts" && <Charts transactions={transactions} />}
          {page === "ai" && <AIChatbot />}
        </section>
      </main>
    </div>
  );
};

export default App;

