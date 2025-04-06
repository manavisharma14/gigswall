import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

//const socket = io("https://peergigbe.onrender.com"); // or localhost
const socket = io("http://localhost:5001");

function Chat({ jobId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("join-room", { room: `${jobId}-${userId}` });

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-message");
      socket.emit("leave-room", { room: `${jobId}-${userId}` });
    };
  }, [jobId, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { text: input, sender: userId, timestamp: Date.now() };
    socket.emit("chat-message", { room: `${jobId}-${userId}`, msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md mx-auto">
      <div className="h-64 overflow-y-auto space-y-2 mb-3 border p-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className="text-sm text-gray-700 dark:text-gray-200">
            <strong>{m.sender === userId ? "You" : "Other"}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
