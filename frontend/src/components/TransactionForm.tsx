import React, { useState } from "react";

function TransactionForm({ addTransaction }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!desc || !amount) {
      alert("Please enter description and amount");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      desc,
      amount: parseFloat(amount),
      category,
    };

    addTransaction(newTransaction);
    setDesc("");
    setAmount("");
    setCategory("Food");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 shadow rounded mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>

      <input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full mb-3"
      >
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Health</option>
        <option>Education</option>
        <option>Other</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;


