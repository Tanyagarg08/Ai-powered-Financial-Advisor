import React, { FormEvent, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

/* ✅ Updated professional templates */
const QUICK_TEMPLATES: string[] = [
  "Create a structured monthly budget plan based on my income.",
  "Evaluate my emergency fund readiness given my monthly expenses.",
  "Design a diversified long-term investment strategy.",
  "Optimise my debt repayment strategy for multiple loans.",
];

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi, I’m your AI-powered financial assistant. Share your goals or current situation and I’ll help you plan clearly and safely.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(2);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: counter, role: "user", text: trimmed };
    setCounter((c) => c + 1);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();

      const replyText: string =
        typeof data?.reply === "string"
          ? data.reply
          : "Sorry, I was not able to generate a response.";

      const botMsg: ChatMessage = {
        id: counter + 1,
        role: "assistant",
        text: replyText,
      };

      setCounter((c) => c + 2);
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: counter + 1,
        role: "assistant",
        text:
          "There was a problem contacting the AI service. Please check that the backend is running on http://localhost:5000.",
      };
      setCounter((c) => c + 2);
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-layout">
      <section className="chat-panel">
        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                "message " +
                (m.role === "user" ? "message-user" : "message-assistant")
              }
            >
              <div
                className={
                  "avatar " +
                  (m.role === "user" ? "avatar-user" : "avatar-assistant")
                }
              >
                {m.role === "user" ? "You" : "A"}
              </div>
              <div className="bubble">{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message message-assistant">
              <div className="avatar avatar-assistant">A</div>
              <div className="bubble bubble-loading">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={sendMessage}>
          <div className="chat-input-row">
            <textarea
              className="chat-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budgeting, saving or strategic financial planning..."
              required
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !input.trim()}
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>
          <small className="input-note">
            This assistant provides general educational guidance only and does not
            replace a licensed professional.
          </small>
        </form>
      </section>

      <aside className="side-panel">
        <div>
          {/* ✅ Professional heading */}
          <div className="side-heading">Strategic Planning Tools</div>

          <div className="pill-list">
            {QUICK_TEMPLATES.map((t, index) => (
              <button
                key={index}
                type="button"
                className="pill"
                onClick={() => setInput(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="side-heading">Best results</div>
          <ul className="side-note">
            <li>Share time horizon, risk comfort and approximate amounts.</li>
            <li>Include numbers: income, expenses, savings and goals.</li>
            <li>Ask follow-ups to refine your plan.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AIChatbot;