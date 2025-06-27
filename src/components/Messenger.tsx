import React, { useState, useRef, useEffect } from 'react';
import './Messenger.css';
import { sendMessengerMessage } from '../api/api';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const Messenger: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Hi! How can I help you with your writing today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when Messenger is shown or after messages update
  useEffect(() => {
    if (visible && !loading) {
      inputRef.current?.focus();
    }
  }, [visible, messages, loading]);

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
      const aiText = await sendMessengerMessage(userMsg.text);
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
          text: 'Sorry, there was a problem connecting to the assistant.',
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
      {!visible && (
        <span style={{
          position: 'absolute',
          top: 11,
          right: 8 + 54 + 8 + 2 - 20 + 5, // moved right by 5px from previous -20
          color: '#1976d2',
          background: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          padding: '2px 10px',
          height: 32,
          display: 'flex',
          alignItems: 'center',
        }}>Ask Genie</span>
      )}
      </button>
      {visible && (
        <div className="messenger-container" style={{ marginTop: 36 }}>
          <div className="messenger-header">
            <h3 className="messenger-title" style={{padding: '0 1.2em'}}>Typing Genie</h3>
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
              ref={inputRef}
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
