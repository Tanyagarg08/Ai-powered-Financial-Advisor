import React from "react";

export default function Sidebar({ setActivePage, activePage }) {
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Transactions" },
    { id: "insights", label: "Smart Insights" },
    { id: "chatbot", label: "AI Chatbot" },
    { id: "tips", label: "Saving Tips" },
    { id: "charts", label: "Analytics" },
  ];

  return (
    <div className="sidebar">
      <h1 className="logo">💰 FinanceMate</h1>

      <nav className="menu">
        {links.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
