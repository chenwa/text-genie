import React, { useState, useRef, useEffect } from 'react';
import './Messenger.css';
import { sendGolfMessengerMessage } from '../api/messenger';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const Messenger: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Hi! How can I help you with your golf fitting today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const aiText = await sendGolfMessengerMessage(userMsg.text);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: aiText,
        },
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: 'Sorry, there was a problem connecting to the golf assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="messenger-toggle-btn"
        onClick={() => setVisible(v => !v)}
        style={{
          position: 'absolute',
          top: visible ? 8 : -40,
          right: 8,
          zIndex: 1100,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: visible ? 32 : 54,
          height: visible ? 32 : 54,
          fontSize: visible ? 20 : 32,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'background 0.2s, width 0.2s, height 0.2s, font-size 0.2s, top 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={visible ? 'Hide Messenger' : 'Show Messenger'}
        title={visible ? 'Hide Messenger' : 'Show Messenger'}
      >
        {visible ? '×' : <span role="img" aria-label="chat">💬</span>}
      </button>
      {visible && (
        <div className="messenger-container" style={{ marginTop: 36 }}>
          <div className="messenger-header">
            <h3 className="messenger-title" style={{padding: '0 1.2em'}}>NeutralFit Assistant</h3>
          </div>
          <div className="messenger-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`messenger-message messenger-message-${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="messenger-input-row">
            <input
              type="text"
              className="messenger-input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <button className="messenger-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
