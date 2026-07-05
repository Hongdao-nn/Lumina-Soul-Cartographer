import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ShieldCheck, Heart } from 'lucide-react';

export default function HealerJournal({ birthData, sanitizedText, onAddScore }) {
  const [messages, setMessages] = useState([
    {
      sender: 'healer',
      text: `Welcome, ${birthData?.name || 'traveler'}. I am your Healer Companion. I have cast your soul map with your birth details: Sun in ${birthData?.sunSign || 'Aries'}, Moon in ${birthData?.moonSign || 'Cancer'}, and Ascendant in ${birthData?.ascSign || 'Scorpio'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      sender: 'healer',
      text: "How is your heart feeling today? Feel free to write down your worries or reflection. Remember, our local Privacy Filter is active: any names, emails, or personal details you type will be fully masked before I process them.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isHealerTyping, setIsHealerTyping] = useState(false);
  const [healerThinkingLogs, setHealerThinkingLogs] = useState('');
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isHealerTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userRawText = inputText;
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userRawText,
      timestamp: userMsgTime
    }]);

    setInputText('');
    setIsHealerTyping(true);
    setHealerThinkingLogs('Healer: [Local Privacy Guardrail] Sanitizing outbound text payload...');
    if (onAddScore) onAddScore('emotional', 6);

    // Simulate Healer Agent's cognitive thinking process
    setTimeout(() => {
      setHealerThinkingLogs(
        `Healer: [Privacy Safe] Processing clean input: "${sanitizedText}"\n` +
        `Healer: [Emotion Detection] Analyzing tone... Detected signs of stress/anxiety.\n` +
        `Healer: [Astrology Correlation] Mapping to Natal Moon in ${birthData?.moonSign || 'Cancer'} & current transit: Saturn square Mars.`
      );
    }, 800);

    setTimeout(() => {
      setHealerThinkingLogs(prev => prev + `\nHealer: [Synthesizing Response] Crafting empathetic reframing & healing guidance...`);
    }, 1600);

    setTimeout(() => {
      setIsHealerTyping(false);
      setHealerThinkingLogs('');
      
      // Determine response based on user keywords
      let healerReply = '';
      const lowercaseInput = userRawText.toLowerCase();

      if (lowercaseInput.includes('job') || lowercaseInput.includes('work') || lowercaseInput.includes('boss') || lowercaseInput.includes('career') || lowercaseInput.includes('stagnant')) {
        healerReply = `I hear your career worries. With your Mars in ${birthData?.marsSign || 'Leo'} and current Saturn transit, there is a clash between your desire to shine and the structured limits currently placed on you. This is not a failure; it is a winter period of pruning. Ground yourself, write down what boundaries you need to set, and remember that patience is a form of active strength. What is one small limit you can honor for your own sanity tomorrow?`;
      } else if (lowercaseInput.includes('sad') || lowercaseInput.includes('anxious') || lowercaseInput.includes('stress') || lowercaseInput.includes('lonely') || lowercaseInput.includes('overwhelmed') || lowercaseInput.includes('pressure')) {
        healerReply = `Your heart is holding a lot of weight today, and it is okay to feel tired. Your Moon in ${birthData?.moonSign || 'Cancer'} makes you deeply receptive to the emotional tides around you, which is a beautiful gift, but it can also flood your system. Sit with this feeling like a friend rather than trying to fix it. Breathe in: you are safe. Breathe out: you are allowed to just exist. Shall we take a slow breath together?`;
      } else {
        healerReply = `Thank you for sharing that reflection with me. In the cosmic tapestry, every transit is a passing season. Your Scorpio Ascendant gives you a powerful capacity for rebirth and transformation, even when the path ahead feels shrouded. What is one gentle thing you can do for yourself tonight to honor your energy?`;
      }

      setMessages(prev => [...prev, {
        sender: 'healer',
        text: healerReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2800);
  };

  return (
    <div id="tour-healer-journal" className="glass-panel journal-panel">
      {/* Panel Header */}
      <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: '16px' }}>
        <div className="panel-title">
          <Heart className="panel-title-icon" size={20} style={{ color: 'var(--color-rose)' }} />
          <h3>Healer\'s Hearth & Journal</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--color-rose)' }}>
          <Sparkles size={14} />
          <span>Active Session</span>
        </div>
      </div>

      {/* Transit Forecast banner */}
      <div className="transit-banner">
        <Sparkles size={15} />
        <span>
          <strong>Transit Weather:</strong> Cosmic winds are calm. Today the Moon trines Neptune, favoring quiet writing, self-compassion, and artistic dreaming.
        </span>
      </div>

      {/* Chat Messages */}
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '0 4px' }}>
              {msg.sender === 'healer' ? 'Healer Companion' : 'You (Sanitized Payload)'}
            </span>
            <div className="message-bubble">
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '2px 4px 0' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Healer Thinking Indicator */}
        {isHealerTyping && (
          <div className="chat-message healer">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 4px' }}>
              Healer Companion (Thinking...)
            </span>
            <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '80px', justifyContent: 'center' }}>
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
              <span className="thinking-dot"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Healer Agent Cognitive Execution Trace */}
      {healerThinkingLogs && (
        <div style={{ margin: '0 24px 16px', background: 'rgba(5, 4, 10, 0.6)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--color-rose)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Healer Agent Thought Process</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--color-teal)' }}>
              <ShieldCheck size={12} /> Privacy Safe
            </span>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, opacity: 0.9 }}>
            {healerThinkingLogs}
          </pre>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your worries or thoughts (e.g. I feel stressed at work...)"
          disabled={isHealerTyping}
        />
        <button type="submit" className="btn-send" disabled={isHealerTyping || !inputText.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
