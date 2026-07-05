import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Heart, Layers, Play, HelpCircle, Volume2, VolumeX, Shield, FileText, Check, Copy, X } from 'lucide-react';

const sampleQueries = [
  "Should I quit my stable job to launch a startup?",
  "I want to make a confession to a friend, but fear losing the friendship.",
  "I feel extremely burned out, anxious, and stuck in a rut. What do I do?"
];

export default function CosmicConclave({ onAddScore, onSaveDecree }) {
  const [query, setQuery] = useState('');
  const [conclaveActive, setConclaveActive] = useState(false);
  const [debateMessages, setDebateMessages] = useState([]);
  const [orchestratorLogs, setOrchestratorLogs] = useState([]);
  const [step, setStep] = useState(0);
  const [blueprint, setBlueprint] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  
  // New features state
  const [temperament, setTemperament] = useState('balanced'); // 'intuitive' | 'balanced' | 'rational'
  const [isWaitingForIntervention, setIsWaitingForIntervention] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null); // 'healer' | 'sphinx'
  const [isMuted, setIsMuted] = useState(false);
  const [showDecree, setShowDecree] = useState(false);
  const [copied, setCopied] = useState(false);

  // Web Audio Synth references
  const audioCtxRef = useRef(null);
  const ambientOscsRef = useRef([]);
  const ambientGainRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debateMessages, orchestratorLogs, isWaitingForIntervention]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  // Web Audio API Synthesizer Engine
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext not supported in this environment');
    }
    audioCtxRef.current = new AudioContextClass();
  };

  const startAmbient = () => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      stopAmbient();

      // Detuned dual oscillators (Saw + Triangle) through low-pass for celestial wind pad
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.value = 65.41; // C2
      osc2.frequency.value = 65.71; // detuned slightly

      filter.type = 'lowpass';
      filter.frequency.value = 130;

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.0); // smooth fade in

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ambientOscsRef.current = [osc1, osc2];
      ambientGainRef.current = gainNode;
    } catch (e) {
      console.warn('Audio Context failed to start:', e);
    }
  };

  const stopAmbient = () => {
    if (ambientGainRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        ambientGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        const oscs = ambientOscsRef.current;
        setTimeout(() => {
          oscs.forEach(osc => {
            try { osc.stop(); } catch {}
          });
        }, 600);
      } catch {}
      ambientOscsRef.current = [];
      ambientGainRef.current = null;
    }
  };

  const playChime = React.useCallback((freqs = [528, 659, 783]) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      freqs.forEach((f, index) => {
        const time = ctx.currentTime + index * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 1.1);
      });
    } catch {}
  }, [isMuted]);

  const playDrone = React.useCallback((freq = 82.41) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch {}
  }, [isMuted]);

  const playSparkle = React.useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const freqs = [880, 987, 1046, 1174, 1318, 1567];
      freqs.forEach((f, index) => {
        const time = ctx.currentTime + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
      });
    } catch {}
  }, [isMuted]);

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      // Wait for React state update before starting ambient
      setTimeout(() => startAmbient(), 50);
    } else {
      setIsMuted(true);
      stopAmbient();
    }
  };

  // Branching Dialogue Script Generator
  const generateAgentScript = React.useCallback((userQuery) => {
    const q = userQuery.toLowerCase();
    let category = 'personal';
    if (q.includes('job') || q.includes('quit') || q.includes('business') || q.includes('startup') || q.includes('money') || q.includes('career') || q.includes('work') || q.includes('study') || q.includes('learn') || q.includes('boss')) {
      category = 'career';
    } else if (q.includes('love') || q.includes('friend') || q.includes('marry') || q.includes('relationship') || q.includes('dating') || q.includes('breakup') || q.includes('confess') || q.includes('family')) {
      category = 'relationship';
    }

    // Dynamic prefixes based on Temperament
    const healerPrefix = temperament === 'intuitive' 
      ? "Seeker, as the lead voice of this council, I urge you to look deeply at emotional safety. " 
      : "Seeker, I hear the vulnerability in your question. ";
    
    const sphinxPrefix = temperament === 'rational'
      ? "Seeker, I must enforce absolute rational command over this council. "
      : "I must offer a rigorous logical critique to Healer. ";

    const baseScripts = {
      career: {
        healer1: `${healerPrefix}Your question about "${userQuery}" highlights a tension between your soul's growth and rigid current structures. Burnout is a warning from your nervous system. Forcing transitions before your emotional body feels aligned leads to exhaustion. Secure your peace first. Do not force decisions when you are depleted.`,
        sphinx1: `${sphinxPrefix}Safety without movement is simply stagnation. To address your career query: "${userQuery}", you need concrete metrics, not coddling. You must design a risk-mitigation plan: calculate a 6-month budget, set specific weekly milestones, and hold yourself accountable. Focus and discipline conquer fear.`,
        
        // Branch 1: Healer Path Selected
        healerBranch: "Traveler, I honor your decision to support emotional alignment. Forcing a startup or pivot purely out of logical desperation will reconstruct the same burnout. Let us prioritize soft milestones and nervous system rest first. Oracle, what card guides this healing path?",
        oracleHealer: "To guide this aligned path, I draw Major Arcana XVII: The Star. The Star represents fated rejuvenation and cosmic hope. Your career query is answered: slow down, heal your mind, and trust that structure will flow naturally from a rested vessel.",
        blueprintHealer: {
          emotional: "Divine Rest: Prioritize immediate recovery, disconnect from career stressors, and establish absolute safety.",
          structural: "Soft boundaries: Schedule light daily practices of journaling and self-compassion to prevent creative blockages.",
          karmic: "Rejuvenation path: Leverage the light of The Star to guide your recovery toward a fated vocational alignment."
        },

        // Branch 2: Sphinx Path Selected
        sphinxBranch: "Traveler, a mature decision. Action is the only antidote to fear. Since you choose the path of discipline, we will structure your action. We will map out your exact timeline. Oracle, what card guides this structured path?",
        oracleSphinx: "To guide this active path, I draw Major Arcana IV: The Emperor. The Emperor represents structure, authority, and command. Your career query is answered: take charge of your path, build a daily routine, and execute with discipline.",
        blueprintSphinx: {
          emotional: "Logical safety: Understand that action creates peace. Build a strict financial roadmap to quiet the survival ego.",
          structural: "Empowerment: Dedicate 2 focused hours daily to execute your transition goals. Track milestones on a physical dashboard.",
          karmic: "Structural rule: Leverage the authority of The Emperor to master your destiny with discipline."
        }
      },
      relationship: {
        healer1: `${healerPrefix}Your connection query about "${userQuery}" reveals a heart carrying fear of rejection. Relationships are mirrors of our internal state. Do not rush to expose your soul if your nervous system is screaming. Retreat to your inner sanctuary. True connection flows from self-compassion, not scarcity.`,
        sphinx1: `${sphinxPrefix}Confusion is resolved by absolute clarity, not retreat. To address "${userQuery}", you must logically analyze reciprocity. Communication is a tool of respect. State your boundaries clearly to them, and note if they align. Empathy without limits is self-sacrifice.`,
        
        // Branch 1: Healer Path
        healerBranch: "Traveler, I honor your choice to lead with vulnerability and heart-safety. If you build boundaries with defensive armor, you prevent connection. Let us cultivate a soft, open sanctuary. Oracle, what card guides this vulnerable path?",
        oracleHealer: "To guide this empathic path, I draw Major Arcana XIV: Temperance. Temperance represents balance, patient blending, and alchemy. Your query is answered: practice patient, balanced listening, and let connections evolve naturally without force.",
        blueprintHealer: {
          emotional: "Heart recovery: Retreat from relational tension. Spend time in nature to regulate your nervous system.",
          structural: "Refined communication: Share your feelings as a soft offering of truth, rather than demanding an immediate answer.",
          karmic: "Balanced alchemy: Leverage Temperance to blend vulnerability with peace, attracting harmonious connections."
        },

        // Branch 2: Sphinx Path
        sphinxBranch: "Traveler, a wise choice. Standing firm in your worth prevents codependency. Since you choose discipline, we must formulate your boundaries clearly. Oracle, what card guides this self-respecting path?",
        oracleSphinx: "To guide this boundary path, I draw Major Arcana XI: Justice. Justice represents truth, fairness, and karma. Your query is answered: seek absolute truth. Communcate your boundaries clearly and observe if their actions balance the scales.",
        blueprintSphinx: {
          emotional: "Emotional boundary: Separate your emotional state from their projections. Your worth is independent of their reactions.",
          structural: "Active negotiation: Schedule a specific, structured conversation to declare your limits and notice if reciprocity is met.",
          karmic: "Scales of truth: Leverage Justice to clear toxic attachments, ensuring only balanced, fair relationships remain."
        }
      },
      personal: {
        healer1: `${healerPrefix}I sense profound overwhelm in your query: "${userQuery}". You are treating yourself as a machine. Burnout and stagnation are your soul's forced pause when boundaries have been ignored. I urge you to collapse safely. Do not force progress; rest.`,
        sphinx1: `${sphinxPrefix}Prolonged collapse breeds deeper stagnation. To overcome "${userQuery}", you must take action. Break down your overwhelming thoughts into a list of micro-tasks. Complete one small task daily to restore control. Focus is your shield.`,
        
        // Branch 1: Healer Path
        healerBranch: "Traveler, I honor your choice to surrender to rest. Running on empty leads to burnout. Let us allow your battery to fully recharge in a protected space of self-care. Oracle, what card guides this healing retreat?",
        oracleHealer: "To guide this sacred pause, I draw Major Arcana XVII: The Star. The Star represents hope, inspiration, and divine healing. Your query is answered: accept this winter period, rest your body, and let the stars heal your spirit.",
        blueprintHealer: {
          emotional: "Nervous regulation: Rest in a safe space. Practice a daily 20-minute digital detox to recover mental clarity.",
          structural: "Nurturing routine: Integrate 1 small self-care habit (like a warm bath or breathing exercises) as a non-negotiable routine.",
          karmic: "Divine hope: Leverage the light of The Star to wash away self-judgment, knowing rest is essential for your future growth."
        },

        // Branch 2: Sphinx Path
        sphinxBranch: "Traveler, a mature decision. Action is what breaks fear. Since you choose structure, we will design your micro-goals to slowly rebuild your cognitive momentum. Oracle, what card guides this active progress?",
        oracleSphinx: "To guide this focused path, I draw Major Arcana VII: The Chariot. The Chariot represents willpower, control, and triumph over stagnation. Your query is answered: take the reins, focus your mind, and drive forward with small daily tasks.",
        blueprintSphinx: {
          emotional: "Focus safety: Realize that structured progress quiets anxiety. Create a clean physical environment to focus your mind.",
          structural: "Micro-dosages: List 3 minor daily goals, schedule them in your calendar, and tick them off one-by-one.",
          karmic: "Active steer: Leverage The Chariot to balance opposing thoughts, driving your willpower toward steady triumph."
        }
      }
    };

    return baseScripts[category];
  }, [temperament]);

  const runConclave = (e) => {
    try {
      e.preventDefault();
      if (!query.trim()) return;

      setConclaveActive(true);
      setDebateMessages([]);
      setOrchestratorLogs([]);
      setBlueprint(null);
      setActiveAgent(null);
      setSelectedPath(null);
      setIsWaitingForIntervention(false);
      
      // Start Web Audio Ambient Drone safely
      try {
        startAmbient();
      } catch (audioErr) {
        console.warn('Celestial synth failed to start:', audioErr);
      }
      
      setStep(1);
      if (onAddScore) onAddScore('intuitive', 4);
    } catch (conclaveErr) {
      console.error('Conclave execution failed:', conclaveErr);
    }
  };

  // Conclave debate cycle effect
  useEffect(() => {
    if (step === 0) return;

    const script = generateAgentScript(query);

    if (step === 1) {
      setActiveAgent('Healer');
      setOrchestratorLogs([
        `[Orchestrator] Conclave convened (Temperament: ${temperament.toUpperCase()}) for query: "${query}"`,
        `[Orchestrator] Speech Token granted to Healer Agent...`
      ]);
      
      // Trigger warm sine chimes for Healer
      playChime([528, 659, 783]);

      const timeout = setTimeout(() => {
        setDebateMessages([{
          agent: 'Healer',
          color: 'var(--color-rose)',
          text: script.healer1
        }]);
        setStep(2);
      }, 2500);
      return () => clearTimeout(timeout);
    }

    else if (step === 2) {
      setActiveAgent('Sphinx');
      
      const logTimeout = setTimeout(() => {
        setOrchestratorLogs(prev => [
          ...prev,
          `[Orchestrator] Healer Agent analysis registered.`,
          `[Orchestrator] Speech token passed to Sphinx Agent for logical critique...`
        ]);
        // Low triangle drone for Sphinx
        playDrone(82.41);
      }, 500);

      const msgTimeout = setTimeout(() => {
        setDebateMessages(prev => [
          ...prev,
          {
            agent: 'Sphinx',
            color: 'var(--color-purple)',
            text: script.sphinx1
          }
        ]);
        // Pause debate to wait for Seeker's Intervention
        setIsWaitingForIntervention(true);
        setActiveAgent(null);
      }, 2800);

      return () => {
        clearTimeout(logTimeout);
        clearTimeout(msgTimeout);
      };
    }

    // Branching transition after selection
    else if (step === 3) {
      const activeName = selectedPath === 'healer' ? 'Healer' : 'Sphinx';
      const activeColor = selectedPath === 'healer' ? 'var(--color-rose)' : 'var(--color-purple)';
      const activeText = selectedPath === 'healer' ? script.healerBranch : script.sphinxBranch;

      setActiveAgent(activeName);
      setOrchestratorLogs(prev => [
        ...prev,
        `[Orchestrator] Seeker intervention registered: Supporting ${activeName} Path.`,
        `[Orchestrator] Speech token passed to ${activeName} for resolution...`
      ]);

      if (selectedPath === 'healer') {
        playChime([528, 622, 698]);
      } else {
        playDrone(98.0);
      }

      const timeout = setTimeout(() => {
        setDebateMessages(prev => [
          ...prev,
          {
            agent: activeName,
            color: activeColor,
            text: activeText
          }
        ]);
        setStep(4);
      }, 2800);
      return () => clearTimeout(timeout);
    }

    else if (step === 4) {
      setActiveAgent('Oracle');
      setOrchestratorLogs(prev => [
        ...prev,
        `[Orchestrator] Debate resolved. Speech token passed to Oracle Agent for synthesis...`
      ]);

      // Twinkling arpeggios for Oracle
      playSparkle();

      const cardText = selectedPath === 'healer' ? script.oracleHealer : script.oracleSphinx;

      const timeout = setTimeout(() => {
        setDebateMessages(prev => [
          ...prev,
          {
            agent: 'Oracle',
            color: 'var(--color-gold)',
            text: cardText
          }
        ]);
        setStep(5);
      }, 2800);
      return () => clearTimeout(timeout);
    }

    else if (step === 5) {
      setActiveAgent(null);
      setOrchestratorLogs(prev => [
        ...prev,
        `[Orchestrator] Oracle synthesis completed. Formatting Soul Alignment Blueprint...`,
        `[Orchestrator] Conclave dissolved. Blueprint ready.`
      ]);

      playSparkle();

      const targetBlueprint = selectedPath === 'healer' ? script.blueprintHealer : script.blueprintSphinx;

      const timeout = setTimeout(() => {
        setBlueprint({
          title: 'Personalized Cosmic Decree',
          emotional: targetBlueprint.emotional,
          structural: targetBlueprint.structural,
          karmic: targetBlueprint.karmic
        });
        setStep(0);
        stopAmbient();
      }, 2200);
      return () => clearTimeout(timeout);
    }
  }, [step, selectedPath, query, temperament, playChime, playDrone, playSparkle, generateAgentScript]);

  const getAgentColor = (agentName) => {
    if (agentName === 'Healer') return 'var(--color-rose)';
    if (agentName === 'Sphinx') return 'var(--color-purple)';
    if (agentName === 'Oracle') return 'var(--color-gold)';
    return 'var(--color-violet)';
  };

  // Seeker's decision input handler
  const handleIntervention = (choice) => {
    setSelectedPath(choice);
    setIsWaitingForIntervention(false);
    setStep(3);
    if (onAddScore) {
      if (choice === 'healer') {
        onAddScore('emotional', 15);
      } else if (choice === 'sphinx') {
        onAddScore('logical', 15);
      }
    }
  };

  const handleCopyDecree = () => {
    const textToCopy = `
========================================
       COSMIC ALIGNMENT DECREE
========================================
Seeker Query: "${query}"
Conclave Focus: ${temperament.toUpperCase()} ALIGNMENT

🛡️ HEALER PATHWAY (EMOTIONAL):
${blueprint?.emotional}

⚙️ SPHINX PATHWAY (STRUCTURAL):
${blueprint?.structural}

🌟 INTEGRATED BLUEPRINT (ORACLE):
${blueprint?.karmic}
========================================
LUMINA - The Soul Cartographer
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tour-conclave-panel" className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '540px', position: 'relative' }}>
      <div className="panel-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="panel-title">
          <Terminal className="panel-title-icon" size={20} style={{ color: 'var(--color-violet)' }} />
          <h3>The Cosmic Conclave</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Mute toggle button */}
          {conclaveActive && (
            <button 
              onClick={handleToggleMute} 
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', color: 'var(--color-violet)', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={isMuted ? 'Unmute celestial synth' : 'Mute celestial synth'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--color-violet)', fontWeight: 'bold' }}>
            <Sparkles size={14} />
            <span>Multi-Agent Collab</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        Convene a meeting of your inner archetypes. The Healer, the Sphinx, and the Oracle will debate your query, critique each other, and forge a customized synthesis.
      </p>

      {/* Holographic Chamber Visualizer */}
      {conclaveActive && (
        <div className="glass-panel conclave-chamber-container" style={{ padding: '16px 0', background: 'rgba(18, 12, 38, 0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.15)', overflow: 'hidden' }}>
          <svg viewBox="0 0 200 180" style={{ width: '220px', height: '190px' }}>
            <circle cx="100" cy="90" r="60" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="90" r="40" fill="none" stroke="rgba(168, 85, 247, 0.08)" strokeWidth="0.8" />
            
            {/* Connective Laser Beams */}
            <line x1="40" y1="60" x2="100" y2="90" stroke={activeAgent === 'Healer' ? 'var(--color-rose)' : 'rgba(255,255,255,0.05)'} strokeWidth={activeAgent === 'Healer' ? '2.5' : '1'} strokeDasharray={activeAgent === 'Healer' ? '5 3' : 'none'} className={activeAgent === 'Healer' ? 'laser-beam-pulse' : ''} />
            <line x1="160" y1="60" x2="100" y2="90" stroke={activeAgent === 'Sphinx' ? 'var(--color-purple)' : 'rgba(255,255,255,0.05)'} strokeWidth={activeAgent === 'Sphinx' ? '2.5' : '1'} strokeDasharray={activeAgent === 'Sphinx' ? '5 3' : 'none'} className={activeAgent === 'Sphinx' ? 'laser-beam-pulse' : ''} />
            <line x1="100" y1="150" x2="100" y2="90" stroke={activeAgent === 'Oracle' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)'} strokeWidth={activeAgent === 'Oracle' ? '2.5' : '1'} strokeDasharray={activeAgent === 'Oracle' ? '5 3' : 'none'} className={activeAgent === 'Oracle' ? 'laser-beam-pulse' : ''} />
            
            {/* Center Speech Token */}
            <g transform="translate(100, 90)" className="spinning-speech-token">
              <circle cx="0" cy="0" r="14" fill="#0f0926" stroke={activeAgent ? getAgentColor(activeAgent) : 'rgba(168, 85, 247, 0.4)'} strokeWidth="2" style={{ filter: `drop-shadow(0 0 6px ${activeAgent ? getAgentColor(activeAgent) : 'transparent'})` }} />
              <polygon points="0,-5 4,3 -4,3" fill={activeAgent ? getAgentColor(activeAgent) : 'rgba(168, 85, 247, 0.6)'} transform="scale(0.8)" />
            </g>
            
            {/* Agent 1: Healer */}
            <g transform="translate(40, 60)" className={`agent-node ${activeAgent === 'Healer' ? 'active-pulse' : ''}`}>
              <circle cx="0" cy="0" r="18" fill="#12081d" stroke="var(--color-rose)" strokeWidth="2" style={{ filter: activeAgent === 'Healer' ? 'drop-shadow(0 0 8px var(--color-rose))' : 'none' }} />
              <path d="M-5 -4 A 4 4 0 0 1 5 -4 Q5 2 0 8 T-5 -4 Z" fill="none" stroke="var(--color-rose)" strokeWidth="1.5" transform="translate(0, -2) scale(0.65)" />
              {activeAgent === 'Healer' && (
                <g transform="translate(0, 24)" className="hologram-waves">
                  <rect x="-10" y="-3" width="1.5" height="6" fill="var(--color-rose)" />
                  <rect x="-5" y="-5" width="1.5" height="10" fill="var(--color-rose)" />
                  <rect x="0" y="-7" width="1.5" height="14" fill="var(--color-rose)" />
                  <rect x="5" y="-5" width="1.5" height="10" fill="var(--color-rose)" />
                  <rect x="10" y="-3" width="1.5" height="6" fill="var(--color-rose)" />
                </g>
              )}
              <text x="0" y="-22" textAnchor="middle" fill="var(--color-rose)" fontSize="8.5" fontFamily="var(--mono)" fontWeight="bold">HEALER</text>
            </g>
            
            {/* Agent 2: Sphinx */}
            <g transform="translate(160, 60)" className={`agent-node ${activeAgent === 'Sphinx' ? 'active-pulse' : ''}`}>
              <circle cx="0" cy="0" r="18" fill="#12081d" stroke="var(--color-purple)" strokeWidth="2" style={{ filter: activeAgent === 'Sphinx' ? 'drop-shadow(0 0 8px var(--color-purple))' : 'none' }} />
              <path d="M-5 -3 L-2 -3 M5 3 L2 3 M-4 1 L2 -1" stroke="var(--color-purple)" strokeWidth="1.5" fill="none" transform="scale(0.8)" />
              {activeAgent === 'Sphinx' && (
                <g transform="translate(0, 24)" className="hologram-waves">
                  <rect x="-10" y="-3" width="1.5" height="6" fill="var(--color-purple)" />
                  <rect x="-5" y="-5" width="1.5" height="10" fill="var(--color-purple)" />
                  <rect x="0" y="-7" width="1.5" height="14" fill="var(--color-purple)" />
                  <rect x="5" y="-5" width="1.5" height="10" fill="var(--color-purple)" />
                  <rect x="10" y="-3" width="1.5" height="6" fill="var(--color-purple)" />
                </g>
              )}
              <text x="0" y="-22" textAnchor="middle" fill="var(--color-purple)" fontSize="8.5" fontFamily="var(--mono)" fontWeight="bold">SPHINX</text>
            </g>
            
            {/* Agent 3: Oracle */}
            <g transform="translate(100, 150)" className={`agent-node ${activeAgent === 'Oracle' ? 'active-pulse' : ''}`}>
              <circle cx="0" cy="0" r="18" fill="#12081d" stroke="var(--color-gold)" strokeWidth="2" style={{ filter: activeAgent === 'Oracle' ? 'drop-shadow(0 0 8px var(--color-gold))' : 'none' }} />
              <polygon points="0,-7 6,0 0,7 -6,0" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" transform="scale(0.75)" />
              {activeAgent === 'Oracle' && (
                <g transform="translate(0, 24)" className="hologram-waves">
                  <rect x="-10" y="-3" width="1.5" height="6" fill="var(--color-gold)" />
                  <rect x="-5" y="-5" width="1.5" height="10" fill="var(--color-gold)" />
                  <rect x="0" y="-7" width="1.5" height="14" fill="var(--color-gold)" />
                  <rect x="5" y="-5" width="1.5" height="10" fill="var(--color-gold)" />
                  <rect x="10" y="-3" width="1.5" height="6" fill="var(--color-gold)" />
                </g>
              )}
              <text x="0" y="27" textAnchor="middle" fill="var(--color-gold)" fontSize="8.5" fontFamily="var(--mono)" fontWeight="bold">ORACLE</text>
            </g>
          </svg>
        </div>
      )}

      {/* Input query form & sliders */}
      {!conclaveActive ? (
        <form onSubmit={runConclave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="conclave-query-input">Ask your life query</label>
            <textarea
              id="conclave-query-input"
              name="conclaveQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Should I start my own business or keep my stable job?"
              style={{ height: '80px', resize: 'none' }}
              required
            />
          </div>

          {/* Slider for Temperament Balance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              Council Temperament Focus: <span style={{ color: 'var(--color-violet)' }}>{temperament.toUpperCase()}</span>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'intuitive', label: '🌙 Intuitive (Healer)' },
                { id: 'balanced', label: '⚖️ Balanced' },
                { id: 'rational', label: '⚙️ Rational (Sphinx)' }
              ].map(temp => (
                <button
                  key={temp.id}
                  type="button"
                  onClick={() => setTemperament(temp.id)}
                  style={{
                    flexGrow: 1,
                    background: temperament === temp.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${temperament === temp.id ? 'var(--color-violet)' : 'var(--border-light)'}`,
                    color: temperament === temp.id ? 'var(--text-bright)' : 'var(--text-muted)',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {temp.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(q)}
                style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.15)', padding: '6px 12px', borderRadius: '9999px', fontSize: '11px', color: 'var(--text-muted)' }}
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Play size={16} /> Convene Cosmic Conclave
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
          {/* Live Debate Thread */}
          <div className="conclave-debate-box" style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>
            {debateMessages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '90%', alignSelf: msg.agent === 'Sphinx' ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: msg.color, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: msg.agent === 'Sphinx' ? 'flex-end' : 'flex-start' }}>
                  {msg.agent === 'Healer' ? <Heart size={12} /> : msg.agent === 'Sphinx' ? <HelpCircle size={12} /> : <Layers size={12} />}
                  {msg.agent} Agent
                </span>
                <div 
                  className="message-bubble" 
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderLeft: msg.agent !== 'Sphinx' ? `3px solid ${msg.color}` : 'none',
                    borderRight: msg.agent === 'Sphinx' ? `3px solid ${msg.color}` : 'none',
                    borderRadius: '8px', 
                    padding: '14px 16px', 
                    fontSize: '13.5px',
                    lineHeight: '1.5'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Interactive Intervention Branch Choices */}
            {isWaitingForIntervention && (
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.25)', display: 'flex', flexDirection: 'column', gap: '12px', alignSelf: 'center', width: '90%', animation: 'fadeIn 0.5s' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--color-gold)', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', display: 'block' }}>
                  ⚡ Seeker's Intervention Required
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--text-bright)', textAlign: 'center', margin: '0 0 4px' }}>
                  Whose argument aligns with your current path?
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleIntervention('healer')}
                    style={{ flex: 1, padding: '10px 14px', background: 'rgba(244, 114, 182, 0.12)', border: '1px solid rgba(244, 114, 182, 0.35)', color: 'var(--color-rose)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    💖 Support Healer (Emotional alignment)
                  </button>
                  <button 
                    onClick={() => handleIntervention('sphinx')}
                    style={{ flex: 1, padding: '10px 14px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.35)', color: 'var(--color-purple)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    ⚙️ Support Sphinx (Structured action)
                  </button>
                </div>
              </div>
            )}

            {step > 0 && activeAgent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', paddingLeft: '10px', fontStyle: 'italic' }}>
                {activeAgent} Agent typing
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Orchestrator Logs */}
          <div style={{ background: 'rgba(5, 4, 10, 0.6)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--color-violet)' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Multi-Agent Collaboration Orchestrator Trace
            </div>
            <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
              {orchestratorLogs.map((log, index) => (
                <div key={index} style={{ marginBottom: '4px', opacity: 0.85 }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Final Synthesized Blueprint */}
          {blueprint && (
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(168, 85, 247, 0.03)', borderColor: 'rgba(168, 85, 247, 0.25)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.6s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-violet)', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} /> {blueprint.title}
                </h4>
                {/* Decree Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onSaveDecree && (
                    <button
                      onClick={() => onSaveDecree({
                        query,
                        title: blueprint.title,
                        emotional: blueprint.emotional,
                        structural: blueprint.structural,
                        karmic: blueprint.karmic
                      })}
                      style={{
                        background: 'rgba(45, 212, 191, 0.1)',
                        border: '1px solid rgba(45, 212, 191, 0.3)',
                        color: 'var(--color-teal)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save to Archive
                    </button>
                  )}
                  <button
                    onClick={() => setShowDecree(true)}
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      color: 'var(--color-gold)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <FileText size={12} /> Export Decree
                  </button>
                </div>
              </div>
              
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.45' }}>
                <p><strong>🛡️ Healer Pathway (Emotional):</strong> {blueprint.emotional}</p>
                <p><strong>⚙️ Sphinx Pathway (Structural):</strong> {blueprint.structural}</p>
                <p style={{ fontStyle: 'italic', borderLeft: '2px solid var(--color-violet)', paddingLeft: '10px' }}>
                  <strong>🌟 Integrated Blueprint (Oracle):</strong> {blueprint.karmic}
                </p>
              </div>
              
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setConclaveActive(false);
                  setQuery('');
                  setBlueprint(null);
                  setSelectedPath(null);
                }}
                style={{ alignSelf: 'flex-end', padding: '6px 16px', fontSize: '12px', marginTop: '6px' }}
              >
                Close Blueprint & Ask Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Export Decree Modal Overlay */}
      {showDecree && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3, 2, 12, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', border: '1px solid var(--color-gold)', padding: '28px', position: 'relative', background: 'radial-gradient(circle at center, #140c2b 0%, #060410 100%)', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 0 35px rgba(251, 191, 36, 0.15)', animation: 'fadeIn 0.3s' }}>
            
            {/* Corner Celestial SVG Marks */}
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <button 
                onClick={() => setShowDecree(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', letterSpacing: '2px', fontSize: '18px', margin: 0, fontWeight: 'bold' }}>
                COSMIC ALIGNMENT DECREE
              </h3>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                Conclave Decree no. LMN-{Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>

            {/* Decree content block */}
            <div style={{ border: '1px solid rgba(251, 191, 36, 0.15)', borderRadius: '8px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: '1.5' }}>
              <div>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  🛡️ HEALER DECREE (EMOTIONAL ROUTE)
                </span>
                <p style={{ margin: 0, color: 'var(--text-main)' }}>{blueprint?.emotional}</p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(251, 191, 36, 0.15)', paddingTop: '12px' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  ⚙️ SPHINX DECREE (STRUCTURAL BLOCK)
                </span>
                <p style={{ margin: 0, color: 'var(--text-main)' }}>{blueprint?.structural}</p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(251, 191, 36, 0.15)', paddingTop: '12px' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  🔮 ORACLE DECREE (INTEGRATED BLUEPRINT)
                </span>
                <p style={{ margin: 0, color: '#fff', fontStyle: 'italic' }}>{blueprint?.karmic}</p>
              </div>
            </div>

            {/* Decree Footer stamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} style={{ color: 'var(--color-teal)' }} />
                <span>SIGNED BY THE COUNCIL</span>
              </div>
              <span>LUMINA SYSTEM</span>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopyDecree}
              style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> Decree Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Decree Text
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
