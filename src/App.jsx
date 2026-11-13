import { useEffect, useState } from 'react';

const TEST_DURATION = 60;

const paragraphs = [
  'React is a popular JavaScript library for building user interfaces. It makes it easier to create interactive and dynamic web applications.',
  'The best way to improve your typing speed is to practice every day. Focus on accuracy first, and speed will follow with consistent effort.',
  'Technology connects people around the world and gives us powerful tools to learn, create, and solve challenging problems.',
  'Clean code is easier to understand, maintain, and improve. Small thoughtful steps can make a large difference in a software project.'
];

function StatCard({ label, value, accent = '' }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className={accent}>{value}</strong>
    </div>
  );
}

function Results({ wpm, accuracy, correctChars, typedChars, onRestart }) {
  return (
    <section className="results" aria-live="polite">
      <div className="result-icon">⚡</div>
      <h2>Test Complete!</h2>
      <p className="muted">Here are your final Type Rush results.</p>
      <div className="stats-grid results-grid">
        <StatCard label="Words Per Minute" value={wpm} accent="green" />
        <StatCard label="Accuracy" value={`${accuracy}%`} accent="green" />
        <StatCard label="Correct Characters" value={correctChars} />
        <StatCard label="Characters Typed" value={typedChars} />
      </div>
      <button className="restart-button" onClick={onRestart}>↻ Try Again</button>
    </section>
  );
}

export default function App() {
  const [paragraph, setParagraph] = useState(paragraphs[0]);
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Count correct characters by comparing each typed character to the target.
  const correctChars = [...typedText].reduce((total, char, index) => {
    return total + (char === paragraph[index] ? 1 : 0);
  }, 0);

  const typedChars = typedText.length;
  const accuracy = typedChars === 0
    ? 100
    : Math.round((correctChars / typedChars) * 100);

  // Conventional WPM: correct characters / 5 / elapsed minutes.
  const elapsedSeconds = TEST_DURATION - timeLeft;
  const wpm = elapsedSeconds > 0
    ? Math.round((correctChars / 5) / (elapsedSeconds / 60))
    : 0;

  // Start the 60-second timer on the first keystroke.
  // useEffect manages the interval and clears it on cleanup.
  useEffect(() => {
    if (!isRunning || isFinished) return;

    const intervalId = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, isFinished]);

  function handleTyping(event) {
    if (isFinished) return;

    const value = event.target.value.slice(0, paragraph.length);
    setTypedText(value);

    if (!isRunning && value.length > 0) {
      setIsRunning(true);
    }

    // End the test early when the complete paragraph is typed.
    if (value === paragraph) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }

  function handleRestart() {
    // Pick a paragraph, avoiding the current one where possible.
    const choices = paragraphs.filter((item) => item !== paragraph);
    const nextParagraph = choices[Math.floor(Math.random() * choices.length)];

    setParagraph(nextParagraph);
    setTypedText('');
    setTimeLeft(TEST_DURATION);
    setIsRunning(false);
    setIsFinished(false);
  }

  const progress = Math.round((typedChars / paragraph.length) * 100);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-icon">⚛</span> React JS</div>
        <span className="challenge-tag">👥 GROUP CHALLENGE</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR TYPING PERFORMANCE</p>
        <h1>TYPE <span>RUSH</span><b>ϟ</b></h1>
        <p className="subtitle">Build a Typing Speed Tester Using React JS</p>
      </section>

      <section className="tester-card">
        {isFinished ? (
          <Results
            wpm={wpm}
            accuracy={accuracy}
            correctChars={correctChars}
            typedChars={typedChars}
            onRestart={handleRestart}
          />
        ) : (
          <>
            <div className="tester-heading">
              <div>
                <h2>⚡ Type Rush</h2>
                <p className="muted">
                  {isRunning ? 'Keep going — type the paragraph!' : 'Start typing to begin the 60-second test.'}
                </p>
              </div>
              <span className={`status ${isRunning ? 'active' : ''}`}>
                {isRunning ? '● LIVE' : '● READY'}
              </span>
            </div>

            <div className="stats-grid">
              <StatCard label="Time Left" value={`00:${String(timeLeft).padStart(2, '0')}`} accent="purple" />
              <StatCard label="WPM" value={wpm} accent="green" />
              <StatCard label="Accuracy" value={`${accuracy}%`} accent="green" />
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Typing Progress</span><strong>{typedChars}/{paragraph.length} chars ({progress}%)</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="paragraph-box" aria-label="Paragraph to type">
              {paragraph.split('').map((char, index) => {
                let className = '';
                if (index < typedChars) {
                  className = typedText[index] === char ? 'correct' : 'incorrect';
                } else if (index === typedChars) {
                  className = 'current';
                }
                return <span className={className} key={index}>{char}</span>;
              })}
            </div>

            <label className="typing-label" htmlFor="typing-input">Your typing area</label>
            <textarea
              id="typing-input"
              value={typedText}
              onChange={handleTyping}
              disabled={isFinished}
              placeholder="Start typing here..."
              autoFocus
              spellCheck="false"
              rows={4}
            />

            <div className="bottom-row">
              <span className="muted">Correct characters: <strong>{correctChars}</strong></span>
              <button className="restart-button secondary" onClick={handleRestart}>↻ Restart</button>
            </div>
          </>
        )}
      </section>

      <footer>
        <span>Built with React Components, JSX, Props, useState &amp; useEffect</span>
        <span className="footer-accent">60 SECONDS · ONE TEAM · ONE REACT APP</span>
      </footer>
    </main>
  );
}
