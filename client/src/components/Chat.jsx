import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

let socket;
export default function Chat({ otherId, otherName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottom = useRef();

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL);
    socket.emit("join", { me: user._id, other: otherId });
    api.get(`/messages/${otherId}`).then(({ data }) => setMessages(data));
    socket.on("message", (m) => setMessages((prev) => [...prev, m]));
    return () => socket.disconnect();
  }, [otherId]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit("message", { sender: user._id, receiver: otherId, text });
    setText("");
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: 420 }}>
      <h3 style={{ marginBottom: 10 }}>Chat with {otherName}</h3>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m) => (
          <div key={m._id} style={{ alignSelf: m.sender === user._id ? "flex-end" : "flex-start", background: m.sender === user._id ? "var(--accent)" : "#0b1220", padding: "8px 12px", borderRadius: 12, maxWidth: "70%" }}>
            {m.text}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." style={{ margin: 0 }} />
        <button className="btn">Send</button>
      </form>
    </div>
  );
}
