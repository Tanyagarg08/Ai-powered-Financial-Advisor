import React from "react";
import type { Transaction } from "../App";

type Props = {
  transactions: Transaction[];
};

const TransactionList: React.FC<Props> = ({ transactions }) => {
  if (!transactions.length) {
    return (
      <div className="card">
        <h3>Transactions</h3>
        <p className="muted">You haven&apos;t added any transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Transactions</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={"text-right " + (t.amount < 0 ? "text-negative" : "text-positive")}>
                {t.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

