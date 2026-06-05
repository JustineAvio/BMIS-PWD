import React, { useState, useEffect, useRef } from "react";
import "./Accessibility.css";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    bigCursor: false,
    zoom: false,
    dyslexia: false,
    mask: false,
    voice: false,
  });

  const cursorRef = useRef(null);

  // BODY CLASS FEATURES
  useEffect(() => {
    document.body.classList.toggle("a11y-dyslexia", settings.dyslexia);
    document.body.classList.toggle("a11y-big-cursor", settings.bigCursor);
  }, [settings.dyslexia, settings.bigCursor]);

  // ZOOM (FIXED ROOT METHOD)
  useEffect(() => {
    const root = document.getElementById("app-root") || document.body;

    if (settings.zoom) {
      root.style.transition = "transform 0.2s ease";
      root.style.transform = "scale(1.1)";
      root.style.transformOrigin = "center";
    } else {
      root.style.removeProperty("transform");
      root.style.removeProperty("transform-origin");
    }
  }, [settings.zoom]);

  // MASK (FIXED PROPERLY)
  useEffect(() => {
    const top = document.getElementById("m-top");
    const bot = document.getElementById("m-bot");

    if (!top || !bot) return;

    if (!settings.mask) {
      top.style.display = "none";
      bot.style.display = "none";
      return;
    }

    const move = (e) => {
      const gap = 60;

      const yTop = e.clientY - gap;
      const yBottom = e.clientY + gap;

      // TOP MASK (always from 0 → cursor area)
      top.style.display = "block";
      top.style.position = "fixed";
      top.style.top = "0";
      top.style.left = "0";
      top.style.width = "100%";
      top.style.height = `${Math.max(0, yTop)}px`;

      // BOTTOM MASK (from lower gap → bottom of screen)
      bot.style.display = "block";
      bot.style.position = "fixed";
      bot.style.left = "0";
      bot.style.width = "100%";
      bot.style.top = `${yBottom}px`;
      bot.style.height = `calc(100vh - ${yBottom}px)`;
    };

  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, [settings.mask]);

  // BIG CURSOR (FIXED REAL VERSION)
  useEffect(() => {
    if (!settings.bigCursor) {
      if (cursorRef.current) cursorRef.current.remove();
      cursorRef.current = null;
      return;
    }

    const cursor = document.createElement("div");
    cursor.id = "a11y-cursor";
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      cursor.remove();
    };
  }, [settings.bigCursor]);

  // TOGGLE
  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // VOICE (FIXED)
  const readPage = () => {
    window.speechSynthesis.cancel();
    const text = document.body.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
  <div className="a11y-wrapper">
    {/* MASK */}
    <div id="m-top" className="a11y-mask-layer" />
    <div id="m-bot" className="a11y-mask-layer" />

    {/* FAB */}
    <button onClick={() => setIsOpen(!isOpen)} className="a11y-fab">
      {isOpen ? "✕" : "♿"}
    </button>

    {/* MENU */}
    {isOpen && (
      <div className="a11y-menu-card">
        {Object.keys(settings).map((key) => (
          <label key={key} className="a11y-toggle-row">
            {key}
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggleSetting(key)}
            />
          </label>
        ))}

        <button onClick={readPage} className="a11y-btn-primary">
          Read
        </button>

        <button
          onClick={() => window.speechSynthesis.cancel()}
          className="a11y-btn-danger"
        >
          Stop
        </button>
      </div>
    )}
  </div>
);
};

export default AccessibilityMenu;