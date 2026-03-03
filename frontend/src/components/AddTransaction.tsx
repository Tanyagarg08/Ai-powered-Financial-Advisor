import React, { FormEvent, useState } from "react";
import type { Transaction } from "../App";

type Props = {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
};

const AddTransaction: React.FC<Props> = ({ addTransaction }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!description || !amount || Number.isNaN(numeric)) return;

    addTransaction({
      description,
      amount: numeric,
      category: category || "General",
      date,
    });

    setDescription("");
    setAmount("");
    setCategory("");
  };

  return (
    <div className="card">
      <h3>Add transaction</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Groceries, salary, rent..."
            required
          />
        </label>

        <label>
          <span>Amount (₹)</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Use negative for expenses"
            required
          />
        </label>

        <label>
          <span>Category</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, rent, travel..."
          />
        </label>

        <label>
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;

