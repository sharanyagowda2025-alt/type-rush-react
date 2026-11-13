import { useEffect, useState } from 'react';

function Hourglass({ running, remaining, duration }) {
  const progress = 1 - remaining / duration;
  return (
    <div className={`hourglass ${running ? 'flowing' : ''}`} aria-label="Animated hourglass">
      <svg viewBox="0 0 240 360" role="img" aria-label="Vintage hourglass with falling sand">
        <defs>
          <linearGradient id="brass" x1="0" x2="1">
            <stop offset="0" stopColor="#70451f"/><stop offset=".25" stopColor="#e6bd72"/>
            <stop offset=".55" stopColor="#9b6a32"/><stop offset=".82" stopColor="#f0d49a"/><stop offset="1" stopColor="#70451f"/>
          </linearGradient>
          <linearGradient id="glass" x1="0" x2="1">
            <stop offset="0" stopColor="#f7dfae" stopOpacity=".13"/><stop offset=".5" stopColor="#fff4d6" stopOpacity=".48"/>
            <stop offset="1" stopColor="#d9a65c" stopOpacity=".12"/>
          </linearGradient>
          <clipPath id="topChamber">
            <path d="M48 48 Q48 130 108 171 L132 171 Q192 130 192 48 Z"/>
          </clipPath>
          <clipPath id="bottomChamber">
            <path d="M108 189 Q48 230 48 312 L192 312 Q192 230 132 189 Z"/>
          </clipPath>
        </defs>
        <rect x="24" y="22" width="192" height="16" rx="5" fill="url(#brass)" stroke="#4b2e17"/>
        <rect x="24" y="322" width="192" height="16" rx="5" fill="url(#brass)" stroke="#4b2e17"/>
        <rect x="38" y="36" width="12" height="288" rx="5" fill="url(#brass)"/>
        <rect x="190" y="36" width="12" height="288" rx="5" fill="url(#brass)"/>
        <path d="M48 48 Q48 130 108 171 L132 171 Q192 130 192 48" fill="url(#glass)" stroke="#d9b779" strokeWidth="3"/>
        <path d="M108 189 Q48 230 48 312 L192 312 Q192 230 132 189" fill="url(#glass)" stroke="#d9b779" strokeWidth="3"/>
        <g clipPath="url(#topChamber)">
          <path d={`M48 ${48 + 115 * (1-progress)} Q120 ${160 + 0} 192 ${48 + 115 * (1-progress)} L192 48 L48 48 Z`} fill="#c58a3e" opacity=".88"/>
          <path d={`M48 ${48 + 115 * (1-progress)} Q120 ${48 + 115 * (1-progress) + 8} 192 ${48 + 115 * (1-progress)} `} stroke="#f4d08a" strokeWidth="2" fill="none"/>
        </g>
        <g clipPath="url(#bottomChamber)">
          <path d={`M48 ${312 - 110*progress} Q120 ${312 - 110*progress - 12} 192 ${312 - 110*progress} L192 312 L48 312 Z`} fill="#c58a3e" opacity=".9"/>
        </g>
        <path className="sand-stream" d="M120 171 L120 189" stroke="#f5d58b" strokeWidth="3" strokeLinecap="round"/>
        <circle className="sand-dot dot1" cx="120" cy="176" r="2.3" fill="#ffe2a2"/>
        <circle className="sand-dot dot2" cx="120" cy="182" r="1.8" fill="#ffe2a2"/>
        <circle className="sand-dot dot3" cx="120" cy="186" r="2" fill="#ffe2a2"/>
        <path d="M65 65 Q70 115 106 150" fill="none" stroke="#fff4d6" strokeWidth="4" opacity=".35" strokeLinecap="round"/>
        <path d="M64 270 Q68 230 106 205" fill="none" stroke="#fff4d6" strokeWidth="4" opacity=".25" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function App() {
  const [now, setNow] = useState(new Date());
  const [format24, setFormat24] = useState(false);
  const [duration, setDuration] = useState(60 * 60);
  const [remaining, setRemaining] = useState(60 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const clockId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockId);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timerId = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [running]);

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: !format24
  });
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timerDisplay = `${String(Math.floor(remaining/3600)).padStart(2,'0')}:${String(Math.floor((remaining%3600)/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;

  function resetTimer() {
    setRunning(false);
    setRemaining(duration);
  }
  function changeDuration(value) {
    const seconds = Number(value) * 60;
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
  }

  return (
    <main className="page">
      <div className="ornament top-ornament">✦ ──────── ✦ ──────── ✦</div>
      <header>
        <p className="overline">AN ANTIQUE TIMEKEEPING INSTRUMENT</p>
        <h1>CHRONOS</h1>
        <p className="subtitle">The Falling Sands Digital Clock</p>
        <div className="divider"><span>❧</span></div>
      </header>

      <section className="clock-panel">
        <div className="clock-top">
          <span className="small-label">LOCAL TIME</span>
          <button className="format-toggle" onClick={() => setFormat24(v => !v)}>
            {format24 ? '24-HOUR' : '12-HOUR'} · SWITCH
          </button>
        </div>
        <div className="digital-time" aria-live="polite">{time}</div>
        <div className="date-line">{date}</div>
        <div className="hourglass-wrap">
          <span className="roman roman-left">Ⅻ<br/>Ⅸ<br/>Ⅵ</span>
          <Hourglass running={running} remaining={remaining} duration={duration}/>
          <span className="roman roman-right">Ⅲ<br/>Ⅵ<br/>Ⅸ</span>
        </div>
        <div className="timer-title">THE SAND TIMER</div>
        <div className="timer-readout">{timerDisplay}</div>
        <div className="timer-controls">
          <select value={duration/60} onChange={e => changeDuration(e.target.value)} aria-label="Timer duration">
            <option value="1">1 minute</option><option value="5">5 minutes</option>
            <option value="15">15 minutes</option><option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
          </select>
          <button onClick={() => setRunning(v => !v)} className="gold-button">{running ? 'Ⅱ PAUSE' : '▶ START'}</button>
          <button onClick={resetTimer} className="outline-button">↻ RESET</button>
        </div>
        {remaining === 0 && <p className="finished">The sands have settled. Time is complete.</p>}
      </section>
      <footer>
        <div className="footer-ornament">❦</div>
        <p>CRAFTED IN THE SPIRIT OF ANOTHER ERA</p>
        <small>React · JavaScript · CSS Animation · SVG</small>
      </footer>
    </main>
  );
}
