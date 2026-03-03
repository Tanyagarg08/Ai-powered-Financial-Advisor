import React, { useState } from "react";
import type { Transaction } from "../App";

type Props = {
  transactions: Transaction[];
};

const Dashboard: React.FC<Props> = ({ transactions }) => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  /* ===================== NEW FEATURES ===================== */

  // Saving Goal
  const [savingGoal, setSavingGoal] = useState<number>(50000);

  const savingsSoFar = total;

  const progress =
    savingGoal > 0
      ? Math.min((savingsSoFar / savingGoal) * 100, 100)
      : 0;

  // Average Expense
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  const avgExpense =
    expenseTransactions.length > 0
      ? expenses / expenseTransactions.length
      : 0;

  /* ===================== UI ===================== */

  return (
    <div className="card-grid">
      {/* Net Balance */}
      <div className="card metric-card">
        <h3>Net Balance</h3>
        <p className="metric-large">
          ₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="metric-caption">
          Income and expenses combined across all transactions.
        </p>
      </div>

      {/* Total Income */}
      <div className="card metric-card">
        <h3>Total Income</h3>
        <p className="metric-positive">
          ₹{income.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="metric-caption">Money coming in this period.</p>
      </div>

      {/* Total Expenses */}
      <div className="card metric-card">
        <h3>Total Expenses</h3>
        <p className="metric-negative">
          ₹{Math.abs(expenses).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </p>
        <p className="metric-caption">
          Spending across all categories.
        </p>
      </div>

      {/* Saving Goal Tracker */}
      <div className="card metric-card">
        <h3>Saving Goal</h3>

        <input
          type="number"
          value={savingGoal}
          onChange={(e) => setSavingGoal(Number(e.target.value))}
          className="goal-input"
          placeholder="Enter your saving goal"
        />

        <p className="metric-large">
          ₹{savingsSoFar.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </p>

        <p className="metric-caption">
          {progress.toFixed(0)}% of ₹{savingGoal.toLocaleString()} goal achieved
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Average Expense */}
      <div className="card metric-card">
        <h3>Average Expense</h3>
        <p className="metric-negative">
          ₹{Math.abs(avgExpense).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </p>
        <p className="metric-caption">
          Average spending per expense transaction.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;