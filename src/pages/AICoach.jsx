import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, Mic, RefreshCw, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { askAICoach } from '../services/geminiService';

export default function AICoach() {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName?.split(' ')[0] || 'Athlete';
  const environment = currentUser?.environment || 'Gym';
  const experience = currentUser?.experience || 'Beginner';
  const userId = currentUser?.uid || 'demo_user';

  const [inputMessage, setInputMessage] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hey ${userName}! 👋 I'm your AI Coach. Based on your profile (${environment} workouts, ${experience} level), I'm ready to craft your plans or answer any questions! How are you feeling today?`,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  // Load chat history from Supabase
  useEffect(() => {
    const loadSupabaseChats = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from('ai_chats')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.id,
            sender: item.sender,
            text: item.message_text,
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.warn("Supabase ai_chats fetch fallback:", err);
      }
    };

    loadSupabaseChats();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessageToSupabase = async (sender, text) => {
    try {
      await supabase.from('ai_chats').insert([
        {
          user_id: userId,
          sender: sender,
          message_text: text
        }
      ]);
    } catch (err) {
      console.warn("Supabase ai_chats insert warning:", err);
    }
  };

  // Quick Action Chips from Image 1
  const quickPrompts = [
    'I feel tired today',
    'Quick 5-min session',
    'Make it harder',
    'Suggest a recovery plan',
    'Home alternative for Bench Press',
    'Post-workout meal recommendation'
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    saveMessageToSupabase('user', query);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      // Call Gemini AI Assistant API
      const aiResponseText = await askAICoach(query, messages, currentUser);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      saveMessageToSupabase('ai', aiResponseText);
    } catch (e) {
      console.warn("Gemini Coach response error:", e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 140px)', paddingBottom: '20px' }}>
      {/* Top Coach Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(198, 255, 0, 0.12), rgba(19, 22, 31, 0.9))',
        border: '1px solid var(--border-active)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lime)'
          }}>
            <Sparkles size={24} color="#000" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>AI Fitness Coach</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
              ● Online • {environment} Routine Mode
            </span>
          </div>
        </div>

        <button 
          onClick={() => setMessages([{
            id: Date.now(),
            sender: 'ai',
            text: `Chat reset. What's on your mind today, ${userName}?`,
            time: 'Just now'
          }])}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Reset Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Greeting Title */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.2 }}>
          Hey, {userName}! <br />How are you feeling today?
        </h2>
      </div>

      {/* Quick Prompt Pill Matrix (Screenshot 1 Visuals) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {quickPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActivePrompt(promptText);
              handleSendMessage(promptText);
            }}
            className="prompt-chip"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '14px 18px',
              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: msg.sender === 'user' ? 'var(--accent-lime)' : 'var(--bg-card)',
              color: msg.sender === 'user' ? '#000000' : 'var(--text-primary)',
              border: msg.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none',
              fontWeight: msg.sender === 'user' ? 700 : 500,
              fontSize: '0.9rem',
              lineHeight: 1.45,
              boxShadow: msg.sender === 'user' ? 'var(--shadow-lime)' : 'var(--shadow-sm)'
            }}>
              {msg.sender === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--accent-lime)', fontSize: '0.72rem', fontWeight: 800 }}>
                  <Sparkles size={14} /> AI COACH
                </div>
              )}
              {msg.text}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Input Bar matching Screenshot 1 */}
      <div style={{
        position: 'sticky',
        bottom: '0',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 8px 6px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your coach anything..."
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />

        <button 
          onClick={() => handleSendMessage()}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--accent-lime)',
            color: '#000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lime)'
          }}
        >
          <Send size={18} color="#000" />
        </button>
      </div>
    </div>
  );
}
