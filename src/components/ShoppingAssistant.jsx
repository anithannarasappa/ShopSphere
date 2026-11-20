import { useState } from "react";

function ShoppingAssistant({ onAsk }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your ShopSphere assistant. Ask me about cheap products, ratings, discounts or phones."
    }
  ]);

  const sendMessage = () => {
    if (!question.trim()) return;

    const userQuestion = question.trim();
    const answer = onAsk(userQuestion);

    setMessages(previous => [
      ...previous,
      { sender: "user", text: userQuestion },
      { sender: "bot", text: answer }
    ]);

    setQuestion("");
  };

  return (
    <div className="assistant-container">
      {open && (
        <div className="assistant-window">
          <div className="assistant-header">
            <div>
              <h3>🤖 Shopping Assistant</h3>
              <small>Product data assistant</small>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="assistant-input">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about products..."
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}

      <button className="assistant-toggle" onClick={() => setOpen(!open)}>
        {open ? "✕" : "🤖"}
      </button>
    </div>
  );
}

export default ShoppingAssistant;