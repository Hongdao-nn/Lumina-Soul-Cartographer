import React, { useState, useRef } from 'react';
import { Sparkles, RefreshCw, Compass, Layers } from 'lucide-react';

// The Full 22 Major Arcana Deck definition with customized 3-topic meanings
const tarotDeck = [
  { name: 'The Fool', arcana: 'Major Arcana 0', keywords: 'New Beginnings, Faith, Spontaneity', color: '#38bdf8', meanings: {
    love: 'A fresh romantic chapter is unfolding. Trust your heart and take a leap of faith without fear.',
    career: 'A new venture or career path calls you. Embrace the unknown with curiosity and fresh eyes.',
    spiritual: 'A call to trust the universe completely. Leave behind baggage and step forward with pure faith.'
  }},
  { name: 'The Magician', arcana: 'Major Arcana I', keywords: 'Manifestation, Action, Willpower', color: '#fbbf24', meanings: {
    love: 'You have the conscious power to manifest the relationship you desire. Communicate clearly and act.',
    career: 'Your mental skills and tools are fully aligned. It is time to create and execute your plans.',
    spiritual: 'The universe reminds you: "As above, so below." Your thoughts are actively shaping reality.'
  }},
  { name: 'The High Priestess', arcana: 'Major Arcana II', keywords: 'Intuition, Secret Knowledge, Subconscious', color: '#a78bfa', meanings: {
    love: 'Do not rush into decisions. Listen to your inner voice to reveal the true intentions of others.',
    career: 'Look beyond the surface. Hidden opportunities or information will reveal themselves soon.',
    spiritual: 'Trust your dreams and subconscious signs. The sacred mysteries are whispering to you.'
  }},
  { name: 'The Empress', arcana: 'Major Arcana III', keywords: 'Abundance, Nurturing, Nature', color: '#2dd4bf', meanings: {
    love: 'A period of rich, nurturing connection. Your relationships flourish under care and warmth.',
    career: 'Creative abundance is flowing. A project you have nurtured is ready to grow and produce.',
    spiritual: 'Connect with Mother Earth. Healing and spiritual growth come from natural rhythms.'
  }},
  { name: 'The Emperor', arcana: 'Major Arcana IV', keywords: 'Structure, Authority, Control', color: '#fda4af', meanings: {
    love: 'Establish stability and clear boundaries. A relationship requires structure to succeed.',
    career: 'Take charge of your goals. Organization, leadership, and solid rules will secure your victory.',
    spiritual: 'Master your inner world. Discipline and structure are required to channel your spiritual gifts.'
  }},
  { name: 'The Hierophant', arcana: 'Major Arcana V', keywords: 'Tradition, Wisdom, Education', color: '#818cf8', meanings: {
    love: 'Seek a bond based on shared values and traditional respect. Look for deep alignment.',
    career: 'Study, learn, or follow established practices. A mentor or teacher will offer valuable guidance.',
    spiritual: 'A call to study ancient wisdom, sacred systems, or follow structured spiritual learning.'
  }},
  { name: 'The Lovers', arcana: 'Major Arcana VI', keywords: 'Alignment, Choices, Harmony', color: '#f472b6', meanings: {
    love: 'Deep emotional harmony and alignment are present. Make choices from a place of love, not fear.',
    career: 'A contract or collaboration requires perfect alignment of values. Choose partners wisely.',
    spiritual: 'Align your inner masculine and feminine forces. A choice is ahead that defines your soul path.'
  }},
  { name: 'The Chariot', arcana: 'Major Arcana VII', keywords: 'Willpower, Victory, Determination', color: '#60a5fa', meanings: {
    love: 'Stay in control of your emotional impulses. Drive your relationship forward with clear intent.',
    career: 'Victory is yours through focus and discipline. Coordinate conflicting elements to advance.',
    spiritual: 'The horses of mind and emotion pull in opposite directions. Master them to steer your path.'
  }},
  { name: 'Strength', arcana: 'Major Arcana VIII', keywords: 'Courage, Inner Power, Compassion', color: '#f59e0b', meanings: {
    love: 'Patience and gentle persuasion win the day. Tame conflict with love and soft boundaries.',
    career: 'Your quiet resilience is your greatest asset. Face challenges with calm, steady power.',
    spiritual: 'True strength comes from taming the wild ego. Radiate compassion to align your energy.'
  }},
  { name: 'The Hermit', arcana: 'Major Arcana IX', keywords: 'Solitude, Inner Guidance, Wisdom', color: '#34d399', meanings: {
    love: 'Take a brief step back. Reflect on what you truly value in bonds before seeking others.',
    career: 'Avoid the noise of collective opinions. Solitary reflection reveals your true direction.',
    spiritual: 'Silence is your sanctuary. Hold your lantern high and look inside for answers.'
  }},
  { name: 'Wheel of Fortune', arcana: 'Major Arcana X', keywords: 'Luck, Cycles, Destiny', color: '#fbbf24', meanings: {
    love: 'A fated shift is occurring. Trust the wheel of relationships as it spins toward alignment.',
    career: 'Change is in the air. A sudden opportunity or stroke of luck is steering you to a new cycle.',
    spiritual: 'Accept the seasonal cycles of life. The universe is orchestrating a fated spiritual shift.'
  }},
  { name: 'Justice', arcana: 'Major Arcana XI', keywords: 'Fairness, Truth, Karma', color: '#2dd4bf', meanings: {
    love: 'Be honest and fair with your partner. Truth resolves all emotional disputes.',
    career: 'Contracts, negotiations, or legal affairs will resolve fairly. Keep your integrity intact.',
    spiritual: 'You reap what you sow. Karmic alignment demands total honesty with yourself.'
  }},
  { name: 'The Hanged Man', arcana: 'Major Arcana XII', keywords: 'Surrender, Perspective, Pause', color: '#a78bfa', meanings: {
    love: 'Let go of the need to control. A period of waiting reveals the true shape of your connection.',
    career: 'A temporary pause or delay in plans. Use this time to look at your career from a new angle.',
    spiritual: 'Surrender your ego demands. A sacrifice or pause is necessary to gain higher vision.'
  }},
  { name: 'Death', arcana: 'Major Arcana XIII', keywords: 'Transformation, Endings, Rebirth', color: '#ec4899', meanings: {
    love: 'An old way of relating must end to clear the path for a much deeper, healthier connection.',
    career: 'Close a chapter that no longer serves you. A major professional rebirth is starting.',
    spiritual: 'A profound spiritual transformation. Let the old self shed like autumn leaves.'
  }},
  { name: 'Temperance', arcana: 'Major Arcana XIV', keywords: 'Balance, Moderation, Alchemy', color: '#38bdf8', meanings: {
    love: 'Practice patience, harmony, and compromises. Balance your emotions with clear communication.',
    career: 'A period of smooth integration. Merge different skills, teams, or goals gradually.',
    spiritual: 'You are mixing the waters of soul and body. Maintain balance to align your spiritual flow.'
  }},
  { name: 'The Devil', arcana: 'Major Arcana XV', keywords: 'Attachment, Shadow Self, Liberation', color: '#f43f5e', meanings: {
    love: 'Recognize toxic dependencies or obsessive patterns. Break free from unhealthy attachments.',
    career: 'Be careful of quick fixes, greed, or feeling trapped. You hold the keys to unlock your cage.',
    spiritual: 'Face your shadow self. Unmask the illusions and fears that keep you spiritually bound.'
  }},
  { name: 'The Tower', arcana: 'Major Arcana XVI', keywords: 'Sudden Upheaval, Revelation, Awakening', color: '#f59e0b', meanings: {
    love: 'A sudden change or collapse of illusions. Though painful, it forces a foundation of truth.',
    career: 'Unexpected disruption in plans. It breaks down weak structures so you can rebuild stronger.',
    spiritual: 'A lightning bolt of truth. Your ego structures shatter to reveal your divine essence.'
  }},
  { name: 'The Star', arcana: 'Major Arcana XVII', keywords: 'Hope, Faith, Healing', color: '#fda4af', meanings: {
    love: 'A period of healing and trust is arriving. Let go of past wounds and open your heart.',
    career: 'Inspiration is flowing. Trust that the universe is guiding you toward alignment.',
    spiritual: 'Your wishes are heard. Pour your energy into the cosmic pool and expect renewal.'
  }},
  { name: 'The Moon', arcana: 'Major Arcana XVIII', keywords: 'Illusion, Dreams, Intuition', color: '#818cf8', meanings: {
    love: 'Fears or anxieties may distort your view. Let intuition, not paranoia, guide your heart.',
    career: 'Uncertainty or lack of clarity. Avoid signing major deals; wait for the light of day.',
    spiritual: 'A journey into the deep dream realm. Listen to your intuition and symbolic visions.'
  }},
  { name: 'The Sun', arcana: 'Major Arcana XIX', keywords: 'Success, Joy, Vitality', color: '#fbbf24', meanings: {
    love: 'Pure warmth, happiness, and clarity. Your relationship is bathed in mutual joy and success.',
    career: 'Abundance, recognition, and energy. Your career plans are shining under positive solar rays.',
    spiritual: 'A period of high spiritual vitality, clarity, and enlightenment. Your path is fully lit.'
  }},
  { name: 'Judgement', arcana: 'Major Arcana XX', keywords: 'Rebirth, Calling, Absolution', color: '#2dd4bf', meanings: {
    love: 'Forgiveness and deep healing. A relationship undergoes a fated rebirth or decision point.',
    career: 'You are hearing a true calling. Assess your path and make a major choice with conviction.',
    spiritual: 'A call of the soul. Awaken to your true purpose and leave past mistakes behind.'
  }},
  { name: 'The World', arcana: 'Major Arcana XXI', keywords: 'Completion, Wholeness, Integration', color: '#38bdf8', meanings: {
    love: 'An emotional cycle reaches full, happy completion. You feel whole and aligned in love.',
    career: 'A major milestone, triumph, or project wrap-up. You have successfully achieved your goal.',
    spiritual: 'The ultimate state of integration. You are at one with the cosmos, a complete soul.'
  }}
];

