import React, { useEffect, useState } from "react";
import axios from "axios";
import './ContactMessagesAdmin.scss';

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contactUs");
        setMessages(res.data);
      } catch (err) {
        alert("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="admin-messages">
      <h1>Contact Messages</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg._id} className="message-card">
              <p><strong>Name:</strong> {msg.name}</p>
              <p><strong>Email:</strong> {msg.email}</p>
              {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
              <p><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
              <div className="message-body">
                <strong>Message:</strong>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesAdmin;
