import React, { useState } from 'react';
import { Compass, HelpCircle, Sparkles } from 'lucide-react';

export default function ConstellationChart({ 
  birthData, 
  unlockedNodes, 
  selectedNode, 
  onSelectNode 
}) {
  // Define positions and metadata for each astrological node in our soul labyrinth
  // Symmetrical Double-Winged Coordinate positions
  const nodes = {
    Sun: {
      name: 'Sun Node (Ego & Core)',
      x: 140,
      y: 140,
      description: 'Your fundamental self and vitality. Lights the way in the labyrinth.',
      transit: 'Transit: Sun conjunct your Ascendant. A period of personal renewal.',
      sign: birthData?.sunSign || 'Aries',
      color: 'var(--color-gold)',
      requiredRiddle: 'Sun',
    },
    Moon: {
      name: 'Moon Node (Inner Child & Emotions)',
      x: 360,
      y: 140,
      description: 'Your emotional depth, subconscious patterns, and comfort zone.',
      transit: 'Transit: Moon square Pluto. Intense emotional processing occurring.',
      sign: birthData?.moonSign || 'Cancer',
      color: 'var(--color-teal)',
      requiredRiddle: 'Moon',
    },
    Ascendant: {
      name: 'Ascendant Node (ASC - Outer Persona)',
      x: 250,
      y: 260,
      description: 'The mask you show to the world. The entrance to your psyche.',
      transit: 'Transit: Uranus trine Ascendant. Unexpected shifts in self-expression.',
      sign: birthData?.ascSign || 'Scorpio',
      color: 'var(--color-violet)',
      requiredRiddle: 'Ascendant',
    },
    Mercury: {
      name: 'Mercury Node (Mind & Intellect)',
      x: 140,
      y: 250,
      description: 'Your communication patterns, intellectual focus, and learning drives. Locked.',
      transit: 'Transit: Mercury retrograde. Focus your thoughts and reflect before speaking.',
      sign: birthData?.mercurySign || 'Gemini',
      color: '#38bdf8',
      requiredRiddle: 'Mercury',
    },
    Venus: {
      name: 'Venus Node (Attraction & Value)',
      x: 360,
      y: 250,
      description: 'Your relationships, artistic values, attraction, and self-worth. Locked.',
      transit: 'Transit: Venus sextile Jupiter. A beautiful day to appreciate art and bonds.',
      sign: birthData?.venusSign || 'Taurus',
      color: '#f472b6',
      requiredRiddle: 'Venus',
    },
    Mars: {
      name: 'Mars Node (Drive & Action)',
      x: 100,
      y: 360,
      description: 'Your willpower, drive, active passion, and how you take risks. Locked.',
      transit: 'Transit: Mars retrograde. Internalizing anger or reassessing goals.',
      sign: birthData?.marsSign || 'Leo',
      color: 'var(--color-rose)',
      requiredRiddle: 'Mars',
    },
    Saturn: {
      name: 'Saturn Node (Limits & Soul Duty)',
      x: 400,
      y: 360,
      description: 'Your life lessons, structural discipline, and karmic boundaries. Locked.',
      transit: 'Transit: Saturn return. A time of testing, maturity, and restructuring.',
      sign: birthData?.saturnSign || 'Capricorn',
      color: 'var(--color-purple)',
      requiredRiddle: 'Saturn',
    },
    Jupiter: {
      name: 'Jupiter Node (Growth & Expansion)',
      x: 250,
      y: 70,
      description: 'Your philosophical expansion, luck, belief patterns, and wisdom. Locked.',
      transit: 'Transit: Jupiter trine Pluto. Major shift in spiritual wisdom and opportunities.',
      sign: birthData?.jupiterSign || 'Sagittarius',
      color: '#fcd34d',
      requiredRiddle: 'Jupiter',
    }
  };

  const [chartTilt, setChartTilt] = useState({});

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((rect.height / 2 - y) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    setChartTilt({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'transform 0.1s ease',
      transformStyle: 'preserve-3d'
    });
  };

  const handleMouseLeave = () => {
    setChartTilt({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  // Connection lines to form the constellation
  const connections = [
    { from: 'Sun', to: 'Jupiter' },
    { from: 'Jupiter', to: 'Moon' },
    { from: 'Sun', to: 'Mercury' },
    { from: 'Mercury', to: 'Ascendant' },
    { from: 'Moon', to: 'Venus' },
    { from: 'Venus', to: 'Ascendant' },
    { from: 'Ascendant', to: 'Mars' },
    { from: 'Ascendant', to: 'Saturn' },
    { from: 'Mars', to: 'Saturn' }
  ];

  return (
    <div id="tour-constellation-chart" className="glass-panel map-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Compass className="panel-title-icon" size={20} />
          <h3>Constellation Labyrinth</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
          <span>Active Map of {birthData?.name || 'Your'} Soul</span>
        </div>
      </div>

      <div 
        className="svg-container" 
        style={chartTilt}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox="0 0 500 450" className="svg-map">
          {/* Faint Astronomical Coordinate Hologram Grid */}
          <g className="radar-grid-spin" stroke="rgba(168, 85, 247, 0.08)" strokeWidth="0.8" fill="none" pointerEvents="none">
            <circle cx="250" cy="225" r="70" />
            <circle cx="250" cy="225" r="140" strokeDasharray="4 4" />
            <circle cx="250" cy="225" r="210" />
            <circle cx="250" cy="225" r="280" strokeDasharray="8 8" />
            <line x1="250" y1="20" x2="250" y2="430" />
            <line x1="20" y1="225" x2="480" y2="225" />
            <line x1="75" y1="50" x2="425" y2="400" strokeDasharray="2 2" />
            <line x1="75" y1="400" x2="425" y2="50" strokeDasharray="2 2" />
            {/* Compass degree markings */}
            <circle cx="250" cy="225" r="220" stroke="rgba(45, 212, 191, 0.04)" strokeWidth="1.2" strokeDasharray="1 10" />
          </g>

          {/* Connection Lines */}
          {connections.map((conn, idx) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            const isUnlocked = (!fromNode.requiredRiddle || unlockedNodes.includes(fromNode.requiredRiddle)) &&
                               (!toNode.requiredRiddle || unlockedNodes.includes(toNode.requiredRiddle));
            return (
              <g key={idx}>
                {/* Base connection line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isUnlocked ? 'rgba(129, 140, 248, 0.45)' : 'rgba(255,255,255,0.05)'}
                  strokeWidth={isUnlocked ? 2 : 1}
                  strokeDasharray={isUnlocked ? 'none' : '4 4'}
                  style={{ transition: 'all 0.5s ease' }}
                />
                {/* Animated flowing laser line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isUnlocked ? (fromNode.color || 'var(--color-gold)') : 'rgba(168, 85, 247, 0.35)'}
                  strokeWidth={isUnlocked ? "2" : "1.2"}
                  className={isUnlocked ? "laser-line-unlocked" : "laser-line-locked"}
                  pointerEvents="none"
                />
              </g>
            );
          })}

          {/* Constellation Nodes (Stars) */}
          {Object.entries(nodes).map(([key, node]) => {
            const isUnlocked = !node.requiredRiddle || unlockedNodes.includes(node.requiredRiddle);
            const isSelected = selectedNode === key;
            
            return (
              <g
                key={key}
                className="constellation-node"
                onClick={() => onSelectNode(key)}
                style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: 'pointer' }}
              >
                {/* Outer Glow Ring for Selected or Unlocked Nodes */}
                {isUnlocked && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 18 : 12}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.5"
                    style={{
                      opacity: isSelected ? 0.7 : 0.2,
                      animation: 'pulse-slow 2s infinite ease-in-out',
                      transition: 'all 0.3s ease'
                    }}
                  />
                )}

                {/* Node Center Star */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 8 : 6}
                  fill={isUnlocked ? node.color : '#475569'}
                  style={{
                    boxShadow: isUnlocked ? `0 0 10px ${node.color}` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Star Overlay Sparkle for Unlocked */}
                {isUnlocked && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 3 : 2}
                    fill="#fff"
                  />
                )}

                {/* Text Label */}
                <text
                  x={node.x}
                  y={node.y - 16}
                  textAnchor="middle"
                  style={{
                    fill: isSelected ? '#fff' : isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                    opacity: isSelected ? 1 : 0.8,
                    fontSize: isSelected ? '12px' : '11px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isSelected ? '600' : '400'
                  }}
                >
                  {key} ({isUnlocked ? node.sign : 'Locked'})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-dot unlocked"></div>
          <span>Unlocked Placements</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot locked"></div>
          <span>Locked Placements</span>
        </div>
        <div className="legend-item">
          <HelpCircle size={14} style={{ color: 'var(--color-purple)' }} />
          <span>Click a node to inspect</span>
        </div>
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', background: 'rgba(10, 8, 22, 0.5)' }}>
          <h4 style={{ color: nodes[selectedNode].color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontSize: '15px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: nodes[selectedNode].color }}></span>
            {nodes[selectedNode].name} - {nodes[selectedNode].sign}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {nodes[selectedNode].description}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-gold)', marginTop: '8px', background: 'rgba(251, 191, 36, 0.05)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
            {nodes[selectedNode].transit}
          </p>
          {nodes[selectedNode].requiredRiddle && !unlockedNodes.includes(nodes[selectedNode].requiredRiddle) && (
            <div style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--color-purple)', background: 'rgba(192, 132, 252, 0.05)', padding: '8px 12px', borderRadius: '6px', border: '1px dashed rgba(192, 132, 252, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🔐 Solve the Sphinx Riddle below to unlock this drive.</span>
              <button 
                onClick={() => {
                  const element = document.getElementById('tour-sphinx-riddle');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-purple)', fontWeight: '600', textDecoration: 'underline', fontSize: '12px' }}
              >
                Go to Riddle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