// Dynamic SVG Illustrator Component for Lumi Tarot Art
function LumiTarotArtwork({ cardName, color }) {
  // Standard Lumi star path translated and scaled to fit the card top-center
  const renderLumiBase = (fillColor = '#fef08a', strokeColor = '#fbbf24') => (
    <g transform="translate(45, 60) scale(0.6)">
      {/* 8-pointed star mascot base */}
      <path d="M50 0 L63 37 L100 50 L63 63 L50 100 L37 63 L0 50 L37 37 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
      {/* Cute eyes */}
      <circle cx="42" cy="45" r="3" fill="#0f172a" />
      <circle cx="58" cy="45" r="3" fill="#0f172a" />
      {/* Curved smile */}
      <path d="M47 56 Q50 59 53 56" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );

  return (
    <svg viewBox="0 0 120 180" className="tarot-card-artwork" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id={`glow-${cardName.replace(/\s+/g, '')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Backdrop glowing gradient */}
      <rect x="0" y="0" width="120" height="180" fill={`url(#glow-${cardName.replace(/\s+/g, '')})`} />
      
      {/* Dynamic graphic details matching each card's archetype */}
      {cardName === 'The Fool' && (
        <>
          <path d="M10 160 L55 145 L95 170" stroke="#475569" strokeWidth="2" fill="none" />
          <circle cx="20" cy="30" r="1" fill="#fff" />
          <circle cx="100" cy="40" r="1" fill="#fff" />
          {renderLumiBase()}
          <line x1="45" y1="90" x2="25" y2="78" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="25" cy="78" r="5" fill="#f472b6" />
        </>
      )}

      {cardName === 'The Magician' && (
        <>
          <path d="M45 28 Q50 23 55 28 T65 28 Q70 33 65 38 T55 28" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <line x1="20" y1="135" x2="100" y2="135" stroke="#475569" strokeWidth="2" />
          <circle cx="35" cy="128" r="2.5" fill="#38bdf8" />
          <line x1="80" y1="126" x2="90" y2="132" stroke="#f472b6" strokeWidth="1.5" />
          {renderLumiBase()}
          <path d="M72 65 L78 35 L86 62 Z" fill="#a78bfa" />
          <line x1="40" y1="75" x2="25" y2="55" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="25" cy="55" r="2.5" fill="#fff" className="animate-pulse" />
        </>
      )}

      {cardName === 'The High Priestess' && (
        <>
          <rect x="15" y="40" width="8" height="100" fill="#fff" opacity="0.15" />
          <rect x="97" y="40" width="8" height="100" fill="#000" opacity="0.4" stroke="rgba(255,255,255,0.1)" />
          <path d="M40 30 A 15 15 0 1 1 80 30" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Empress' && (
        <>
          <circle cx="60" cy="50" r="28" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M45 42 L50 25 L60 32 L70 25 L75 42 Z" fill="#fbbf24" opacity="0.7" />
          {renderLumiBase()}
          <path d="M20 150 Q40 135 60 150 T100 150" stroke="#85e3b2" strokeWidth="1.5" fill="none" />
        </>
      )}

      {cardName === 'The Emperor' && (
        <>
          <rect x="30" y="55" width="60" height="90" rx="4" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.5" />
          {renderLumiBase()}
          <circle cx="28" cy="115" r="4" fill="#fbbf24" />
          <circle cx="92" cy="115" r="4" fill="#fbbf24" />
        </>
      )}

      {cardName === 'The Hierophant' && (
        <>
          <rect x="40" y="140" width="40" height="25" fill="none" stroke="#475569" strokeWidth="1.5" />
          <line x1="25" y1="50" x2="25" y2="120" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="18" y1="70" x2="32" y2="70" stroke="#818cf8" strokeWidth="1.5" />
          <line x1="15" y1="80" x2="35" y2="80" stroke="#818cf8" strokeWidth="1.5" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Lovers' && (
        <>
          <path d="M25 40 Q30 30 35 40 T45 40 Q50 50 35 60 T25 40" fill="#f472b6" opacity="0.3" />
          <path d="M85 50 Q90 40 95 50 T105 50 Q110 60 95 70 T85 50" fill="#f472b6" opacity="0.3" />
          {renderLumiBase()}
          <path d="M50 38 Q60 25 70 38 T90 38 Q100 52 70 70 T50 38" fill="#ec4899" opacity="0.5" />
        </>
      )}

      {cardName === 'The Chariot' && (
        <>
          <rect x="35" y="110" width="50" height="40" rx="4" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <path d="M35 120 C15 110 20 135 35 130 Z" fill="#64748b" />
          <path d="M85 120 C105 110 100 135 85 130 Z" fill="#64748b" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'Strength' && (
        <>
          <circle cx="60" cy="140" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Simple lion mane spikes */}
          <path d="M44 140 L38 140 M76 140 L82 140 M60 124 L60 118 M60 156 L60 162" stroke="#f59e0b" strokeWidth="1" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Hermit' && (
        <>
          <path d="M20 180 L60 142 L100 180" stroke="#475569" strokeWidth="2" fill="none" />
          {renderLumiBase()}
          <line x1="38" y1="100" x2="25" y2="115" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="25" cy="115" r="3" fill="#fff" className="animate-pulse" />
        </>
      )}

      {cardName === 'Wheel of Fortune' && (
        <>
          <circle cx="60" cy="90" r="35" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="60" y1="55" x2="60" y2="125" stroke="#fbbf24" strokeWidth="0.8" />
          <line x1="25" y1="90" x2="95" y2="90" stroke="#fbbf24" strokeWidth="0.8" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'Justice' && (
        <>
          <line x1="25" y1="55" x2="25" y2="105" stroke="#2dd4bf" strokeWidth="2" />
          <line x1="18" y1="65" x2="32" y2="65" stroke="#2dd4bf" strokeWidth="1.5" />
          <line x1="95" y1="55" x2="95" y2="95" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="85" y1="75" x2="105" y2="75" stroke="#fbbf24" strokeWidth="1" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Hanged Man' && (
        <>
          <line x1="60" y1="0" x2="60" y2="60" stroke="#a78bfa" strokeWidth="2" />
          {/* Render Hanged Lumi upside down */}
          <g transform="translate(60, 110) rotate(180)">
            {renderLumiBase('#fef08a', '#fbbf24')}
          </g>
        </>
      )}

      {cardName === 'Death' && (
        <>
          <path d="M15 150 Q50 120 90 145" stroke="#ec4899" strokeWidth="1.5" fill="none" />
          <line x1="90" y1="40" x2="30" y2="140" stroke="#ec4899" strokeWidth="2" />
          <path d="M90 40 C75 55 60 40 45 45" stroke="#ec4899" strokeWidth="1.5" fill="none" />
          {renderLumiBase('#e2e8f0', '#94a3b8')}
        </>
      )}

      {cardName === 'Temperance' && (
        <>
          <path d="M25 80 Q20 100 25 120" stroke="#38bdf8" strokeWidth="1" fill="none" />
          <path d="M95 80 Q100 100 95 120" stroke="#38bdf8" strokeWidth="1" fill="none" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Devil' && (
        <>
          <path d="M30 150 Q60 140 90 150" stroke="#f43f5e" strokeWidth="1" fill="none" />
          {renderLumiBase('#fda4af', '#f43f5e')}
          {/* Tiny devil horns */}
          <path d="M52 58 Q48 45 42 50" stroke="#f43f5e" strokeWidth="2" fill="none" />
          <path d="M68 58 Q72 45 78 50" stroke="#f43f5e" strokeWidth="2" fill="none" />
        </>
      )}

      {cardName === 'The Tower' && (
        <>
          <rect x="42" y="70" width="36" height="90" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <path d="M38 70 L60 50 L82 70 Z" fill="#475569" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Lightning bolt */}
          <path d="M95 20 L75 60 L85 62 L65 95" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Star' && (
        <>
          <ellipse cx="60" cy="155" rx="30" ry="10" fill="none" stroke="#fda4af" strokeWidth="1" />
          <g transform="translate(60, 38) scale(0.65)">
            <path d="M0 -30 L7 -7 L30 0 L7 7 L0 30 L-7 7 L-30 0 L-7 -7 Z" fill="#fff" opacity="0.8" className="animate-pulse" />
          </g>
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Moon' && (
        <>
          <circle cx="95" cy="40" r="18" fill="none" stroke="#818cf8" strokeWidth="1.5" />
          <path d="M95 22 A 18 18 0 0 0 113 40 A 13 13 0 0 1 95 22 Z" fill="#818cf8" opacity="0.6" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The Sun' && (
        <>
          {/* Radiating sunburst rays */}
          <g stroke="#fbbf24" strokeWidth="1" opacity="0.4">
            <line x1="60" y1="90" x2="60" y2="20" />
            <line x1="60" y1="90" x2="60" y2="160" />
            <line x1="60" y1="90" x2="10" y2="90" />
            <line x1="60" y1="90" x2="110" y2="90" />
            <line x1="60" y1="90" x2="20" y2="50" />
            <line x1="60" y1="90" x2="100" y2="130" />
            <line x1="60" y1="90" x2="100" y2="50" />
            <line x1="60" y1="90" x2="20" y2="130" />
          </g>
          {renderLumiBase()}
        </>
      )}

      {cardName === 'Judgement' && (
        <>
          <path d="M60 20 L60 45 M50 35 L70 35" stroke="#2dd4bf" strokeWidth="1.5" />
          <ellipse cx="60" cy="150" rx="25" ry="8" fill="none" stroke="#475569" strokeWidth="1" />
          {renderLumiBase()}
        </>
      )}

      {cardName === 'The World' && (
        <>
          {/* Laurel wreath around Lumi */}
          <ellipse cx="60" cy="90" rx="36" ry="50" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
          {renderLumiBase()}
        </>
      )}
    </svg>
  );
}

export default function TarotSanctuary({ onAddScore, onSaveTarot }) {
  const [topic, setTopic] = useState('spiritual'); // Default 'spiritual' | 'love' | 'career'
  const [shuffling, setShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  const [flipped, setFlipped] = useState([false, false, false]);
  const [oracleReading, setOracleReading] = useState(null);
  const [oracleLogs, setOracleLogs] = useState([]);
  const [isOracleReading, setIsOracleReading] = useState(false);

  // Synchronous ref to prevent click-to-render hover race conditions on flipped cards
  const flippedRef = useRef([false, false, false]);

  // 3D card tilt styles state
  const [tiltStyles, setTiltStyles] = useState([{}, {}, {}]);

  const handleMouseMove = (e, index) => {
    if (flippedRef.current[index]) return; // Synchronous ref gate prevents tilt style overrides after click
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 16;
    const rotateY = ((x - centerX) / centerX) * 16;
    
    setTiltStyles(prev => {
      const next = [...prev];
      next[index] = {
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`,
        zIndex: 10
      };
      return next;
    });
  };

  const handleMouseLeave = (index) => {
    if (flippedRef.current[index]) return;
    setTiltStyles(prev => {
      const next = [...prev];
      next[index] = {
        transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
        zIndex: 1
      };
      return next;
    });
  };

  // Fisher-Yates Shuffle Algorithm for mathematically perfect, duplicate-free draw selection
  const shuffleAndDraw = () => {
    setShuffling(true);
    setOracleReading(null);
    setOracleLogs([]);
    setFlipped([false, false, false]);
    flippedRef.current = [false, false, false];
    setDrawnCards([]);
    setTiltStyles([{}, {}, {}]);
    if (onAddScore) onAddScore('intuitive', 2);

    setTimeout(() => {
      const deckCopy = [...tarotDeck];
      // Shuffle the deck completely
      for (let i = deckCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = deckCopy[i];
        deckCopy[i] = deckCopy[j];
        deckCopy[j] = temp;
      }
      
      // Select first 3 unique cards
      const selected = deckCopy.slice(0, 3);
      setDrawnCards(selected);
      setShuffling(false);
    }, 1800);
  };

  const handleFlipCard = (index) => {
    if (shuffling || drawnCards.length === 0) return;
    flippedRef.current[index] = true; // Set ref synchronously to block any incoming mousemove event immediately
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
    
    // Clear tilt style for this card so it flips properly!
    setTiltStyles(prev => {
      const next = [...prev];
      next[index] = {};
      return next;
    });

    if (onAddScore) onAddScore('intuitive', 5);

    // If all cards are flipped, execute Oracle synthesis
    if (newFlipped.every(val => val === true)) {
      triggerOracleReading(drawnCards);
    }
  };

  const triggerOracleReading = (cards) => {
    setIsOracleReading(true);
    const logs = [
      `[Oracle] Initiating Tarot alignment sweep...`,
      `[Oracle] Active topic query: "${topic.toUpperCase()}"`,
      `[Oracle] Reading drawn deck coordinates: Past=${cards[0].name}, Present=${cards[1].name}, Future=${cards[2].name}`,
      `[Oracle] Calculating card-to-card transitional aspects...`
    ];

    setOracleLogs([logs[0]]);
    setTimeout(() => setOracleLogs(prev => [...prev, logs[1]]), 500);
    setTimeout(() => setOracleLogs(prev => [...prev, logs[2]]), 1000);
    setTimeout(() => setOracleLogs(prev => [...prev, logs[3]]), 1500);

    setTimeout(() => {
      setIsOracleReading(false);
      
      const p1 = `Your journey originates from the lesson of ${cards[0].name} in your past, representing a foundation of ${cards[0].keywords.toLowerCase()}. The transition from this past state has led you directly into the energy of your present card, ${cards[1].name}. This transition signifies that the raw experiences of your past are now ready to be processed and calibrated under the influence of ${cards[1].keywords.toLowerCase()}.`;
      const p2 = `Currently, you are actively integrating the present lesson of ${cards[1].name}. By doing so, you are establishing the necessary clarity to step toward your future path, guided by ${cards[2].name}. The wisdom of ${cards[1].name} serves as a bridge, ensuring you do not leap blindly into the future, but rather walk forward with the conscious awareness of ${cards[2].keywords.toLowerCase()}.`;
      
      let p3 = '';
      if (topic === 'love') {
        p3 = `In matters of the heart and relationships, the progression from ${cards[0].name} to ${cards[2].name} calls for a complete emotional alignment. Releasing old karmic attachments will open your heart, allowing you to establish a relationship built on mutual balance and future inspiration.`;
      } else if (topic === 'career') {
        p3 = `For your professional goals and career, this transition indicates structural renewal. The disruptions or structures of the past are paving the way for focused current actions, leading directly to a future state of growth, patience, and eventual achievement. Align your daily decisions with this path.`;
      } else {
        p3 = `Spiritually, this is a sacred alchemy of the soul. You are refining the raw materials of past lessons, passing them through the lens of present truth, and opening your consciousness to receive the high-frequency wisdom and hope offered by your future card. Trust this guidance.`;
      }

      const interpretation = {
        past: cards[0].meanings[topic] || cards[0].meanings.spiritual,
        present: cards[1].meanings[topic] || cards[1].meanings.spiritual,
        future: cards[2].meanings[topic] || cards[2].meanings.spiritual,
        synthesisTitle: `Oracle Synthesis: The Path from ${cards[0].name} to ${cards[2].name}`,
        synthesisP1: p1,
        synthesisP2: p2,
        synthesisP3: p3
      };
      setOracleReading(interpretation);
    }, 2200);
  };

  return (
    <div id="tour-tarot-sanctuary" className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1, position: 'relative' }}>
      <div className="panel-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="panel-title">
          <Layers className="panel-title-icon" size={20} style={{ color: 'var(--color-gold)' }} />
          <h3>Tarot Sanctuary</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--color-gold)' }}>
          <Sparkles size={14} />
          <span>Oracle Deck</span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        Select a query topic below. The Oracle Agent will interpret your 3-card spread (Lumi Star Mascot Edition) relative to your natal birth coordinates.
      </p>

      {/* Topic selection chips */}
      {!shuffling && drawnCards.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            Choose Topic Theme
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'love', label: '💖 Love & Bonds' },
              { id: 'career', label: '💼 Career & Purpose' },
              { id: 'spiritual', label: '🌀 Spiritual Path' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                style={{
                  flexGrow: 1,
                  background: topic === t.id ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${topic === t.id ? 'var(--color-gold)' : 'var(--border-light)'}`,
                  color: topic === t.id ? 'var(--color-gold)' : 'var(--text-muted)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shuffle Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          className="btn-tour animate-pulse" 
          onClick={shuffleAndDraw} 
          disabled={shuffling} 
          style={{ 
            color: 'var(--color-gold)', 
            background: 'rgba(251, 191, 36, 0.08)', 
            borderColor: 'rgba(251, 191, 36, 0.35)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 28px', 
            borderRadius: '8px',
            fontSize: '13.5px'
          }}
        >
          <RefreshCw size={16} className={shuffling ? 'animate-spin' : ''} />
          {shuffling ? 'Shuffling Sacred Deck...' : drawnCards.length > 0 ? 'Shuffle & Draw Again' : 'Shuffle & Deal Cards'}
        </button>
      </div>

      {/* Card Shuffling Physical Pile Animation */}
      {shuffling && (
        <div className="card-shuffling-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px', position: 'relative' }}>
          <div className="card-pile-item pile-item-1"></div>
          <div className="card-pile-item pile-item-2"></div>
          <div className="card-pile-item pile-item-3"></div>
          <span style={{ position: 'absolute', bottom: 10, fontSize: '12px', color: 'var(--color-gold)', fontStyle: 'italic', zIndex: 10 }}>
            Shuffling stars...
          </span>
        </div>
      )}

      {/* Card Deal out Layout */}
      {drawnCards.length > 0 && !shuffling && (
        <div className="tarot-spread-layout" style={{ animation: 'fadeIn 0.5s' }}>
          {drawnCards.map((card, idx) => {
            const isCardFlipped = flipped[idx];
            const positionLabel = idx === 0 ? 'Past' : idx === 1 ? 'Present' : 'Future';
            
            return (
              <div key={idx} className="tarot-card-container deal-slide-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <span className="tarot-position-label" style={{ color: card.color }}>{positionLabel}</span>
                <div 
                  className={`tarot-card tarot-card-3d ${isCardFlipped ? 'flipped' : ''}`}
                  onClick={() => !isCardFlipped && handleFlipCard(idx)}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  style={{ 
                    width: '100px', 
                    height: '154px',
                    ...tiltStyles[idx]
                  }}
                >
                  {/* Face Down */}
                  <div className="tarot-card-back" style={{ background: 'radial-gradient(circle at center, #1e133c 0%, #0c081f 100%)' }}>
                    <div className="tarot-card-inner-glow"></div>
                    <Compass size={24} style={{ color: 'rgba(251, 191, 36, 0.25)', animation: 'spin 8s infinite linear' }} />
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>LUMINA</span>
                  </div>

                  {/* Face Up - Vector SVG Artwork */}
                  <div className="tarot-card-front" style={{ borderColor: card.color, padding: '6px' }}>
                    <span style={{ fontSize: '7.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{card.arcana}</span>
                    <h4 style={{ color: card.color, fontFamily: 'var(--font-display)', margin: '2px 0', fontSize: '10.5px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</h4>
                    
                    {/* SVG Image */}
                    <div className="tarot-card-svg-box" style={{ width: '100%', height: '80px', margin: '4px 0', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <LumiTarotArtwork cardName={card.name} color={card.color} />
                    </div>

                    <span style={{ fontSize: '7.5px', color: 'var(--text-bright)', fontStyle: 'italic', display: 'block', textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{card.keywords}"
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Oracle execution trace log */}
      {isOracleReading && (
        <div style={{ background: 'rgba(5, 4, 10, 0.6)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--color-gold)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Oracle Agent Execution Trace
          </div>
          {oracleLogs.map((log, index) => (
            <div key={index} style={{ marginBottom: '4px', opacity: 0.85 }}>
              {log}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span className="thinking-dot"></span>
            <span className="thinking-dot"></span>
            <span className="thinking-dot"></span>
          </div>
        </div>
      )}

      {/* Detailed Oracle Reading result */}
      {oracleReading && !shuffling && (
        <div className="glass-panel" style={{ background: 'rgba(251, 191, 36, 0.02)', borderColor: 'rgba(251, 191, 36, 0.2)', padding: '18px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.5s' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Oracle Card Alignment
          </h4>
          <div style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.5' }}>
            <p><strong>🛡️ Past - {drawnCards[0].name}:</strong> {oracleReading.past}</p>
            <p><strong>⚙️ Present - {drawnCards[1].name}:</strong> {oracleReading.present}</p>
            <p><strong>🔮 Future - {drawnCards[2].name}:</strong> {oracleReading.future}</p>
            
            <div style={{ borderTop: '1px dashed rgba(251, 191, 36, 0.18)', paddingTop: '14px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-bright)', fontSize: '13px' }}>
              <h5 style={{ color: 'var(--color-gold)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
                {oracleReading.synthesisTitle}
              </h5>
              <p>{oracleReading.synthesisP1}</p>
              <p>{oracleReading.synthesisP2}</p>
              <p style={{ fontStyle: 'italic', color: '#fff', borderLeft: '2px solid var(--color-gold)', paddingLeft: '10px' }}>{oracleReading.synthesisP3}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end', marginTop: '4px' }}>
            {onSaveTarot && (
              <button
                onClick={() => onSaveTarot({
                  topic,
                  cards: [drawnCards[0].name, drawnCards[1].name, drawnCards[2].name],
                  reading: oracleReading
                })}
                style={{
                  background: 'rgba(45, 212, 191, 0.1)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  color: 'var(--color-teal)',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Save to Archive
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => {
                setDrawnCards([]);
                setOracleReading(null);
              }}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              Clear & Choose New Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
