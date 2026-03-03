import os

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from openai import OpenAI

try:
    from dotenv import load_dotenv  # type: ignore
except ImportError:  # pragma: no cover - optional dependency fallback
    def load_dotenv(*_, **__):
        """Gracefully skip loading .env if python-dotenv is unavailable."""
        return None

app = Flask(__name__)
CORS(app)

# Load .env file from backend directory
import os as os_module
env_path = os_module.path.join(os_module.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)


def _build_client():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


client = _build_client()


@app.route("/", methods=["GET"])
def index():
    """Simple, professional web UI for the financial advisor."""
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI‑Powered Financial Advisor</title>
        <!-- Bootstrap 5 -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
        />
        <style>
            :root {
                --primary-color: #0f766e;
                --primary-soft: #ccfbf1;
                --bg-soft: #0f172a;
            }

            body {
                min-height: 100vh;
                background: radial-gradient(circle at top, #0f172a 0, #020617 55%, #000 100%);
                color: #e5e7eb;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }

            .page-shell {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem 1rem;
            }

            .app-card {
                width: 100%;
                max-width: 960px;
                border-radius: 1.5rem;
                border: 1px solid rgba(148, 163, 184, 0.35);
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.98));
                box-shadow:
                    0 24px 80px rgba(15, 23, 42, 0.85),
                    0 0 0 1px rgba(15, 23, 42, 0.9);
                overflow: hidden;
            }

            .app-header {
                padding: 1.75rem 1.75rem 1.25rem;
                border-bottom: 1px solid rgba(148, 163, 184, 0.35);
                display: flex;
                justify-content: space-between;
                gap: 1.5rem;
                align-items: flex-start;
            }

            .brand-pill {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.25rem 0.8rem;
                border-radius: 999px;
                background: rgba(15, 118, 110, 0.08);
                border: 1px solid rgba(34, 197, 194, 0.45);
                color: #a5f3fc;
                font-size: 0.75rem;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }

            .brand-dot {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 999px;
                background: #22c55e;
                box-shadow: 0 0 12px rgba(34, 197, 94, 0.9);
            }

            .app-title {
                font-size: 1.6rem;
                font-weight: 600;
                letter-spacing: 0.03em;
                display: flex;
                align-items: center;
                gap: 0.55rem;
            }

            .app-title-accent {
                color: #5eead4;
            }

            .app-subtitle {
                max-width: 480px;
                color: #9ca3af;
                font-size: 0.95rem;
            }

            .badge-pill {
                font-size: 0.7rem;
                border-radius: 999px;
                padding: 0.25rem 0.7rem;
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(148, 163, 184, 0.65);
                color: #e5e7eb;
                display: inline-flex;
                align-items: center;
                gap: 0.35rem;
            }

            .badge-dot {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                background: #22c55e;
            }

            .app-body {
                padding: 1.5rem 1.75rem 1.75rem;
                display: grid;
                grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.2fr);
                gap: 1.5rem;
            }

            @media (max-width: 900px) {
                .app-body {
                    grid-template-columns: minmax(0, 1fr);
                }
            }

            .chat-panel {
                border-radius: 1.1rem;
                background: radial-gradient(circle at top left, rgba(15, 118, 110, 0.24), transparent 55%),
                            radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.2), transparent 55%),
                            rgba(15, 23, 42, 0.92);
                border: 1px solid rgba(148, 163, 184, 0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-messages {
                padding: 1.1rem 1.15rem;
                max-height: 340px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }

            .message {
                display: flex;
                gap: 0.6rem;
                align-items: flex-start;
                font-size: 0.92rem;
            }

            .message-user .bubble {
                background: rgba(15, 118, 110, 0.98);
                color: #ecfeff;
                align-self: flex-end;
            }

            .message-assistant .bubble {
                background: rgba(15, 23, 42, 0.96);
                border: 1px solid rgba(148, 163, 184, 0.7);
                color: #e5e7eb;
            }

            .avatar {
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 999px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                font-weight: 600;
                flex-shrink: 0;
            }

            .avatar-user {
                background: rgba(15, 118, 110, 0.18);
                color: #5eead4;
            }

            .avatar-assistant {
                background: rgba(15, 23, 42, 1);
                color: #facc15;
                border: 1px solid rgba(250, 204, 21, 0.55);
            }

            .bubble {
                padding: 0.7rem 0.85rem;
                border-radius: 0.9rem;
                max-width: 100%;
            }

            .chat-input-area {
                padding: 0.85rem 0.95rem 0.95rem;
                border-top: 1px solid rgba(148, 163, 184, 0.55);
                background: linear-gradient(to top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.94));
            }

            .form-control,
            .form-control:focus {
                background-color: rgba(15, 23, 42, 0.95);
                border-color: rgba(148, 163, 184, 0.65);
                color: #e5e7eb;
                box-shadow: none;
            }

            .form-control::placeholder {
                color: #6b7280;
            }

            .btn-primary {
                background: linear-gradient(90deg, #0f766e, #22c55e);
                border: none;
                font-weight: 500;
                letter-spacing: 0.03em;
                text-transform: uppercase;
                font-size: 0.78rem;
                padding-inline: 1.2rem;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35);
            }

            .btn-primary:disabled {
                opacity: 0.7;
                box-shadow: none;
            }

            .btn-primary:hover {
                filter: brightness(1.02);
            }

            .loading-dot {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 999px;
                background: #a5f3fc;
                animation: pulse 1s infinite alternate;
            }

            @keyframes pulse {
                from {
                    transform: scale(1);
                    opacity: 0.6;
                }
                to {
                    transform: scale(1.4);
                    opacity: 1;
                }
            }

            .side-panel {
                border-radius: 1.1rem;
                border: 1px solid rgba(148, 163, 184, 0.55);
                background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 55%),
                            rgba(15, 23, 42, 0.96);
                padding: 1.25rem 1.15rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .side-heading {
                font-size: 0.95rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #9ca3af;
            }

            .pill-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.45rem;
            }

            .pill {
                font-size: 0.8rem;
                padding: 0.3rem 0.7rem;
                border-radius: 999px;
                border: 1px solid rgba(148, 163, 184, 0.65);
                color: #e5e7eb;
                cursor: pointer;
                background: rgba(15, 23, 42, 0.9);
                transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
            }

            .pill:hover {
                background: rgba(15, 23, 42, 1);
                border-color: rgba(56, 189, 248, 0.8);
                transform: translateY(-1px);
            }

            .side-note {
                font-size: 0.8rem;
                color: #9ca3af;
            }

            .side-note-strong {
                color: #e5e7eb;
            }

            .footer {
                padding: 0.6rem 1.75rem 0.9rem;
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: #6b7280;
                border-top: 1px solid rgba(31, 41, 55, 1);
                background: linear-gradient(to top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.96));
            }

            .footer a {
                color: #a5f3fc;
                text-decoration: none;
            }

            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="page-shell">
            <div class="app-card">
                <header class="app-header">
                    <div>
                        <div class="brand-pill mb-2">
                            <span class="brand-dot"></span>
                            Real‑time insights
                        </div>
                        <div class="app-title">
                            AI‑Powered
                            <span class="app-title-accent">Financial Advisor</span>
                        </div>
                        <p class="app-subtitle mt-2 mb-0">
                            Ask tailored questions about budgeting, saving, and long‑term planning.
                            Designed for clear, practical, and safe guidance.
                        </p>
                    </div>
                    <div class="d-flex flex-column align-items-end gap-2">
                        <span class="badge-pill">
                            <span class="badge-dot"></span>
                            Live assistant
                        </span>
                        <span class="text-secondary-emphasis" style="font-size: 0.75rem;">
                            Not investment, tax, or legal advice.
                        </span>
                    </div>
                </header>

                <main class="app-body">
                    <section class="chat-panel">
                        <div id="chatMessages" class="chat-messages">
                            <div class="message message-assistant">
                                <div class="avatar avatar-assistant">A</div>
                                <div class="bubble">
                                    Hi, I’m your AI‑powered financial assistant. Tell me about your
                                    current situation or goals, and I’ll help you make a clear, practical plan.
                                </div>
                            </div>
                        </div>
                        <div class="chat-input-area">
                            <form id="chatForm" class="d-flex flex-column gap-2">
                                <div class="d-flex gap-2">
                                    <textarea
                                        id="userMessage"
                                        class="form-control"
                                        rows="2"
                                        placeholder="For example: “Help me create a monthly budget on a ₹60,000 salary” or “How much should I save for an emergency fund?”"
                                        required
                                    ></textarea>
                                    <button
                                        id="sendButton"
                                        class="btn btn-primary d-flex align-items-center justify-content-center"
                                        type="submit"
                                    >
                                        <span id="sendLabel">Send</span>
                                        <span
                                            id="loadingIndicator"
                                            class="ms-2 d-none loading-dot"
                                        ></span>
                                    </button>
                                </div>
                                <small class="text-secondary">
                                    Your questions are processed securely and not stored by this demo backend.
                                </small>
                            </form>
                        </div>
                    </section>

                    <aside class="side-panel">
                        <div>
                            <div class="side-heading mb-2">Quick start templates</div>
                            <div class="pill-list">
                                <button type="button" class="pill" data-prompt="Help me build a simple 50/30/20 budget based on my monthly take‑home income.">
                                    50/30/20 budget
                                </button>
                                <button type="button" class="pill" data-prompt="How much should I keep in an emergency fund if my monthly expenses are ₹40,000?">
                                    Emergency fund
                                </button>
                                <button type="button" class="pill" data-prompt="I want to start investing for retirement. What are some standard, diversified options to consider?">
                                    Retirement basics
                                </button>
                                <button type="button" class="pill" data-prompt="I have a personal loan and a credit card balance. How should I prioritize paying them off?">
                                    Debt payoff plan
                                </button>
                            </div>
                        </div>

                        <div>
                            <div class="side-heading mb-2">Best results</div>
                            <ul class="side-note mb-2 ps-3">
                                <li>Share your time horizon and comfort with risk.</li>
                                <li>Include numbers: income, expenses, and goals.</li>
                                <li>Ask follow‑ups to refine your plan.</li>
                            </ul>
                        </div>

                        <div class="side-note">
                            <span class="side-note-strong">Important:</span>
                            This assistant provides general educational guidance only. It does not
                            replace a licensed financial planner or personalized professional advice.
                        </div>
                    </aside>
                </main>

                <footer class="footer">
                    <span>AI‑Powered Financial Advisor · Demo experience</span>
                    <span>Always verify important decisions with a qualified professional.</span>
                </footer>
            </div>
        </div>

        <script>
            const form = document.getElementById("chatForm");
            const input = document.getElementById("userMessage");
            const messages = document.getElementById("chatMessages");
            const sendButton = document.getElementById("sendButton");
            const sendLabel = document.getElementById("sendLabel");
            const loadingIndicator = document.getElementById("loadingIndicator");

            function appendMessage(role, text) {
                const wrapper = document.createElement("div");
                wrapper.className = "message " + (role === "user" ? "message-user" : "message-assistant");

                const avatar = document.createElement("div");
                avatar.className = "avatar " + (role === "user" ? "avatar-user" : "avatar-assistant");
                avatar.textContent = role === "user" ? "You" : "A";

                const bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.textContent = text;

                wrapper.appendChild(avatar);
                wrapper.appendChild(bubble);
                messages.appendChild(wrapper);
                messages.scrollTop = messages.scrollHeight;
            }

            function setLoading(isLoading) {
                sendButton.disabled = isLoading;
                loadingIndicator.classList.toggle("d-none", !isLoading);
                sendLabel.textContent = isLoading ? "Thinking…" : "Send";
            }

            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const text = input.value.trim();
                if (!text) return;

                appendMessage("user", text);
                input.value = "";
                setLoading(true);

                try {
                    const response = await fetch("/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: text }),
                    });

                    const data = await response.json();
                    const reply = data.reply || "Sorry, I was not able to generate a response.";
                    appendMessage("assistant", reply);
                } catch (error) {
                    appendMessage(
                        "assistant",
                        "There was a problem contacting the AI service. Please check that the backend is running."
                    );
                } finally {
                    setLoading(false);
                    input.focus();
                }
            });

            document.querySelectorAll(".pill").forEach((pill) => {
                pill.addEventListener("click", () => {
                    const prompt = pill.getAttribute("data-prompt");
                    if (!prompt) return;
                    input.value = prompt;
                    input.focus();
                });
            });
        </script>
    </body>
    </html>
    """
    return render_template_string(html)

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint to verify server is running"""
    api_key_set = os.environ.get("OPENAI_API_KEY") is not None
    client_ready = client is not None
    return jsonify({
        "status": "ok",
        "server": "running",
        "api_key_configured": api_key_set,
        "client_ready": client_ready
    })

