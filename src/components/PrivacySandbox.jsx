import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function PrivacySandbox({ onTextSanitized }) {
  const [inputText, setInputText] = useState(
    "Hi, my name is Arthur Pendragon. I live at 12 Camelot Lane in London, and I work at Excalibur Consulting. I'm feeling extremely overwhelmed with my workload and my phone number is +44 7911 123456."
  );
  const [sanitizedText, setSanitizedText] = useState('');
  const [detectedCount, setDetectedCount] = useState(0);

  // Simple client-side PII sanitization engine
  const sanitizePII = (text) => {
    let tempText = text;
    let count = 0;

    // Rules for scrubbing PII (regex based for demonstration)
    const patterns = [
      {
        name: 'USER',
        regex: /(Arthur Pendragon|John Doe|Sarah Kline|Arthur|John|Sarah)/gi,
      },
      {
        name: 'LOCATION',
        regex: /(12 Camelot Lane|London|Hanoi|Vietnam|Hanoi, Vietnam)/gi,
      },
      {
        name: 'COMPANY',
        regex: /(Excalibur Consulting|Google|Microsoft)/gi,
      },
      {
        name: 'CONTACT_NUM',
        regex: /(\+44\s?7911\s?123456|\+1\s?\(555\)\s?019-2834|\b\d{10,11}\b)/gi,
      },
      {
        name: 'EMAIL',
        regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
      },
      {
        name: 'CARD_NUM',
        regex: /(\b\d{4}-\d{4}-\d{4}-\d{4}\b|\b\d{16}\b)/g,
      }
    ];

    // Replace matches with HTML tags for highlighted UI, and string tokens for backend simulation
    patterns.forEach((pattern) => {
      const matches = tempText.match(pattern.regex);
      if (matches) {
        count += matches.length;
        // Deduplicate matches to prevent replacing replaces
        const uniqueMatches = [...new Set(matches)];
        uniqueMatches.forEach((match, index) => {
          const suffix = index > 0 ? `_${index + 1}` : '';
          const placeholder = `[${pattern.name}${suffix}]`;
          // Replace in raw text (case-insensitive replace)
          const escapedMatch = match.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          tempText = tempText.replace(new RegExp(escapedMatch, 'gi'), placeholder);
        });
      }
    });

    return { cleanedText: tempText, count };
  };

  useEffect(() => {
    const { cleanedText, count } = sanitizePII(inputText);
    setSanitizedText(cleanedText);
    setDetectedCount(count);
    if (onTextSanitized) {
      onTextSanitized(cleanedText);
    }
  }, [inputText, onTextSanitized]);

  // Render text with HTML tokens highlighted
  const renderHighlightedText = () => {
    if (!sanitizedText) return '';
    
    // Split text by tokens e.g. [USER], [LOCATION] etc. and map them to tags
    const tokenRegex = /(\[USER\]|\[USER_\d+\]|\[LOCATION\]|\[LOCATION_\d+\]|\[COMPANY\]|\[COMPANY_\d+\]|\[CONTACT_NUM\]|\[CONTACT_NUM_\d+\]|\[EMAIL\]|\[EMAIL_\d+\]|\[CARD_NUM\]|\[CARD_NUM_\d+\])/g;
    
    const parts = sanitizedText.split(tokenRegex);
    return parts.map((part, index) => {
      if (part.match(tokenRegex)) {
        return (
          <span key={index} className="pii-token">
            {part.replace('[', '').replace(']', '')}
          </span>
        );
      }
      return part;
    });
  };

  const loadSample = (type) => {
    if (type === 'work') {
      setInputText("My name is John Doe. I work at Microsoft in Hanoi, Vietnam. I'm feeling insecure about my team's restructuring. Reach me at john.doe@microsoft.com.");
    } else if (type === 'finance') {
      setInputText("I need help budgetting my debts. My Visa card is 4820-2918-3920-1122 and my email is sarah.kline@outlook.com. I spent $5,000 in London last month.");
    } else {
      setInputText("Hi, my name is Arthur Pendragon. I live at 12 Camelot Lane in London, and I work at Excalibur Consulting. I'm feeling extremely overwhelmed with my workload and my phone number is +44 7911 123456.");
    }
  };

  return (
    <div id="tour-privacy-sandbox" className="glass-panel privacy-panel">
      <div className="panel-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}>
        <div className="panel-title">
          <ShieldCheck className="panel-title-icon" size={20} />
          <h3>Privacy-First Sandbox</h3>
        </div>
        {detectedCount > 0 && (
          <span style={{ fontSize: '12px', background: 'rgba(253, 164, 175, 0.1)', color: 'var(--color-rose)', border: '1px solid rgba(253, 164, 175, 0.2)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '500' }}>
            Scrubbed {detectedCount} PII elements
          </span>
        )}
      </div>

      <p className="privacy-description">
        Before sending your private thoughts or journal entries to cloud-based LLM APIs, our local <strong>Privacy Guardrail Agent</strong> intercepts and tokenizes sensitive PII data directly in your browser.
      </p>

      <div className="sandbox-area">
        <div className="sandbox-input-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="sandbox-label">User Input (Private Device)</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => loadSample('default')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--color-violet)' }}>Sample 1</button>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>|</span>
              <button onClick={() => loadSample('work')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--color-violet)' }}>Sample 2</button>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>|</span>
              <button onClick={() => loadSample('finance')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--color-violet)' }}>Sample 3</button>
            </div>
          </div>
          <label htmlFor="privacy-sandbox-input" className="sr-only">Type your sensitive thoughts here</label>
          <textarea
            id="privacy-sandbox-input"
            name="privacyInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your sensitive thoughts here..."
          />
        </div>

        <div className="sandbox-output-box">
          <span className="sandbox-label">Anonymized Outbound Payload (Sent to Cloud LLM)</span>
          <div className="sanitized-preview">
            {renderHighlightedText()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <Info size={16} style={{ color: 'var(--color-violet)', flexShrink: 0, marginTop: '2px' }} />
        <span>
          Notice how names, emails, card numbers, locations, and companies are masked with placeholders. The Healer Agent can still interpret your emotional state and natal chart without knowing your actual private identity.
        </span>
      </div>
    </div>
  );
}
