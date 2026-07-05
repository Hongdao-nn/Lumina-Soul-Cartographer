import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Search, MapPin, Heart, Layers, ShieldCheck, Terminal, User, Key } from 'lucide-react';
import ConstellationChart from './components/ConstellationChart';
import SphinxRiddle from './components/SphinxRiddle';
import HealerJournal from './components/HealerJournal';
import PrivacySandbox from './components/PrivacySandbox';
import TarotSanctuary from './components/TarotSanctuary';
import CosmicConclave from './components/CosmicConclave';
import TutorialTour from './components/TutorialTour';
import { calculateCharts } from './utils/astrologyEngine';
import './App.css';

// City coordinates database for precise calculations - Expanded with international and domestic major cities
const citiesDB = [
  // Vietnam
  { name: 'Hanoi, Vietnam', lat: '21.0285° N', lon: '105.8542° E', tz: 'GMT+7', id: 'hanoi' },
  { name: 'Ho Chi Minh City, Vietnam', lat: '10.8231° N', lon: '106.6297° E', tz: 'GMT+7', id: 'hcmc' },
  { name: 'Da Nang, Vietnam', lat: '16.0544° N', lon: '108.2022° E', tz: 'GMT+7', id: 'danang' },
  { name: 'Haiphong, Vietnam', lat: '20.8449° N', lon: '106.6881° E', tz: 'GMT+7', id: 'haiphong' },
  { name: 'Can Tho, Vietnam', lat: '10.0452° N', lon: '105.7469° E', tz: 'GMT+7', id: 'cantho' },
  { name: 'Hue, Vietnam', lat: '16.4637° N', lon: '107.5909° E', tz: 'GMT+7', id: 'hue' },
  { name: 'Nha Trang, Vietnam', lat: '12.2388° N', lon: '109.1967° E', tz: 'GMT+7', id: 'nhatrang' },
  { name: 'Da Lat, Vietnam', lat: '11.9404° N', lon: '108.4583° E', tz: 'GMT+7', id: 'dalat' },
  { name: 'Vung Tau, Vietnam', lat: '10.3460° N', lon: '107.0843° E', tz: 'GMT+7', id: 'vungtau' },
  { name: 'Quang Ninh, Vietnam', lat: '20.9599° N', lon: '107.0450° E', tz: 'GMT+7', id: 'quangninh' },
  { name: 'Vinh, Vietnam', lat: '18.6734° N', lon: '105.6813° E', tz: 'GMT+7', id: 'vinh' },
  { name: 'Quy Nhon, Vietnam', lat: '13.7830° N', lon: '109.2194° E', tz: 'GMT+7', id: 'quynhon' },
  // International
  { name: 'London, UK', lat: '51.5074° N', lon: '0.1278° W', tz: 'GMT+0', id: 'london' },
  { name: 'New York, USA', lat: '40.7128° N', lon: '74.0060° W', tz: 'GMT-5', id: 'nyc' },
  { name: 'Los Angeles, USA', lat: '34.0522° N', lon: '118.2437° W', tz: 'GMT-8', id: 'la' },
  { name: 'Tokyo, Japan', lat: '35.6762° N', lon: '139.6503° E', tz: 'GMT+9', id: 'tokyo' },
  { name: 'Paris, France', lat: '48.8566° N', lon: '2.3522° E', tz: 'GMT+1', id: 'paris' },
  { name: 'Berlin, Germany', lat: '52.5200° N', lon: '13.4050° E', tz: 'GMT+1', id: 'berlin' },
  { name: 'Rome, Italy', lat: '41.9028° N', lon: '12.4964° E', tz: 'GMT+1', id: 'rome' },
  { name: 'Moscow, Russia', lat: '55.7558° N', lon: '37.6173° E', tz: 'GMT+3', id: 'moscow' },
  { name: 'Beijing, China', lat: '39.9042° N', lon: '116.4074° E', tz: 'GMT+8', id: 'beijing' },
  { name: 'Seoul, South Korea', lat: '37.5665° N', lon: '126.9780° E', tz: 'GMT+9', id: 'seoul' },
  { name: 'Singapore, Singapore', lat: '1.3521° N', lon: '103.8198° E', tz: 'GMT+8', id: 'singapore' },
  { name: 'Bangkok, Thailand', lat: '13.7563° N', lon: '100.5018° E', tz: 'GMT+7', id: 'bangkok' },
  { name: 'Jakarta, Indonesia', lat: '6.2088° S', lon: '106.8456° E', tz: 'GMT+7', id: 'jakarta' },
  { name: 'Manila, Philippines', lat: '14.5995° N', lon: '120.9842° E', tz: 'GMT+8', id: 'manila' },
  { name: 'Kuala Lumpur, Malaysia', lat: '3.1390° N', lon: '101.6869° E', tz: 'GMT+8', id: 'kl' },
  { name: 'New Delhi, India', lat: '28.6139° N', lon: '77.2090° E', tz: 'GMT+5.5', id: 'delhi' },
  { name: 'Sydney, Australia', lat: '33.8688° S', lon: '151.2093° E', tz: 'GMT+10', id: 'sydney' },
  { name: 'Melbourne, Australia', lat: '37.8136° S', lon: '144.9631° E', tz: 'GMT+10', id: 'melbourne' },
  { name: 'Cairo, Egypt', lat: '30.0444° N', lon: '31.2357° E', tz: 'GMT+2', id: 'cairo' },
  { name: 'Cape Town, South Africa', lat: '33.9249° S', lon: '18.4241° E', tz: 'GMT+2', id: 'capetown' },
  { name: 'Ottawa, Canada', lat: '45.4215° N', lon: '75.6972° W', tz: 'GMT-5', id: 'ottawa' },
  { name: 'Toronto, Canada', lat: '43.6532° W', lon: '79.3832° W', tz: 'GMT-5', id: 'toronto' },
  { name: 'Vancouver, Canada', lat: '49.2827° N', lon: '123.1207° W', tz: 'GMT-8', id: 'vancouver' },
  { name: 'Brasilia, Brazil', lat: '15.7975° S', lon: '47.8919° W', tz: 'GMT-3', id: 'brasilia' },
  { name: 'Buenos Aires, Argentina', lat: '34.6037° S', lon: '58.3816° W', tz: 'GMT-3', id: 'ba' },
  { name: 'Mexico City, Mexico', lat: '19.4326° N', lon: '99.1332° W', tz: 'GMT-6', id: 'mexico' }
];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isWarping, setIsWarping] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('healer'); // 'healer' | 'tarot' | 'privacy'
  
  // Setup inputs
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [birthMinute, setBirthMinute] = useState('00');
  const [birthPeriod, setBirthPeriod] = useState('PM');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Placements state
  const [birthData, setBirthData] = useState(null);
  const [unlockedNodes, setUnlockedNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState('Sun');
  const [sanitizedText, setSanitizedText] = useState('');
  const [sparkles, setSparkles] = useState([]);

  // Cosmic Score Resonance tracker
  const [scores, setScores] = useState({ emotional: 1, logical: 1, intuitive: 1 });

  // Personal Account & API Key Management states
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'profile'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Local state copy of user's customized API Key and saved readings
  const [userApiKey, setUserApiKey] = useState('');
  const [userArchive, setUserArchive] = useState({ placements: [], decrees: [], tarot: [] });

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    const usernameTrimmed = authUsername.trim();
    const passwordTrimmed = authPassword.trim();
    if (!usernameTrimmed || !passwordTrimmed) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('lumina_users') || '{}');
    if (users[usernameTrimmed]) {
      setAuthError('Username already exists.');
      return;
    }

    const newUser = {
      username: usernameTrimmed,
      password: passwordTrimmed,
      apiKey: '',
      archive: { placements: [], decrees: [], tarot: [] }
    };

    users[usernameTrimmed] = newUser;
    localStorage.setItem('lumina_users', JSON.stringify(users));

    setCurrentUser(usernameTrimmed);
    setUserApiKey('');
    setUserArchive(newUser.archive);
    setShowAuthModal(false);
    setAuthUsername('');
    setAuthPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const usernameTrimmed = authUsername.trim();
    const passwordTrimmed = authPassword.trim();
    if (!usernameTrimmed || !passwordTrimmed) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('lumina_users') || '{}');
    const user = users[usernameTrimmed];

    if (!user || user.password !== passwordTrimmed) {
      setAuthError('Invalid username or password.');
      return;
    }

    setCurrentUser(usernameTrimmed);
    setUserApiKey(user.apiKey || '');
    setUserArchive(user.archive || { placements: [], decrees: [], tarot: [] });
    setShowAuthModal(false);
    setAuthUsername('');
    setAuthPassword('');

    // Load last placement automatically if available
    if (user.archive?.placements?.length > 0) {
      const last = user.archive.placements[user.archive.placements.length - 1];
      setBirthData(last);
      setIsSetupComplete(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserApiKey('');
    setUserArchive({ placements: [], decrees: [], tarot: [] });
  };

  const saveToArchive = (type, item) => {
    if (!currentUser) {
      alert('Please Sign In / Register to save this item to your Soul Archive!');
      return;
    }
    const users = JSON.parse(localStorage.getItem('lumina_users') || '{}');
    const user = users[currentUser];
    if (user) {
      if (!user.archive) user.archive = { placements: [], decrees: [], tarot: [] };
      user.archive[type].push({
        ...item,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleString()
      });
      users[currentUser] = user;
      localStorage.setItem('lumina_users', JSON.stringify(users));
      setUserArchive(user.archive);
      alert('Reading saved successfully to your Soul Archive!');
    }
  };

  const saveApiKey = (newKey) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('lumina_users') || '{}');
    const user = users[currentUser];
    if (user) {
      user.apiKey = newKey;
      users[currentUser] = user;
      localStorage.setItem('lumina_users', JSON.stringify(users));
      setUserApiKey(newKey);
      alert('API Key updated successfully!');
    }
  };

  const loadPlacementFromArchive = (placement) => {
    setBirthData(placement);
    setIsSetupComplete(true);
    setShowAuthModal(false);
  };

  const addScore = (type, amount = 1) => {
    setScores(prev => {
      const next = { ...prev, [type]: prev[type] + amount };
      const total = next.emotional + next.logical + next.intuitive;
      if (total > 300) {
        return {
          emotional: Math.max(1, Math.round((next.emotional / total) * 100)),
          logical: Math.max(1, Math.round((next.logical / total) * 100)),
          intuitive: Math.max(1, Math.round((next.intuitive / total) * 100))
        };
      }
      return next;
    });
  };

  // Global Solfeggio Tuner System
  const [solfeggioFreq, setSolfeggioFreq] = useState(null);
  const solfeggioCtxRef = React.useRef(null);
  const solfeggioOscRef = React.useRef(null);
  const solfeggioModRef = React.useRef(null);
  const solfeggioGainRef = React.useRef(null);

  const playSolfeggio = (freq) => {
    try {
      stopSolfeggio();
      if (!freq) return;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      solfeggioCtxRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);
      gainNode.connect(ctx.destination);
      solfeggioGainRef.current = gainNode;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      solfeggioOscRef.current = osc;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
      solfeggioModRef.current = { lfo, lfoGain };

      setSolfeggioFreq(freq);
    } catch (e) {
      console.warn("Failed to play Solfeggio sound bath:", e);
    }
  };

  const stopSolfeggio = () => {
    try {
      if (solfeggioOscRef.current) {
        solfeggioOscRef.current.stop();
        solfeggioOscRef.current = null;
      }
      if (solfeggioModRef.current) {
        solfeggioModRef.current.lfo.stop();
        solfeggioModRef.current = null;
      }
      if (solfeggioCtxRef.current) {
        solfeggioCtxRef.current.close();
        solfeggioCtxRef.current = null;
      }
      setSolfeggioFreq(null);
    } catch {}
  };

  useEffect(() => {
    return () => {
      stopSolfeggio();
    };
  }, []);

  // 3D Canvas Twinkling Sparkling Swirling Galaxy particle system (uncluttered center)
  useEffect(() => {
    const canvas = document.getElementById('warp-canvas');
    const trailCanvas = document.getElementById('trail-canvas');
    if (!canvas || !trailCanvas) return;
    const ctx = canvas.getContext('2d');
    const trailCtx = trailCanvas.getContext('2d');
    if (!ctx || !trailCtx) return;

    let width = (canvas.width = trailCanvas.width = window.innerWidth);
    let height = (canvas.height = trailCanvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = trailCanvas.width = window.innerWidth;
      height = canvas.height = trailCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouse = { x: null, y: null };
    const cursorParticles = [];
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isWarping && !showIntro) {
        for (let i = 0; i < 2; i++) {
          cursorParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            size: 1.2 + Math.random() * 2.2,
            opacity: 1.0,
            color: ['#a855f7', '#2dd4bf', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 4)]
          });
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const numStars = 220;
    const stars = [];

    // Colors that match galaxy aesthetic (blues, purples, golds, pinks, whites)
    const starColors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24', '#ffffff', '#2dd4bf'];

    // Generate stars swirling in a disc around the center
    for (let i = 0; i < numStars; i++) {
      // Keep center uncluttered by enforcing a minimum distance of 140px from center
      const minDistance = 140;
      const maxDistance = Math.min(width, height) * 0.85;
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      
      stars.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        speed: 0.0012 + Math.random() * 0.002, // orbital velocity
        size: 1 + Math.random() * 2,
        opacity: Math.random() * 0.7 + 0.2,
        maxOpacity: 0.4 + Math.random() * 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        isFlare: Math.random() > 0.85, // 15% are sparkling cross flares
        xOffset: 0,
        yOffset: 0
      });
    }

    // Cosmic Dust Particles array
    const dustParticles = [];
    const numDust = 40;
    const dustColors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24', '#ffffff', '#2dd4bf'];
    for (let i = 0; i < numDust; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.6 + Math.random() * 1.4,
        speedX: -0.04 + Math.random() * 0.08,
        speedY: -0.08 - Math.random() * 0.15, // Rise slowly
        opacity: Math.random() * 0.4 + 0.15,
        color: dustColors[Math.floor(Math.random() * dustColors.length)]
      });
    }

    // Shooting Star state variable
    let shootingStar = null;
    let frameCount = 0;

    let baseSpeedFactor = 1.0;
    let targetSpeedFactor = 1.0;
    let galaxyScale = 1.0;
    let targetGalaxyScale = 1.0;
    let galaxyOpacity = 1.0;
    let targetGalaxyOpacity = 1.0;
    let animationFrameId;

    if (isWarping) {
      targetSpeedFactor = 28.0;
      targetGalaxyScale = 2.4;
      targetGalaxyOpacity = 0.0;
    } else if (!showIntro) {
      targetSpeedFactor = 0.22; // 5x slower for peaceful background
      targetGalaxyScale = 1.0;
      targetGalaxyOpacity = 0.35; // soft background opacity
    }

    const animate = () => {
      // Deep space canvas clearing
      ctx.fillStyle = `rgba(3, 2, 12, ${isWarping ? 0.22 : 0.15})`;
      ctx.fillRect(0, 0, width, height);

      // Clear trail canvas so old cursor particles fade out smoothly
      trailCtx.clearRect(0, 0, width, height);

      // Swirling center nebula color stops (very soft, transparent)
      const nebulaGlow = ctx.createRadialGradient(
        width / 2, 
        height / 2, 
        50 * galaxyScale, 
        width / 2, 
        height / 2, 
        (width / 1.5) * galaxyScale
      );
      nebulaGlow.addColorStop(0, `rgba(93, 63, 211, ${0.15 * galaxyOpacity})`);
      nebulaGlow.addColorStop(0.3, `rgba(236, 72, 153, ${0.08 * galaxyOpacity})`);
      nebulaGlow.addColorStop(0.7, `rgba(45, 212, 191, ${0.04 * galaxyOpacity})`);
      nebulaGlow.addColorStop(1, 'rgba(3, 2, 12, 0)');
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, width, height);

      // Smoothly interpolate transitions
      baseSpeedFactor += (targetSpeedFactor - baseSpeedFactor) * 0.08;
      galaxyScale += (targetGalaxyScale - galaxyScale) * 0.06;
      galaxyOpacity += (targetGalaxyOpacity - galaxyOpacity) * 0.07;

      // Connect and update stars
      for (let i = 0; i < stars.length; i++) {
        const starA = stars[i];
        starA.angle += starA.speed * baseSpeedFactor;

        // Twinkle breathing effect
        starA.opacity += starA.twinkleSpeed;
        if (starA.opacity >= starA.maxOpacity || starA.opacity <= 0.15) {
          starA.twinkleSpeed = -starA.twinkleSpeed;
        }

        const distA = starA.distance * galaxyScale;
        const xA = width / 2 + Math.cos(starA.angle) * distA;
        const yA = height / 2 + Math.sin(starA.angle) * distA;

        // Mouse attraction offset
        if (mouse.x !== null && mouse.y !== null && !isWarping) {
          const actualXA = xA + starA.xOffset;
          const actualYA = yA + starA.yOffset;
          const dx = mouse.x - actualXA;
          const dy = mouse.y - actualYA;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          if (distToMouse < 180) {
            starA.xOffset += (dx / distToMouse) * 0.22;
            starA.yOffset += (dy / distToMouse) * 0.22;
          } else {
            starA.xOffset *= 0.95;
            starA.yOffset *= 0.95;
          }
        } else {
          starA.xOffset *= 0.95;
          starA.yOffset *= 0.95;
        }

        const drawXA = xA + starA.xOffset;
        const drawYA = yA + starA.yOffset;

        if (drawXA >= 0 && drawXA <= width && drawYA >= 0 && drawYA <= height) {
          ctx.globalAlpha = starA.opacity * galaxyOpacity;
          
          // Draw standard star
          ctx.fillStyle = starA.color;
          ctx.beginPath();
          ctx.arc(drawXA, drawYA, starA.size, 0, Math.PI * 2);
          ctx.fill();

          // Draw sparkling 4-point cross flare
          if (starA.isFlare) {
            const flareSize = starA.size * 3.5 * (starA.opacity / starA.maxOpacity);
            ctx.strokeStyle = starA.color;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(drawXA - flareSize, drawYA);
            ctx.lineTo(drawXA + flareSize, drawYA);
            ctx.moveTo(drawXA, drawYA - flareSize);
            ctx.lineTo(drawXA, drawYA + flareSize);
            ctx.stroke();
          }
        }

        // Draw connection lines to nearby stars
        if (!isWarping) {
          const drawXA = xA + starA.xOffset;
          const drawYA = yA + starA.yOffset;
          for (let j = i + 1; j < stars.length; j++) {
            const starB = stars[j];
            const distB = starB.distance * galaxyScale;
            const drawXB = width / 2 + Math.cos(starB.angle) * distB + starB.xOffset;
            const drawYB = height / 2 + Math.sin(starB.angle) * distB + starB.yOffset;

            const dx = drawXB - drawXA;
            const dy = drawYB - drawYA;
            const distBetween = Math.sqrt(dx * dx + dy * dy);

            if (distBetween < 75) {
              const alpha = (1 - distBetween / 75) * 0.14 * galaxyOpacity;
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
              ctx.lineWidth = 0.45;
              ctx.beginPath();
              ctx.moveTo(drawXA, drawYA);
              ctx.lineTo(drawXB, drawYB);
              ctx.stroke();
            }
          }
        }
      }

      // Draw & update Cosmic Dust Particles (peaceful rising dust)
      if (!isWarping && !showIntro) {
        dustParticles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap around screen edges
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          if (p.x < 0 || p.x > width) {
            p.x = Math.random() * width;
          }

          ctx.globalAlpha = p.opacity * galaxyOpacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw & update Shooting Star
      if (!isWarping && !showIntro) {
        frameCount++;
        // Spawn a shooting star randomly if none is currently active
        if (!shootingStar && frameCount % 120 === 0 && Math.random() > 0.6) {
          shootingStar = {
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.3,
            dx: 8 + Math.random() * 8, // diagonal down-right
            dy: 4 + Math.random() * 4,
            length: 60 + Math.random() * 70,
            alpha: 1.0,
            color: '#ffffff'
          };
        }

        if (shootingStar) {
          shootingStar.x += shootingStar.dx;
          shootingStar.y += shootingStar.dy;
          shootingStar.alpha -= 0.015; // fade out speed

          if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          } else {
            ctx.globalAlpha = shootingStar.alpha * galaxyOpacity;
            const grad = ctx.createLinearGradient(
              shootingStar.x, 
              shootingStar.y, 
              shootingStar.x - shootingStar.dx * 1.5, 
              shootingStar.y - shootingStar.dy * 1.5
            );
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.35)');
            grad.addColorStop(1, 'rgba(3, 2, 12, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(
              shootingStar.x - shootingStar.dx * 1.8, 
              shootingStar.y - shootingStar.dy * 1.8
            );
            ctx.stroke();
          }
        }
      }

      // Update and draw Cursor Nebula Trail particles
      if (!isWarping && !showIntro) {
        for (let i = cursorParticles.length - 1; i >= 0; i--) {
          const p = cursorParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.opacity -= 0.02; // Fade out slowly
          p.size *= 0.97; // Shrink slowly

          if (p.opacity <= 0 || p.size <= 0.2) {
            cursorParticles.splice(i, 1);
          } else {
            trailCtx.globalAlpha = p.opacity * galaxyOpacity;
            trailCtx.fillStyle = p.color;
            trailCtx.beginPath();
            trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            trailCtx.fill();
            
            // Add a subtle glowing halo around the stardust
            trailCtx.globalAlpha = p.opacity * 0.3 * galaxyOpacity;
            trailCtx.beginPath();
            trailCtx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            trailCtx.fill();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showIntro, isWarping]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    
    let finalCity = selectedCity;
    if (!finalCity && citySearch.trim()) {
      // Find a matching city in citiesDB case-insensitively
      const query = citySearch.trim().toLowerCase();
      const match = citiesDB.find(c => c.name.toLowerCase() === query || c.name.toLowerCase().startsWith(query));
      if (match) {
        finalCity = match;
      } else {
        // Fallback custom city object so submission never blocks
        finalCity = {
          name: citySearch.trim(),
          lat: '21.0285° N',
          lon: '105.8542° E',
          tz: 'GMT+7',
          id: 'custom'
        };
      }
    }

    if (!name || !birthDate || !finalCity) return;

    // Call accurate astrologyEngine
    const signs = calculateCharts(birthDate, birthHour, birthMinute, birthPeriod, finalCity);
    const data = {
      name,
      birthDate,
      birthTime: `${birthHour}:${birthMinute} ${birthPeriod}`,
      birthPlace: finalCity.name,
      coords: `${finalCity.lat}, ${finalCity.lon}`,
      tz: finalCity.tz,
      sunSign: signs.sun,
      moonSign: signs.moon,
      ascSign: signs.asc,
      marsSign: signs.mars,
      saturnSign: signs.saturn
    };
    setBirthData(data);
    setIsSetupComplete(true);

    // Auto-save placement if user is logged in
    if (currentUser) {
      saveToArchive('placements', data);
    }
  };

  const handleAutofill = () => {
    setName('Arthur Pendragon');
    setBirthDate('2000-09-15');
    setBirthHour('12');
    setBirthMinute('00');
    setBirthPeriod('PM');
    setSelectedCity(citiesDB[3]);
    setCitySearch(citiesDB[3].name);
    
    // Auto generate chart using astrologyEngine
    const signs = calculateCharts('2000-09-15', '12', '00', 'PM', citiesDB[3]);
    setBirthData({
      name: 'Arthur Pendragon',
      birthDate: '2000-09-15',
      birthTime: '12:00 PM',
      birthPlace: citiesDB[3].name,
      coords: `${citiesDB[3].lat}, ${citiesDB[3].lon}`,
      tz: citiesDB[3].tz,
      sunSign: signs.sun,
      moonSign: signs.moon,
      ascSign: signs.asc,
      marsSign: signs.mars,
      saturnSign: signs.saturn
    });
    setIsSetupComplete(true);
  };

  const handleEnterApp = () => {
    setIsWarping(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsTourOpen(true);
    }, 1100);
  };

  const handleUnlockNode = (nodeName) => {
    if (!unlockedNodes.includes(nodeName)) {
      setUnlockedNodes(prev => [...prev, nodeName]);
    }
  };

  const resetJourney = () => {
    setIsSetupComplete(false);
    setBirthData(null);
    setUnlockedNodes([]);
    setSelectedNode('Sun');
    setName('');
    setBirthDate('');
    setBirthHour('12');
    setBirthMinute('00');
    setBirthPeriod('PM');
    setCitySearch('');
    setSelectedCity(null);
    setActiveTab('healer');
  };

  const handleTourStepChange = (stepIndex) => {
    if (stepIndex >= 2 && !isSetupComplete) {
      handleAutofill();
    }

    if (stepIndex === 2) {
      setSelectedNode('Sun');
    } else if (stepIndex === 3) {
      setSelectedNode('Mars'); // Automatically select Mars so they see the riddle!
    } else if (stepIndex === 4) {
      setActiveTab('healer');
    } else if (stepIndex === 5) {
      setActiveTab('tarot'); // Automatically switch to Tarot tab
    } else if (stepIndex === 6) {
      setActiveTab('conclave'); // Automatically switch to Conclave tab
    } else if (stepIndex === 7) {
      setActiveTab('privacy'); // Automatically switch to Privacy tab
    }
  };

  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const freqs = [528, 659, 783];
      freqs.forEach((f, index) => {
        const time = ctx.currentTime + index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.03, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.7);
      });

      setTimeout(() => {
        ctx.close();
      }, 1000);
    } catch {}
  };

  const handleGlobalClick = (e) => {
    // Play chime sound
    playClickSound();

    // Spawn 8 sparkles at cursor location
    const x = e.clientX;
    const y = e.clientY;
    const count = 8;
    const newSparkles = [];

    for (let i = 0; i < count; i++) {
      const angle = (i * (360 / count) + Math.random() * 20) * (Math.PI / 180);
      const speed = 20 + Math.random() * 25; // translation distance
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed;
      const id = `${Date.now()}-${i}-${Math.random()}`;
      
      newSparkles.push({
        id,
        x,
        y,
        tx: `${tx}px`,
        ty: `${ty}px`,
        color: ['#fbbf24', '#f472b6', '#a855f7', '#2dd4bf', '#ffffff'][Math.floor(Math.random() * 5)],
        size: `${8 + Math.random() * 8}px`
      });
    }

    setSparkles(prev => [...prev, ...newSparkles]);

    // Cleanup sparkles after 700ms
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 700);
  };

  const filteredCities = citiesDB.filter(city => 
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const totalScore = scores.emotional + scores.logical + scores.intuitive;
  const emotionalPct = Math.round((scores.emotional / totalScore) * 100);
  const logicalPct = Math.round((scores.logical / totalScore) * 100);
  const intuitivePct = Math.round((scores.intuitive / totalScore) * 100);

  return (
    <div className="app-container" onClick={handleGlobalClick}>
      {/* Persistent Swirling Galaxy Canvas */}
      <canvas id="warp-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}></canvas>

      {/* Background Star field */}
      <div className="star-field"></div>
      
      {/* Ambient glowing nebulas in background (Galaxy Theme) */}
      {!showIntro && (
        <>
          <div className="galaxy-nebula nebula-1"></div>
          <div className="galaxy-nebula nebula-2"></div>
          <div className="galaxy-nebula nebula-3"></div>
          <div className="galaxy-nebula nebula-4"></div>
        </>
      )}


      {/* Sparkling Swirling Galaxy Intro Overlay */}
      {showIntro && (
        <div className="intro-overlay" style={{ background: 'transparent', zIndex: 2 }}>
          <div className="intro-content" style={{ zIndex: 3, position: 'relative' }}>
            <div className="intro-title-group">
              <h1 className="intro-title">LUMINA</h1>
              <span className="intro-subtitle">The Soul Cartographer</span>
            </div>
            <p className="intro-quote">
              "The universe is not outside of you. Look inside yourself; everything that you want, you already are."
            </p>
            <button className="btn-glow" onClick={handleEnterApp} style={{ padding: '16px 48px', fontSize: '15px' }}>
              AWAKEN YOUR SOUL MAP
            </button>
          </div>
        </div>
      )}

      {/* App Header */}
      {!showIntro && (
        <header className="app-header">
          <div className="logo-section">
            <Compass className="logo-icon animate-pulse" size={24} />
            <h1>LUMINA</h1>
            <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', background: 'rgba(129, 140, 248, 0.1)', color: 'var(--color-violet)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
              Soul Labyrinth
            </span>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Soul Resonance Dashboard Widget */}
            <div className="soul-resonance-widget" style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '8px', minWidth: '150px' }} title="Soul Resonance Alignment: Reflects your interactions with Healer (Empathy), Sphinx (Logic), and Tarot (Intuition)">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Soul Alignment</span>
                <span style={{ color: 'var(--color-violet)' }}>Active</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                <div style={{ width: `${emotionalPct}%`, background: 'var(--color-rose)', transition: 'width 0.4s ease' }} />
                <div style={{ width: `${logicalPct}%`, background: 'var(--color-purple)', transition: 'width 0.4s ease' }} />
                <div style={{ width: `${intuitivePct}%`, background: 'var(--color-gold)', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontFamily: 'var(--mono)', color: 'var(--text-muted)', marginTop: '1px' }}>
                <span style={{ color: 'var(--color-rose)' }}>EMP {emotionalPct}%</span>
                <span style={{ color: 'var(--color-purple)' }}>LOG {logicalPct}%</span>
                <span style={{ color: 'var(--color-gold)' }}>INT {intuitivePct}%</span>
              </div>
            </div>

            {/* Solfeggio Frequency Tuner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)', padding: '6px 10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1' }}>Sound Bath</span>
                <span style={{ fontSize: '10px', color: solfeggioFreq ? 'var(--color-gold)' : 'var(--text-muted)', fontWeight: '600', lineHeight: '1.2' }}>
                  {solfeggioFreq ? `${solfeggioFreq}Hz` : 'MUTED'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { freq: 432, label: '432' },
                  { freq: 528, label: '528' },
                  { freq: 963, label: '963' }
                ].map(item => (
                  <button
                    key={item.freq}
                    onClick={() => solfeggioFreq === item.freq ? stopSolfeggio() : playSolfeggio(item.freq)}
                    style={{
                      padding: '4px 6px',
                      background: solfeggioFreq === item.freq ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${solfeggioFreq === item.freq ? 'var(--color-gold)' : 'var(--border-light)'}`,
                      color: solfeggioFreq === item.freq ? 'var(--color-gold)' : 'var(--text-muted)',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: solfeggioFreq === item.freq ? 'bold' : 'normal'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {currentUser ? (
              <div 
                onClick={() => { setAuthMode('profile'); setShowAuthModal(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.25)', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s' }}
                title="Open Profile / Sacred Archive"
              >
                <User size={14} style={{ color: 'var(--color-teal)' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                  {currentUser}
                </span>
              </div>
            ) : (
              <button 
                className="btn-tour" 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                style={{ color: 'var(--color-teal)', borderColor: 'rgba(45, 212, 191, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={14} /> Sign In
              </button>
            )}

            <button className="btn-tour" onClick={() => setIsTourOpen(true)}>
              <BookOpen size={16} /> Tutorial Tour
            </button>
            {isSetupComplete && (
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={resetJourney}>
                Reset Map
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Grid */}
      {!showIntro && (
        <main className="dashboard-grid">
          {/* Left Column: Map and Sphinx Riddle */}
          <div className="dashboard-column">
            <ConstellationChart
              birthData={birthData}
              unlockedNodes={unlockedNodes}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
            <SphinxRiddle
              selectedNode={selectedNode}
              unlockedNodes={unlockedNodes}
              onUnlockNode={handleUnlockNode}
              onAddScore={(type, amt) => addScore(type, amt)}
            />
          </div>

          {/* Right Column: Setup Card OR Tabs Dashboard */}
          <div className="dashboard-column">
            {!isSetupComplete ? (
              <div id="tour-setup-card" className="glass-panel setup-card">
                <h2>Cast Your Soul Map</h2>
                <p className="setup-subtitle">
                  Enter birth coordinates to calculate Sun, Moon, and Ascendant accurately.
                </p>

                <form onSubmit={handleGenerate} className="setup-form">
                  <div className="form-group">
                    <label htmlFor="setup-name">First Name / Archetype</label>
                    <input
                      id="setup-name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      required
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="setup-dob">Date of Birth</label>
                    <input
                      id="setup-dob"
                      name="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      autoComplete="bday"
                    />
                  </div>

                  {/* Custom AM/PM Time Selector */}
                  <div className="form-group">
                    <label htmlFor="setup-birth-hour">Birth Time</label>
                    <div className="custom-time-picker">
                      <select id="setup-birth-hour" name="birthHour" value={birthHour} onChange={(e) => setBirthHour(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                          <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')} Hr</option>
                        ))}
                      </select>
                      <select id="setup-birth-minute" name="birthMinute" aria-label="Birth Minute" value={birthMinute} onChange={(e) => setBirthMinute(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                          <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')} Min</option>
                        ))}
                      </select>
                      <select id="setup-birth-period" name="birthPeriod" aria-label="Birth Period" value={birthPeriod} onChange={(e) => setBirthPeriod(e.target.value)}>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* City Autocomplete Search */}
                  <div className="form-group">
                    <label htmlFor="setup-city">City of Birth</label>
                    <div className="autocomplete-container">
                      <div style={{ position: 'relative' }}>
                        <input
                          id="setup-city"
                          name="citySearch"
                          type="text"
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            setShowCityDropdown(true);
                            setSelectedCity(null);
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="Search birth city..."
                          required
                          autoComplete="address-level2"
                        />
                        <Search size={16} style={{ position: 'absolute', right: '16px', top: '14px', color: 'var(--text-muted)' }} />
                      </div>

                      {showCityDropdown && citySearch && filteredCities.length > 0 && (
                        <div className="autocomplete-list">
                          {filteredCities.map(city => (
                            <div
                              key={city.id}
                              className="autocomplete-item"
                              onClick={() => handleCitySelect(city)}
                            >
                              <span style={{ fontWeight: '500' }}>{city.name}</span>
                              <span className="coords">{city.lat}, {city.lon}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCity && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', color: 'var(--color-teal)' }}>
                      <MapPin size={16} />
                      <span>
                        Located: {selectedCity.lat}, {selectedCity.lon} ({selectedCity.tz})
                      </span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={!name || !birthDate || !selectedCity}
                  >
                    Cast Soul Map
                  </button>

                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={handleAutofill}
                  >
                    Direct Auto-Fill (Arthur)
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1, position: 'relative' }}>
                <div className="glass-panel" style={{ padding: '6px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => setActiveTab('healer')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'healer' ? 'rgba(168, 85, 247, 0.15)' : 'none', color: activeTab === 'healer' ? 'var(--text-bright)' : 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Heart size={13} style={{ color: 'var(--color-rose)' }} /> Hearth
                  </button>
                  <button 
                    id="tour-tab-tarot"
                    onClick={() => setActiveTab('tarot')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'tarot' ? 'rgba(251, 191, 36, 0.15)' : 'none', color: activeTab === 'tarot' ? 'var(--text-bright)' : 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Layers size={13} style={{ color: 'var(--color-gold)' }} /> Tarot
                  </button>
                  <button 
                    id="tour-tab-conclave"
                    onClick={() => setActiveTab('conclave')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'conclave' ? 'rgba(168, 85, 247, 0.15)' : 'none', color: activeTab === 'conclave' ? 'var(--text-bright)' : 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Terminal size={13} style={{ color: 'var(--color-violet)' }} /> Conclave
                  </button>
                  <button 
                    onClick={() => setActiveTab('privacy')}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'privacy' ? 'rgba(45, 212, 191, 0.15)' : 'none', color: activeTab === 'privacy' ? 'var(--text-bright)' : 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <ShieldCheck size={13} style={{ color: 'var(--color-teal)' }} /> Guard
                  </button>
                </div>

                {/* Tab layout render */}
                  {activeTab === 'healer' && (
                    <HealerJournal
                      birthData={birthData}
                      sanitizedText={sanitizedText}
                      onAddScore={(type, amt) => addScore(type, amt)}
                    />
                  )}
                  {activeTab === 'tarot' && (
                    <TarotSanctuary 
                      onAddScore={(type, amt) => addScore(type, amt)}
                      onSaveTarot={(draw) => saveToArchive('tarot', draw)}
                      currentUser={currentUser}
                    />
                  )}
                  {activeTab === 'conclave' && (
                    <CosmicConclave
                      onAddScore={(type, amt) => addScore(type, amt)}
                      onSaveDecree={(decree) => saveToArchive('decrees', decree)}
                      currentUser={currentUser}
                    />
                  )}
                 {activeTab === 'privacy' && (
                   <PrivacySandbox
                     onTextSanitized={setSanitizedText}
                   />
                 )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Account Sanctum / Auth Modal */}
      {showAuthModal && (
        <div className="intro-overlay" style={{ background: 'rgba(5, 4, 10, 0.85)', zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--color-teal)' }}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>

            {/* Header Tabs */}
            {authMode !== 'profile' ? (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', gap: '16px' }}>
                <h3 
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  style={{ fontSize: '18px', fontFamily: 'var(--font-display)', cursor: 'pointer', color: authMode === 'login' ? 'var(--color-teal)' : 'var(--text-muted)', fontWeight: authMode === 'login' ? 'bold' : 'normal' }}
                >
                  Sign In
                </h3>
                <h3 
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  style={{ fontSize: '18px', fontFamily: 'var(--font-display)', cursor: 'pointer', color: authMode === 'register' ? 'var(--text-muted)' : 'var(--color-teal)', fontWeight: authMode === 'register' ? 'normal' : 'bold' }}
                >
                  Register
                </h3>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <User size={18} style={{ color: 'var(--color-teal)' }} />
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--color-teal)', fontWeight: 'bold' }}>
                  Cosmic Sanctum: {currentUser}
                </h3>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {authError && (
              <div style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', padding: '10px', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--mono)' }}>
                ⚠ {authError}
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="auth-login-username" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Username / Soul ID</label>
                  <input 
                    id="auth-login-username"
                    name="username"
                    type="text" 
                    value={authUsername} 
                    onChange={e => setAuthUsername(e.target.value)} 
                    placeholder="Enter Username" 
                    required 
                    autoComplete="username"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="auth-login-password" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Password</label>
                  <input 
                    id="auth-login-password"
                    name="password"
                    type="password" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)} 
                    placeholder="Enter Password" 
                    required 
                    autoComplete="current-password"
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                  Access Soul Labyrinth
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="auth-reg-username" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Create Username</label>
                  <input 
                    id="auth-reg-username"
                    name="username"
                    type="text" 
                    value={authUsername} 
                    onChange={e => setAuthUsername(e.target.value)} 
                    placeholder="Choose Username" 
                    required 
                    autoComplete="new-username"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="auth-reg-password" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Password</label>
                  <input 
                    id="auth-reg-password"
                    name="password"
                    type="password" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)} 
                    placeholder="Choose Password" 
                    required 
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                  Initiate Soul ID
                </button>
              </form>
            )}

            {/* PROFILE & ARCHIVE DISPLAY */}
            {authMode === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Custom API Key Section */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={14} style={{ color: 'var(--color-gold)' }} />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-bright)', fontWeight: 'bold' }}>
                      Gemini API Key
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="password" 
                      defaultValue={userApiKey} 
                      id="user-api-key-input"
                      placeholder="Paste Gemini API Key..." 
                      style={{ flexGrow: 1, padding: '8px 12px', fontSize: '12px' }} 
                    />
                    <button 
                      onClick={() => {
                        const val = document.getElementById('user-api-key-input').value;
                        saveApiKey(val);
                      }}
                      className="btn-tour" 
                      style={{ padding: '8px 14px', fontSize: '12px', color: 'var(--color-gold)', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                    >
                      Save Key
                    </button>
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    Your Key is saved purely in your local storage, encrypting direct API payloads.
                  </span>
                </div>

                {/* Archive Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    Your Sacred Archive
                  </span>

                  {/* Saved Placements */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-teal)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Placements History ({userArchive.placements?.length || 0})
                    </div>
                    {userArchive.placements?.length === 0 ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No saved placements yet.</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                        {userArchive.placements.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                            <span>{p.name} ({p.birthPlace})</span>
                            <button 
                              onClick={() => loadPlacementFromArchive(p)}
                              style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.3)', color: 'var(--color-teal)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}
                            >
                              Load
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saved Decrees */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-violet)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Saved Conclave Decrees ({userArchive.decrees?.length || 0})
                    </div>
                    {userArchive.decrees?.length === 0 ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No saved decrees yet.</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                        {userArchive.decrees.map((d, idx) => (
                          <div key={idx} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-bright)' }}>Q: "{d.query}"</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.title} ({d.timestamp})</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saved Tarot */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Saved Tarot Readings ({userArchive.tarot?.length || 0})
                    </div>
                    {userArchive.tarot?.length === 0 ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No saved tarot draws yet.</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                        {userArchive.tarot.map((t, idx) => (
                          <div key={idx} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-bright)' }}>Topic: {t.topic.toUpperCase()}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Cards: {t.cards?.join(', ')} ({t.timestamp})</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '8px 16px', fontSize: '13px', border: '1px solid rgba(244, 63, 94, 0.25)', color: '#f43f5e' }}
                  >
                    Logout Account
                  </button>
                  <button 
                    onClick={() => setShowAuthModal(false)}
                    className="btn-primary" 
                    style={{ flex: 1, padding: '8px 16px', fontSize: '13px', marginTop: 0 }}
                  >
                    Close Sanctum
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      <TutorialTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onStepChange={handleTourStepChange}
      />

      {/* Click Sparkles Overlay */}
      {sparkles.map(s => (
        <svg
          key={s.id}
          className="click-sparkle"
          viewBox="0 0 100 100"
          style={{
            position: 'fixed',
            top: `${s.y}px`,
            left: `${s.x}px`,
            color: s.color,
            fill: 'currentColor',
            width: s.size,
            height: s.size,
            '--tx': s.tx,
            '--ty': s.ty,
            pointerEvents: 'none',
            zIndex: 9999999
          }}
        >
          <path d="M50 0 L63 37 L100 50 L63 63 L50 100 L37 63 L0 50 L37 37 Z" />
        </svg>
      ))}
      {/* Top-Level Transparent Canvas for Cursor Trails */}
      <canvas id="trail-canvas" style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}></canvas>
    </div>
  );
}
