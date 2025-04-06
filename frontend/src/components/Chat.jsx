import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://peergigbe.onrender.com"); // backend URL

function Chat({ jobId, userId }) {
const sortedIds = [senderId, receiverId].sort().join('');
  const roomId = `${jobId}-${sortedIds}`;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join-room', { roomId });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave-room', { roomId });
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { roomId, text: message, sender: userId });
      setMessages((prev) => [...prev, { text: message, sender: 'You' }]);
      setMessage('');
    }
  };

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-2">💬 Chat</h3>
      <div className="h-40 overflow-y-auto border p-2 mb-2 rounded">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-sm">{msg.sender}: {msg.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded border text-black"
        />
        <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
