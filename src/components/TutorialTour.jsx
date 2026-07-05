import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

const steps = [
  {
    title: 'Greetings, Traveler!',
    description: 'I am Lumi, your cosmic star guide. Together, we will map your soul and align your energy in complete safety. Let\'s walk through the stations of your Labyrinth!',
    target: null, // Centered
    bubbleText: 'Greetings, seeker! I am Lumi. I will be your guide today as we explore your inner constellations.'
  },
  {
    title: 'Cast Your Celestial Map',
    description: 'Enter your birth coordinates here. To guarantee precise calculations, search and select your city (shows exact coordinates) and use the custom AM/PM picker to match your exact chart.',
    target: '#tour-setup-card',
    position: 'left',
    bubbleText: 'Let\'s start by casting your birth coordinates so we can draw your real natal chart!'
  },
  {
    title: 'Constellation Labyrinth',
    description: 'This is the active map of your psyche. Unlocked nodes (Sun, Moon, Ascendant) light up immediately. Locked placements (Saturn, Mars) represent lessons you need to integrate.',
    target: '#tour-constellation-chart',
    position: 'right',
    bubbleText: 'This is the map of your psyche. Watch it light up when you cast your chart and solve riddles!'
  },
  {
    title: 'Sphinx\'s Riddle Gateway',
    description: 'Here, the Sphinx Agent tests your self-knowledge with poetic riddles based on your locked planetary placements. Successfully solving them unlocks your celestial nodes.',
    target: '#tour-sphinx-riddle',
    position: 'right',
    bubbleText: 'The Sphinx has set challenges for you. Think deeply to solve its riddles!'
  },
  {
    title: 'Healer\'s Hearth & Journal',
    description: 'Share your daily worries or write reflections here. The Healer Agent reads your transits (today\'s planetary weather) and offers poetic, soothing, and private advice.',
    target: '#tour-healer-journal',
    position: 'left',
    bubbleText: 'Write in this journal whenever you feel overwhelmed. I am here to listen and comfort you.'
  },
  {
    title: 'Tarot Sanctuary',
    description: 'Tap into the Tarot Sanctuary. Draw a 3-card spread (Past, Present, Future). The Oracle Agent will interpret your cards relative to your Scorpio Ascendant and Moon placements.',
    target: '#tour-tab-tarot',
    position: 'left',
    bubbleText: 'You can also consult the Tarot cards here. Let the Oracle Agent read your card path!'
  },
  {
    title: 'The Cosmic Conclave',
    description: 'Witness Multi-Agent Collaboration in action. Submit a life query and watch Healer, Sphinx, and Oracle debate, critique each other, and forge a synthesized Soul Alignment Blueprint.',
    target: '#tour-tab-conclave',
    position: 'left',
    bubbleText: 'Convene your agents here. Watch them cooperate to solve your life questions!'
  },
  {
    title: 'Local Privacy Guardrail',
    description: 'See the Privacy Filter Agent in action. It scrubs names, emails, contacts, and companies in real-time, sending only anonymized tokens to the cloud. You are fully secure.',
    target: '#tour-privacy-sandbox',
    position: 'left',
    bubbleText: 'Your privacy is my sacred duty. See how your personal details are safely masked here!'
  },
  {
    title: 'Ready to Explore',
    description: 'You are now ready to map your soul. Explore your chart, solve the Sphinx riddles, draw your Tarot cards, and converse with the Healer in absolute peace.',
    target: null, // Centered
    bubbleText: 'May the stars light your path, traveler. You are ready to begin!'
  }
];

export default function TutorialTour({ isOpen, onClose, onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({ display: 'none' });
  const [cardStyle, setCardStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    if (!step.target) {
      // Center card
      setHighlightStyle({ display: 'none' });
      setCardStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      });
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        setHighlightStyle({
          display: 'block',
          top: `${rect.top + scrollY - 6}px`,
          left: `${rect.left + scrollX - 6}px`,
          width: `${rect.width + 12}px`,
          height: `${rect.height + 12}px`,
          position: 'absolute'
        });

        let cardTop = rect.top + scrollY;
        let cardLeft = rect.left + scrollX;

        if (step.position === 'right') {
          cardLeft += rect.width + 24;
          if (cardLeft + 440 > window.innerWidth) {
            cardLeft = rect.left + scrollX + (rect.width / 2) - 220;
            cardTop += rect.height + 20;
          }
        } else if (step.position === 'left') {
          cardLeft -= 464;
          if (cardLeft < 0) {
            cardLeft = rect.left + scrollX + (rect.width / 2) - 220;
            cardTop += rect.height + 20;
          }
        }

        setCardStyle({
          top: `${cardTop}px`,
          left: `${cardLeft}px`,
          position: 'absolute',
          transform: 'none'
        });
      }, 300);
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const activeStep = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (onStepChange) onStepChange(next);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (onStepChange) onStepChange(prev);
    }
  };

  // Render the animated, transparent star mascot Lumi
  const renderLumiMascot = () => {
    return (
      <svg width="64" height="64" viewBox="0 0 100 100" className="mascot-svg-wrap" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <filter id="lumiGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Star Body */}
        <path
          d="M50 8 L63 36 L93 38 L70 59 L78 89 L50 73 L22 89 L30 59 L7 38 L37 36 Z"
          fill="url(#starGlow)"
          filter="url(#lumiGlow)"
          stroke="#d97706"
          strokeWidth="1.5"
        />

        {/* Blush Cheeks */}
        <circle cx="38" cy="54" r="4" fill="#fb7185" opacity="0.7" />
        <circle cx="62" cy="54" r="4" fill="#fb7185" opacity="0.7" />

        {/* Eyes (Blinking Animation) */}
        <g className="blink-animation">
          <circle cx="39" cy="47" r="3.5" fill="#0f172a" />
          <circle cx="61" cy="47" r="3.5" fill="#0f172a" />
          {/* Eye shines */}
          <circle cx="38" cy="45" r="1.2" fill="#fff" />
          <circle cx="60" cy="45" r="1.2" fill="#fff" />
        </g>

        {/* Happy Smile */}
        <path 
          d="M47 56 Q50 59 53 56" 
          fill="none" 
          stroke="#0f172a" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>
    );
  };

  return (
    <>
      <div 
        className="tour-overlay" 
        style={{
          background: activeStep.target ? 'transparent' : 'rgba(3, 2, 10, 0.88)',
          zIndex: activeStep.target ? 9997 : 9999
        }}
        onClick={onClose}
      ></div>
      <div className="tour-highlight" style={highlightStyle}></div>

      <div className="glass-panel tour-card" style={{ ...cardStyle, borderColor: 'var(--color-gold)' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>

        {/* Lumi Mascot Dialogue bubble */}
        <div className="mascot-container">
          <div className="mascot-avatar">
            {renderLumiMascot()}
          </div>
          <div className="mascot-bubble">
            {activeStep.bubbleText}
          </div>
        </div>

        <div className="tour-step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>

        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentStep === 0 || currentStep === steps.length - 1 ? <Sparkles size={18} style={{ color: 'var(--color-gold)' }} /> : null}
          {activeStep.title}
        </h4>

        <p style={{ fontSize: '13.5px' }}>{activeStep.description}</p>

        <div className="tour-footer">
          <button onClick={onClose} className="tour-nav-btn">
            Skip
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button onClick={handleBack} className="tour-nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button onClick={handleNext} className="tour-nav-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {currentStep === steps.length - 1 ? 'Start Exploration' : 'Next'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
