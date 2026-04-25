import React, { useState, useEffect, useRef } from 'react';
import './Accessibility.css';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    bigCursor: false,
    zoom: false,
    dyslexia: false,
    mask: false,
    voice: false
  });

  const recognitionRef = useRef(null);

  // Sync state to the <body> tag
  useEffect(() => {
    const classes = {
      bigCursor: 'a11y-big-cursor',
      dyslexia: 'a11y-dyslexia',
      zoom: 'a11y-zoom'
    };

    Object.entries(classes).forEach(([key, className]) => {
      if (settings[key]) document.body.classList.add(className);
      else document.body.classList.remove(className);
    });
  }, [settings]);

  // Mask & Zoom Tracking
  useEffect(() => {
    const move = (e) => {
      const top = document.getElementById('m-top');
      const bot = document.getElementById('m-bot');
      if (top && bot && settings.mask) {
        top.style.display = 'block';
        bot.style.display = 'block';
        top.style.height = `${e.clientY - 45}px`;
        bot.style.top = `${e.clientY + 45}px`;
        bot.style.height = "100%";
      }
      if (settings.zoom) {
        document.body.style.transformOrigin = `${(e.clientX / window.innerWidth) * 100}% ${(e.clientY / window.innerHeight) * 100}%`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [settings.mask, settings.zoom]);

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 999999 }}>
      {/* Mask Overlays */}
      <div id="m-top" className="a11y-mask-layer" style={{ top: 0 }} />
      <div id="m-bot" className="a11y-mask-layer" />

      <button onClick={() => setIsOpen(!isOpen)} className="fab">
        {isOpen ? '✕' : '♿'}
      </button>

      {isOpen && (
        <div className="menu-card">
          {/* Mapping through settings to create toggles */}
          {Object.keys(settings).map(key => (
            <label key={key} className="toggle-row">
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <input 
                type="checkbox" 
                checked={settings[key]} 
                onChange={() => setSettings(s => ({...s, [key]: !s[key]}))} 
              />
            </label>
          ))}
          <button onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText))}>Read</button>
          <button onClick={() => window.speechSynthesis.cancel()}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;