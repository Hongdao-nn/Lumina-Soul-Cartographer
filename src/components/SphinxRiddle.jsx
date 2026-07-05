import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SphinxRiddle({ 
  selectedNode, 
  unlockedNodes, 
  onUnlockNode,
  birthData,
  onAddScore
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [thinkingLogs, setThinkingLogs] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [personalAnalysis, setPersonalAnalysis] = useState('');

  // Canvas & Particles for Decryption explosion
  const sphinxCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const canvasAnimRef = useRef(null);

  useEffect(() => {
    const canvas = sphinxCanvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }, [selectedNode]);

  const triggerPortalExplosion = () => {
    const canvas = sphinxCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#a78bfa', '#fbbf24', '#f59e0b', '#c084fc', '#ffffff', '#2dd4bf'];
    
    const particles = [];
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018
      });
    }
    particlesRef.current = particles;

    if (!canvasAnimRef.current) {
      const tick = () => {
        const p = particlesRef.current;
        if (p.length === 0) {
          canvasAnimRef.current = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current = p.filter(part => {
          part.x += part.vx;
          part.y += part.vy;
          part.vx *= 0.97;
          part.vy *= 0.97;
          part.alpha -= part.decay;
          
          if (part.alpha <= 0) return false;
          
          ctx.globalAlpha = part.alpha;
          ctx.fillStyle = part.color;
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });

        ctx.globalAlpha = 1.0;
        canvasAnimRef.current = requestAnimationFrame(tick);
      };
      canvasAnimRef.current = requestAnimationFrame(tick);
    }
  };

  const riddles = {
    Sun: {
      title: 'SUN IDENTITY DECRYPTION',
      question: 'What is your core life purpose, passion, or creative outlet that makes you feel most alive?',
      note: 'Sun governs your core identity, ego, and life force. Aligning it unlocks your true path.',
      placeholder: 'Describe your core passion...'
    },
    Moon: {
      title: 'MOON EMOTIONAL DECRYPTION',
      question: 'How do you nurture your emotional self and find comfort when you feel deeply hurt or vulnerable?',
      note: 'Moon governs your emotional body, instincts, and security. Nurturing it brings inner peace.',
      placeholder: 'Describe your emotional comfort...'
    },
    Ascendant: {
      title: 'ASCENDANT PERSONA DECRYPTION',
      question: 'What is the first impression people usually have of you, and how does it differ from your true inner self?',
      note: 'Ascendant governs your outer mask, presentation, and first defense. Aligning it bridges your inner and outer worlds.',
      placeholder: 'Describe your outer persona and inner truth...'
    },
    Mars: {
      title: 'MARS DRIVE DECRYPTION',
      question: 'How do you personally handle fear, hesitation, or procrastination when taking a major risk in your life?',
      note: 'Mars in Leo governs creative risk-taking, willpower, and pride. Procrastination is often Leo\'s fear of not being perfect.',
      placeholder: 'Describe your personal way of taking action...'
    },
    Saturn: {
      title: 'SATURN STRUCTURE DECRYPTION',
      question: 'What is a consistent daily habit, boundary, or personal rule you use to keep yourself structured and accountable?',
      note: 'Saturn in Capricorn governs structure, patience, and long-term goals. It rewards structured routines.',
      placeholder: 'Describe your daily rule or grounding habit...'
    },
    Mercury: {
      title: 'MERCURY COGNITION DECRYPTION',
      question: 'How do you filter out information noise, social media clutter, and refocus your mind when you feel mentally overwhelmed?',
      note: 'Mercury in Gemini governs communication, agility, and cognitive filters. When scattered, it needs mental focus.',
      placeholder: 'Describe your method for mental focus...'
    },
    Venus: {
      title: 'VENUS ALIGNMENT DECRYPTION',
      question: 'What is one specific boundary, saying "no" habit, or self-care practice you use to protect your self-worth in relationships?',
      note: 'Venus in Taurus governs attraction, values, and self-worth. It flourishes when security is guarded.',
      placeholder: 'Describe how you protect your self-worth...'
    },
    Jupiter: {
      title: 'JUPITER EXPANSION DECRYPTION',
      question: 'How do you reframe a recent failure, setback, or mistake into a constructive learning opportunity?',
      note: 'Jupiter in Sagittarius governs luck, philosophy, and optimism. It turns structural failures into spiritual wisdom.',
      placeholder: 'Describe your growth mindset approach...'
    }
  };

  const activeRiddleKey = ['Sun', 'Moon', 'Ascendant', 'Mars', 'Saturn', 'Mercury', 'Venus', 'Jupiter'].includes(selectedNode) ? selectedNode : null;
  const activeRiddle = activeRiddleKey ? riddles[activeRiddleKey] : null;
  const isUnlocked = activeRiddleKey ? unlockedNodes.includes(activeRiddleKey) : false;

  useEffect(() => {
    setAnswer('');
    setFeedback(null);
    setThinkingLogs([]);
    setDecryptProgress(0);
    setIsThinking(false);
    setPersonalAnalysis('');
  }, [selectedNode]);

  // Semantic Analyzer Engine (client-side matching based on user reflection input)
  const analyzeReflection = (nodeKey, textInput) => {
    const text = textInput.toLowerCase();
    let theme = 'default';
    
    // Categorize response themes semantically
    if (text.includes('step') || text.includes('split') || text.includes('slow') || text.includes('little') || text.includes('gradual') || text.includes('chunk')) {
      theme = 'paced';
    } else if (text.includes('no') || text.includes('limit') || text.includes('people') || text.includes('away') || text.includes('phone') || text.includes('boundary') || text.includes('friend')) {
      theme = 'boundaries';
    } else if (text.includes('write') || text.includes('meditate') || text.includes('breathe') || text.includes('read') || text.includes('music') || text.includes('quiet') || text.includes('nature') || text.includes('walk')) {
      theme = 'reflective';
    } else if (text.includes('schedule') || text.includes('routine') || text.includes('time') || text.includes('habit') || text.includes('morning') || text.includes('early')) {
      theme = 'structural';
    } else if (text.includes('learn') || text.includes('grow') || text.includes('next') || text.includes('positive') || text.includes('try') || text.includes('future') || text.includes('fail')) {
      theme = 'growth';
    }

    const analyses = {
      Sun: {
        paced: `Your Sun Node aligns through paced creative expression. Giving yourself permission to build your legacy step-by-step shines light into your labyrinth.`,
        boundaries: `Your Sun Node aligns through creative boundaries. Protecting your identity from external projections lets your core life force burn brightly.`,
        reflective: `Your Sun Node aligns through self-reflection. Meditating on your core identity allows your true purpose to rise beyond ego.`,
        structural: `Your Sun Node aligns through disciplined routine. Establishing daily habits helps manifest your creative passion.`,
        growth: `Your Sun Node aligns through continuous growth. Embracing challenges as learning experiences fuels your vital ego with optimism.`,
        default: `Your Sun Node is decrypted. Your core identity is aligned, lighting the path ahead in your soul labyrinth.`
      },
      Moon: {
        paced: `Your Moon Node aligns through gradual emotional processing. Allowing yourself to feel vulnerability in small chunks heals your inner child.`,
        boundaries: `Your Moon Node aligns through strict emotional boundaries. Protecting your sensitive inner world prevents emotional overwhelm.`,
        reflective: `Your Moon Node aligns through quiet self-nurturing. Reflective journaling and nature walks bring comfort and restore your inner sanctuary.`,
        structural: `Your Moon Node aligns through emotional routines. Grounding your instincts in steady daily habits pacifies anxiety.`,
        growth: `Your Moon Node aligns through emotional growth. Embracing your shadows and setbacks transforms vulnerability into profound empathy.`,
        default: `Your Moon Node is decrypted. Your emotional body is aligned, bringing quiet peace to your inner child.`
      },
      Ascendant: {
        paced: `Your Ascendant Node aligns through paced presentation. Revealing your true inner self step-by-step bridges your outer mask with your core truth.`,
        boundaries: `Your Ascendant Node aligns through shielding. Setting strong boundaries protects your persona without isolating your soul.`,
        reflective: `Your Ascendant Node aligns through reflective self-awareness. Realizing the difference between your mask and your truth brings balance.`,
        structural: `Your Ascendant Node aligns through structured authenticity. Projecting a professional, grounded character protects your vulnerability.`,
        growth: `Your Ascendant Node aligns through developmental self-expression. Transforming your social mask into a vessel for spiritual growth completes your alignment.`,
        default: `Your Ascendant Node is decrypted. Your outer persona and inner psyche are bridged in perfect alignment.`
      },
      Mars: {
        paced: `Your Leo Mars drive aligns through paced action. Breaking down risks bypasses Leo's fear of public failure, allowing your natural flame to spark safely.`,
        boundaries: `Your Leo Mars drive aligns through strong boundaries. By protecting your personal creative space, you fuel your active fire without draining your energy.`,
        reflective: `Your Leo Mars drive aligns through reflective meditation. Calming your fiery Leo ego helps you take risks based on pure heart rather than external validation.`,
        structural: `Your Leo Mars drive aligns through structural planning. Directing your Leo fire into a strict timetable keeps procrastination at bay.`,
        growth: `Your Leo Mars drive aligns through a growth mindset. Viewing challenges as stepping stones releases performance anxiety and lets your passion shine.`,
        default: `Your Leo Mars drive is decrypted. By expressing your willpower and taking actions aligned with your heart, you unlock your core passion.`
      },
      Saturn: {
        paced: `Your Capricorn Saturn lessons align through steady pacing. Long-term goals are achieved by daily persistence, turning structural boundaries into pathways.`,
        boundaries: `Your Capricorn Saturn lessons align through strict boundaries. Setting limits on external demands allows you to focus on your deep soul duties.`,
        reflective: `Your Capricorn Saturn lessons align through reflective practices. Solitude helps you synthesize life lessons and embrace Saturn's wisdom.`,
        structural: `Your Capricorn Saturn lessons align through structural routines. Consistently repeating positive habits stabilizes your energy and builds long-term success.`,
        growth: `Your Capricorn Saturn lessons align through viewing limits as growth. Hard truths become your foundation for long-term structures.`,
        default: `Your Capricorn Saturn lessons are decrypted. Embracing daily structure and accountability turns fears into solid wisdom.`
      },
      Mercury: {
        paced: `Your Gemini Mercury cognition aligns through pacing thoughts. Taking information in slow chunks prevents mental overstimulation and anchors focus.`,
        boundaries: `Your Gemini Mercury cognition aligns through mental boundaries. Filtering out digital noise and disconnecting restores your communication clarity.`,
        reflective: `Your Gemini Mercury cognition aligns through quiet reflection. Journaling or meditating calms the Gemini chatter, enabling truth to emerge.`,
        structural: `Your Gemini Mercury cognition aligns through mental routines. Setting specific times to study or write keeps your Gemini intellect sharp and focused.`,
        growth: `Your Gemini Mercury cognition aligns through curiosity and learning. Reframing noise into specific lessons sharpens your intellectual drive.`,
        default: `Your Gemini Mercury cognition is decrypted. Calming mental noise and focusing your intellect aligns your expressive truth.`
      },
      Venus: {
        paced: `Your Taurus Venus attraction aligns through gradual trust. Slow pacing stabilizes your heart and keeps your emotional worth protected.`,
        boundaries: `Your Taurus Venus attraction aligns through strong boundaries. Saying 'no' to toxic elements protects your self-worth and secures Taurus's comfort.`,
        reflective: `Your Taurus Venus attraction aligns through quiet self-care. Grounding practices in nature or cozy spaces anchor your self-value.`,
        structural: `Your Taurus Venus attraction aligns through structured values. Allocating resources to your own wellness shows Venus that you value your worth.`,
        growth: `Your Taurus Venus attraction aligns through heart growth. Treating relationship setbacks as self-discovery lessons expands your capacity to receive love.`,
        default: `Your Taurus Venus attraction is decrypted. Nurturing your self-worth attracts connections that truly match your values.`
      },
      Jupiter: {
        paced: `Your Sagittarius Jupiter wisdom aligns through pacing goals. Philosophical expansion happens step-by-step, turning luck into a continuous journey.`,
        boundaries: `Your Sagittarius Jupiter wisdom aligns through boundaries. Saying 'no' to scattered ideas directs your Sagittarius vision toward meaningful growth.`,
        reflective: `Your Sagittarius Jupiter wisdom aligns through spiritual reflection. Reframing failures quietly turns setbacks into deep wisdom.`,
        structural: `Your Sagittarius Jupiter wisdom aligns through structured philosophy. Grounding your beliefs in daily routines manifests new opportunities.`,
        growth: `Your Sagittarius Jupiter wisdom aligns through optimism. Embracing setbacks as spiritual tuition unlocks Jupiter's alignment.`,
        default: `Your Sagittarius Jupiter wisdom is decrypted. Viewing obstacles as lessons aligns your mind with luck and expansion.`
      }
    };

    return analyses[nodeKey]?.[theme] || analyses[nodeKey]?.default;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeRiddle || isUnlocked || isThinking || !answer.trim()) return;

    // Check if reflection is too short
    if (answer.trim().length < 4) {
      setFeedback({
        type: 'error',
        message: 'DECRYPTION FAILURE: Input reflection too brief. Sincere self-inquiry required (minimum 4 characters).'
      });
      return;
    }

    setIsThinking(true);
    setDecryptProgress(0);
    setFeedback(null);
    setThinkingLogs([`[SYSTEM] Connecting to ${activeRiddleKey} placement...`]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDecryptProgress(progress);

      if (progress === 30) {
        setThinkingLogs(prev => [...prev, `[DECRYPTER] Analyzing semantic sentiment of reflection...`]);
      } else if (progress === 60) {
        setThinkingLogs(prev => [...prev, `[DECRYPTER] Calibrating to ${birthData?.birthPlace || 'Hanoi'} sidereal time...`]);
      } else if (progress === 90) {
        setThinkingLogs(prev => [...prev, `[DECRYPTER] Injecting personalized alignment parameters...`]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsThinking(false);
        
        // Analyze and generate empathetic reflection analysis
        const analysis = analyzeReflection(activeRiddleKey, answer);
        setPersonalAnalysis(analysis);
        
        setFeedback({
          type: 'success',
          message: `DECRYPTION SUCCESSFUL: Node ${activeRiddleKey} aligned.`
        });
        
        onUnlockNode(activeRiddleKey);
        if (onAddScore) onAddScore('logical', 15);
        triggerPortalExplosion();
      }
    }, 120);
  };

  // Helper to draw progress bar
  const getProgressBar = () => {
    const filled = Math.floor(decryptProgress / 10);
    const empty = 10 - filled;
    return `[${'■'.repeat(filled)}${'□'.repeat(empty)}] ${decryptProgress}%`;
  };

  return (
    <div 
      id="tour-sphinx-riddle" 
      className={`glass-panel sphinx-panel ${feedback?.type === 'error' ? 'shake-animation border-red' : ''} ${feedback?.type === 'success' ? 'border-teal' : ''}`} 
      style={{ flexGrow: 1, padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative scanline laser */}
      <div className="terminal-scanline"></div>

      {/* Spark Particle Explosion Canvas */}
      <canvas 
        ref={sphinxCanvasRef} 
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
      />



      <div className="panel-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}>
        <div className="panel-title">
          <Terminal className="panel-title-icon" size={20} style={{ color: isUnlocked ? 'var(--color-teal)' : 'var(--color-violet)' }} />
          <h3 style={{ fontSize: '15px', letterSpacing: '0.8px', fontFamily: 'var(--font-display)' }}>
            SPHINX DECRYPTION CONSOLE
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', fontWeight: '600' }}>
          <span style={{ color: isUnlocked ? 'var(--color-teal)' : activeRiddle ? 'var(--color-gold)' : 'var(--text-muted)' }}>
            STATUS: {isUnlocked ? 'DECRYPTED' : activeRiddle ? 'AWAITING REFLECTION' : 'STANDBY'}
          </span>
        </div>
      </div>

      {activeRiddle ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Decryption Header */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: `3px solid ${isUnlocked ? 'var(--color-teal)' : 'var(--color-gold)'}` }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Decrypt Target
            </span>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-bright)', marginTop: '2px' }}>
              {activeRiddle.title}
            </h4>
          </div>

          {/* Sincere Reflection Challenge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--text-bright)', lineHeight: '1.45' }}>
              <strong>Self-Inquiry Challenge:</strong> {activeRiddle.question}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '6px' }}>
              💡 {activeRiddle.note}
            </p>
          </div>

          {/* Decrypted Personal Analysis Box */}
          {isUnlocked ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '18px', background: 'rgba(45, 212, 191, 0.04)', border: '1px solid rgba(45, 212, 191, 0.25)', borderRadius: '10px', animation: 'fadeIn 0.5s' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--color-teal)', fontWeight: 'bold', fontSize: '14px' }}>
                <CheckCircle size={20} />
                <span>ACCESS GRANTED: {activeRiddleKey} ALIGNED</span>
              </div>
              
              <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.45', background: 'rgba(5, 4, 10, 0.3)', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid var(--color-teal)' }}>
                {personalAnalysis || `Your ${activeRiddleKey} drive is fully decrypted. The node is aligned with your chart parameters.`}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                The constellation map on the left has been activated with your self-knowledge.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Command line prompt input */}
              <div className="terminal-input-row" style={{ display: 'flex', alignItems: 'center', background: 'rgba(5, 4, 10, 0.7)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2px 14px' }}>
                <span style={{ color: 'var(--color-gold)', fontFamily: 'var(--mono)', fontSize: '13px', marginRight: '8px', userSelect: 'none' }}>
                  REFLECT &gt;
                </span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={activeRiddle.placeholder}
                  disabled={isThinking}
                  style={{
                    flexGrow: 1,
                    background: 'none',
                    border: 'none',
                    padding: '10px 0',
                    fontSize: '13.5px',
                    fontFamily: 'var(--mono)',
                    color: 'var(--text-bright)',
                    boxShadow: 'none'
                  }}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isThinking || !answer.trim()}
                  style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    color: 'var(--color-gold)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--mono)'
                  }}
                >
                  DECRYPT
                </button>
              </div>

              {/* Progress Scanner bar */}
              {isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(5, 4, 10, 0.5)', padding: '12px', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--color-teal)', fontWeight: 'bold' }}>
                    {getProgressBar()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {thinkingLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Error alerts */}
              {feedback?.type === 'error' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '12px 16px', borderRadius: '8px', color: '#f43f5e', fontSize: '13px' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--mono)' }}>{feedback.message}</span>
                </div>
              )}
            </form>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', border: '1px dashed var(--border-light)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)', textAlign: 'center', padding: '20px' }}>
          <Shield size={36} className="animate-pulse" style={{ color: 'var(--border-light)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            SCANNER STANDBY
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
            Select a locked constellation star node (Mercury, Venus, Mars, Saturn, Jupiter) on the map above to start decryption calibration.
          </p>
        </div>
      )}
    </div>
  );
}
