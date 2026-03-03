import React from "react";
import type { Transaction } from "../App";

type Props = {
  transactions: Transaction[];
};

const SmartInsights: React.FC<Props> = ({ transactions }) => {
  if (!transactions.length) {
    return (
      <div className="card">
        <h3>Smart insights</h3>
        <p className="muted">
          Add a few transactions to see simple insights about your cash flow.
        </p>
      </div>
    );
  }

  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);

  const largestExpense = expenses.reduce(
    (prev, curr) => (Math.abs(curr.amount) > Math.abs(prev.amount) ? curr : prev),
    expenses[0],
  );

  const avgIncome =
    income.reduce((sum, t) => sum + t.amount, 0) / Math.max(income.length, 1);

  return (
    <div className="card">
      <h3>Smart insights</h3>
      <div className="insights-grid">
        <div className="insight">
          <h4>Largest expense</h4>
          <p className="metric-negative">
            ₹{Math.abs(largestExpense.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="muted">
            Category: <strong>{largestExpense.category}</strong> — consider whether
            this can be reduced or spaced out.
          </p>
        </div>
        <div className="insight">
          <h4>Typical income</h4>
          <p className="metric-positive">
            ₹{avgIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="muted">
            A simple average of your recent income transactions. Use this as a base
            for monthly planning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;

