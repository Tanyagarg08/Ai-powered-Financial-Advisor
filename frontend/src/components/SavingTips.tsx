import React from "react";
import type { Transaction } from "../App";

type Props = {
  transactions: Transaction[];
};

const SavingTips: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.amount < 0);
  const monthlySpend = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const suggestedEmergencyFund = monthlySpend * 3;

  return (
    <div className="card">
      <h3>Saving tips</h3>
      <p className="muted">
        These are simple, generic ideas. For personalised plans, use the AI chatbot
        page.
      </p>

      <ul className="bullet-list">
        <li>
          Try to keep at least{" "}
          <strong>
            ₹{suggestedEmergencyFund.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </strong>{" "}
          aside as an emergency fund (around 3× your recent monthly spending).
        </li>
        <li>
          Track 3 biggest expense categories and see if you can reduce each by{" "}
          <strong>5–10%</strong> next month.
        </li>
        <li>
          Automate a fixed savings transfer right after each payday to avoid
          spending first and saving later.
        </li>
      </ul>
    </div>
  );
};

export default SavingTips;

