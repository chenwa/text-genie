import React, { useState, useRef, useEffect } from 'react';
import { callMessengerApi } from '../utils/api_utils';
import translations from '../pages/Translations';
import type { SupportedLang } from '../pages/Home';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MESSENGER_STORAGE_KEY = 'typinggenie_messenger_history';
const CONVERSATION_STORAGE_KEY = 'typinggenie_conversation_history';
const MAX_CONVERSATION_HISTORY = 20;

const Messenger: React.FC<{ isLoggedIn?: boolean; lang?: SupportedLang }> = ({ isLoggedIn, lang = 'en' }) => {
  const t = translations[lang];
  
  // Helper function to keep only the last N messages
  const limitConversationHistory = (messages: ConversationMessage[], limit: number): ConversationMessage[] => {
    return messages.slice(-limit);
  };
  
  // Load conversation history from localStorage
  const loadConversationHistory = (): ConversationMessage[] => {
    if (!isLoggedIn) return [];
    try {
      const saved = localStorage.getItem(CONVERSATION_STORAGE_KEY);
      const history = saved ? JSON.parse(saved) : [];
      return limitConversationHistory(history, MAX_CONVERSATION_HISTORY);
    } catch {
      return [];
    }
  };

  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>(loadConversationHistory);
  
  // Only persist/load messages if logged in
  const [messages, setMessages] = useState<Message[]>(() => {
    const greeting = t.greeting;
    if (isLoggedIn) {
      const saved = localStorage.getItem(MESSENGER_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [
            { id: 1, sender: 'ai', text: greeting }
          ];
        }
      }
      return [
        { id: 1, sender: 'ai', text: greeting }
      ];
    } else {
      return [
        { id: 1, sender: 'ai', text: greeting }
      ];
    }
  });
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

  // Persist messages and conversation history to localStorage on change
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(MESSENGER_STORAGE_KEY, JSON.stringify(messages));
      // Limit conversation history to MAX_CONVERSATION_HISTORY messages before storing
      const limitedHistory = limitConversationHistory(conversationHistory, MAX_CONVERSATION_HISTORY);
      localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(limitedHistory));
    }
  }, [messages, conversationHistory, isLoggedIn]);

  // Reset greeting and clear conversation history if language changes
  useEffect(() => {
    setMessages(prev => {
      // If the first message is the old greeting, replace it with the new one
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [{ id: 1, sender: 'ai', text: t.greeting }];
      }
      return prev;
    });
    // Clear conversation history when language changes to start fresh
    if (isLoggedIn) {
      setConversationHistory([]);
    }
    // eslint-disable-next-line
  }, [lang]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
    };
    
    // Add user message to conversation history
    const userConversationMsg: ConversationMessage = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      // Create new conversation history with the current user message
      const newConversationHistory = [...conversationHistory, userConversationMsg];
      
      // Call API with full conversation history (limited to last 20 messages)
      const limitedHistory = limitConversationHistory(newConversationHistory, MAX_CONVERSATION_HISTORY);
      const aiText = await callMessengerApi(limitedHistory);
      
      // Add AI response to conversation history
      const aiConversationMsg: ConversationMessage = {
        role: 'assistant',
        content: aiText
      };
      
      // Update conversation history with both user and AI messages, and limit to 20
      const updatedHistory = limitConversationHistory([...newConversationHistory, aiConversationMsg], MAX_CONVERSATION_HISTORY);
      setConversationHistory(updatedHistory);
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: aiText,
        },
      ]);
    } catch (e) {
      const errorMsg = 'Sorry, there was a problem connecting to the assistant.';
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: errorMsg,
        },
      ]);
      
      // Also add error to conversation history
      const errorConversationMsg: ConversationMessage = {
        role: 'assistant',
        content: errorMsg
      };
      setConversationHistory(prev => [...prev, userConversationMsg, errorConversationMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const clearConversation = () => {
    const greeting = t.greeting;
    setMessages([{ id: 1, sender: 'ai', text: greeting }]);
    setConversationHistory([]);
    if (isLoggedIn) {
      localStorage.setItem(MESSENGER_STORAGE_KEY, JSON.stringify([{ id: 1, sender: 'ai', text: greeting }]));
      localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify([]));
    }
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
        aria-label={visible ? 'Hide Messenger' : t.askGenie}
        title={visible ? 'Hide Messenger' : t.askGenie}
      >
        {visible ? '×' : <span role="img" aria-label="chat">💬</span>}
      {!visible && (
        <div style={{
          position: 'absolute',
          top: 11,
          right: 8 + 54 + 8 + 2 - 20 + 5, // moved right by 5px from previous -20
          color: 'var(--accent-blue)',
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          padding: '2px 10px',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          border: '1px solid var(--border-color)',
          boxShadow: '0 2px 4px var(--shadow-light)',
          whiteSpace: 'nowrap',
        }}>{t.askGenie}</div>
      )}
      </button>
      {visible && (
        <div
          className="messenger-container"
          style={{
            marginTop: 36,
            height: 700,
            width: 520,
            minWidth: 520,
            maxWidth: 520,
            ...(window.innerWidth <= 600 && window.navigator.maxTouchPoints > 0
              ? {
                  width: '100%',
                  minWidth: '100%',
                  maxWidth: '100%',
                  height: '80vh'
                }
              : {}),
          }}
        >
          <div className="messenger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="messenger-title" style={{padding: '0 1.2em', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400}}>
              <span style={{ fontSize: 30 }} role="img" aria-label="genie">🧞‍♂️</span>
              <span style={{ fontWeight: 400 }}>{t.brandName}</span>
            </h3>
            <button 
              onClick={clearConversation}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '0.8rem',
                marginRight: '0.5rem',
                position: 'relative',
                top: '-14px',
                left: '-30px'
              }}
              title="Clear conversation"
            >
              🗑️
            </button>
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