@app.route("/chat", methods=["POST"])
def chat():
    try:
        global client

        if client is None:
            client = _build_client()

        if client is None:
            return (
                jsonify(
                    {
                        "reply": (
                            "AI service is offline because the OpenAI API key is not configured. "
                            "Please add OPENAI_API_KEY to the backend environment."
                        )
                    }
                ),
                503,
            )

        payload = request.get_json(silent=True) or {}
        user_message = payload.get("message", "")
        if not user_message:
            return jsonify({"reply": "Please provide a message to the AI."}), 400

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI Financial Advisor. Provide concise, safe guidance "
                        "on budgeting, savings, and standard investment vehicles. "
                        "Decline harmful or speculative advice."
                    ),
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("AI ERROR:", e)
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
            return jsonify({"reply": "Invalid API key. Please check your OpenAI API key configuration."}), 500
        elif "quota" in error_msg.lower() or "insufficient_quota" in error_msg.lower():
            return jsonify({
                "reply": "OpenAI API quota exceeded. Please add credits to your OpenAI account or use a different API key. Visit https://platform.openai.com/account/billing to add credits."
            }), 429
        elif "rate limit" in error_msg.lower():
            return jsonify({"reply": "Rate limit exceeded. Please try again in a moment."}), 429
        else:
            return jsonify({"reply": f"AI service error: {error_msg[:200]}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)


