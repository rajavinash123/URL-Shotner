import { useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c26;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.16);
    --accent: #7c5cfc;
    --accent-light: #a98bfd;
    --accent-glow: rgba(124,92,252,0.25);
    --text: #f0effe;
    --text-secondary: rgba(240,239,254,0.55);
    --text-tertiary: rgba(240,239,254,0.3);
    --success: #22d3a0;
    --success-bg: rgba(34,211,160,0.1);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px;
    --radius-xl: 24px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
    background: rgba(10,10,15,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-display); font-weight: 700; font-size: 1.15rem;
    color: var(--text); text-decoration: none; cursor: pointer;
  }
  .nav-logo-icon {
    width: 32px; height: 32px; background: var(--accent);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-link {
    color: var(--text-secondary); font-size: 0.875rem; font-weight: 400;
    text-decoration: none; cursor: pointer; transition: color 0.2s;
    background: none; border: none; font-family: var(--font-body);
  }
  .nav-link:hover { color: var(--text); }
  .nav-link.active { color: var(--text); }
  .nav-cta {
    background: var(--accent); color: white; border: none;
    padding: 0.5rem 1.25rem; border-radius: var(--radius-sm);
    font-size: 0.875rem; font-weight: 500; cursor: pointer;
    font-family: var(--font-body); transition: opacity 0.2s, transform 0.1s;
  }
  .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }
  .nav-mobile-toggle {
    display: none; background: none; border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 0.4rem 0.6rem;
    color: var(--text); cursor: pointer; font-size: 1rem;
  }

  /* HERO */
  .hero {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 8rem 1.5rem 5rem;
    position: relative; overflow: hidden; text-align: center;
  }
  .hero-glow {
    position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(124,92,252,0.12); border: 1px solid rgba(124,92,252,0.3);
    color: var(--accent-light); border-radius: 100px;
    padding: 0.35rem 0.85rem; font-size: 0.8rem; font-weight: 500;
    margin-bottom: 1.75rem;
  }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .hero h1 {
    font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -0.02em;
    color: var(--text); margin-bottom: 1.25rem; max-width: 800px;
  }
  .hero h1 span { color: var(--accent-light); }
  .hero p {
    font-size: clamp(1rem, 2.5vw, 1.2rem); color: var(--text-secondary);
    max-width: 520px; line-height: 1.7; margin-bottom: 2.75rem;
    font-weight: 300;
  }

  /* SHORTENER CARD */
  .shortener-card {
    width: 100%; max-width: 640px; position: relative;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 1.5rem;
    box-shadow: 0 0 0 1px rgba(124,92,252,0.1), 0 32px 64px rgba(0,0,0,0.4);
  }
  .input-row { display: flex; gap: 0.75rem; align-items: stretch; }
  .url-input {
    flex: 1; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-md); padding: 0.85rem 1rem;
    color: var(--text); font-size: 0.95rem; font-family: var(--font-body);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 0;
  }
  .url-input::placeholder { color: var(--text-tertiary); }
  .url-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .shorten-btn {
    background: var(--accent); color: white; border: none;
    border-radius: var(--radius-md); padding: 0.85rem 1.5rem;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    font-family: var(--font-display); transition: opacity 0.2s, transform 0.1s;
    white-space: nowrap;
  }
  .shorten-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .shorten-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .shorten-btn.loading { position: relative; }

  .result-box {
    margin-top: 1rem; background: var(--success-bg);
    border: 1px solid rgba(34,211,160,0.2); border-radius: var(--radius-md);
    padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;
    gap: 0.75rem; animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .result-label { font-size: 0.75rem; color: var(--success); font-weight: 500; margin-bottom: 2px; }
  .result-url { font-family: monospace; font-size: 0.9rem; color: var(--text); word-break: break-all; }
  .result-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--text-secondary); cursor: pointer; display: flex;
    align-items: center; justify-content: center; font-size: 1rem;
    transition: all 0.2s; text-decoration: none;
  }
  .icon-btn:hover { border-color: var(--border-hover); color: var(--text); }
  .icon-btn.copied { border-color: var(--success); color: var(--success); }

  .error-box {
    margin-top: 0.75rem; padding: 0.75rem 1rem;
    background: rgba(226,75,74,0.1); border: 1px solid rgba(226,75,74,0.25);
    border-radius: var(--radius-sm); color: #f09595; font-size: 0.875rem;
    animation: slideUp 0.3s ease;
  }

  /* STATS STRIP */
  .stats-strip {
    display: flex; justify-content: center; gap: 0; margin-top: 4rem;
    border-top: 1px solid var(--border);
  }
  .stat-item {
    text-align: center; padding: 2.5rem 3rem;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-num { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text); }
  .stat-label { font-size: 0.825rem; color: var(--text-secondary); margin-top: 4px; }

  /* FEATURES */
  .features-section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }
  .section-eyebrow {
    font-size: 0.8rem; font-weight: 600; color: var(--accent-light);
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem;
    font-family: var(--font-display);
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700; color: var(--text); margin-bottom: 1rem;
    line-height: 1.2;
  }
  .section-sub { color: var(--text-secondary); font-size: 1.05rem; max-width: 500px; line-height: 1.7; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 3.5rem; }
  .feature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.75rem;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feature-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
  .feature-icon {
    width: 44px; height: 44px; border-radius: var(--radius-sm);
    background: rgba(124,92,252,0.15); border: 1px solid rgba(124,92,252,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; margin-bottom: 1.25rem;
  }
  .feature-title { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; margin-bottom: 0.5rem; }
  .feature-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; }

  /* HOW IT WORKS */
  .how-section {
    padding: 6rem 2rem; background: var(--surface);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .how-inner { max-width: 1100px; margin: 0 auto; }
  .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3.5rem; position: relative; }
  .step-card { text-align: center; }
  .step-num {
    width: 52px; height: 52px; border-radius: 50%;
    border: 1px solid rgba(124,92,252,0.3); background: rgba(124,92,252,0.1);
    color: var(--accent-light); font-family: var(--font-display);
    font-weight: 700; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }
  .step-title { font-family: var(--font-display); font-weight: 600; margin-bottom: 0.5rem; }
  .step-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; }

  /* FOOTER */
  footer {
    padding: 2rem; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .footer-logo { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; }
  .footer-text { color: var(--text-tertiary); font-size: 0.825rem; }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-link { color: var(--text-tertiary); font-size: 0.825rem; text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .footer-link:hover { color: var(--text-secondary); }

  /* PAGE: SHORTENER STANDALONE */
  .page-shortener {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 8rem 1.5rem 4rem; min-height: 100vh;
  }
  .page-title { font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; margin-bottom: 0.5rem; text-align: center; }
  .page-sub { color: var(--text-secondary); margin-bottom: 2.5rem; text-align: center; }

  /* MOBILE MENU */
  .mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0; z-index: 99;
    background: rgba(10,10,15,0.98); border-bottom: 1px solid var(--border);
    padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;
    backdrop-filter: blur(20px); animation: slideDown 0.2s ease;
  }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .mobile-nav-link {
    color: var(--text-secondary); font-size: 1rem; padding: 0.75rem 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
    background: none; border-left: none; border-right: none; border-top: none;
    text-align: left; font-family: var(--font-body); transition: color 0.2s;
  }
  .mobile-nav-link:last-child { border-bottom: none; }
  .mobile-nav-link:hover { color: var(--text); }
  .mobile-cta {
    margin-top: 0.5rem; background: var(--accent); color: white;
    border: none; border-radius: var(--radius-sm); padding: 0.85rem 1rem;
    font-size: 0.95rem; font-weight: 600; cursor: pointer; font-family: var(--font-display);
    text-align: center;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-links, nav > .nav-cta { display: none; }
    .nav-mobile-toggle { display: flex; align-items: center; }
    nav { padding: 0 1.25rem; }
    .stats-strip { flex-direction: column; }
    .stat-item { border-right: none; border-bottom: 1px solid var(--border); padding: 1.75rem; }
    .stat-item:last-child { border-bottom: none; }
    .steps-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .input-row { flex-direction: column; }
    .shorten-btn { width: 100%; }
    footer { flex-direction: column; text-align: center; }
    .footer-links { justify-content: center; }
    .features-section { padding: 4rem 1.25rem; }
    .how-section { padding: 4rem 1.25rem; }
  }
  @media (max-width: 480px) {
    .shortener-card { padding: 1.25rem; border-radius: var(--radius-lg); }
    .result-box { flex-direction: column; align-items: flex-start; }
    .result-actions { width: 100%; justify-content: flex-end; }
  }
`;

const FEATURES = [
  { icon: "⚡", title: "Instant shortening", desc: "Paste any URL and get a short link in milliseconds. No account required to get started." },
  { icon: "📊", title: "Click analytics", desc: "Track how many times your link was clicked, where visitors come from, and when." },
  { icon: "🔒", title: "Secure & private", desc: "All links are encrypted. We never sell your data or share analytics with third parties." },
  { icon: "🎨", title: "Custom slugs", desc: "Create branded short links with your own custom alias instead of random characters." },
  { icon: "📱", title: "QR codes", desc: "Every short link automatically gets a QR code ready to download and share anywhere." },
  { icon: "🌐", title: "API access", desc: "Integrate link shortening directly into your apps with our clean REST API." },
];

const STEPS = [
  { num: "1", title: "Paste your URL", desc: "Drop any long URL — a blog post, product page, or document link — into the input field." },
  { num: "2", title: "Click Shorten", desc: "We instantly generate a clean, compact link optimized for sharing on any platform." },
  { num: "3", title: "Share anywhere", desc: "Copy your short link and use it in emails, social media, or wherever you need it." },
];

function ShortenerWidget() {
  const [url, setUrl] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // const generateShortURL = async () => {
  //   if (!url.trim()) { setError("Please enter a URL."); return; }
  //   setLoading(true); setError(""); setShortURL("");
  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/url`, { url });
  //     setShortURL(`https://url-shotnerme.onrender.com/${response.data.id}`);
  //   } catch {
  //     setError("Failed to shorten URL. Please check the server is running.");
  //   } finally { setLoading(false); }
  // };
const generateShortURL = async () => {
    if (!url.trim()) { setError("Please enter a URL."); return; }
    setLoading(true); setError(""); setShortURL("");

    const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000"

    try {
      const response = await axios.post(`${baseURL}/url`, { url });
      setShortURL(`${baseURL}/${response.data.id}`);
    } catch {
      setError("Failed to shorten URL. Please check the server is running.");
    } finally { setLoading(false); }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(shortURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKey = (e) => { if (e.key === "Enter") generateShortURL(); };

  return (
    <div className="shortener-card">
      <div className="input-row">
        <input
          className="url-input"
          type="url"
          placeholder="https://your-very-long-url.com/goes/here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className={`shorten-btn${loading ? " loading" : ""}`} onClick={generateShortURL} disabled={loading}>
          {loading ? "Shortening…" : "Shorten →"}
        </button>
      </div>
      {error && <div className="error-box">{error}</div>}
      {shortURL && (
        <div className="result-box">
          <div>
            <div className="result-label">✓ Your short link is ready</div>
            <div className="result-url">{shortURL}</div>
          </div>
          <div className="result-actions">
            <button className={`icon-btn${copied ? " copied" : ""}`} onClick={handleCopy} title="Copy">
              {copied ? "✓" : "⎘"}
            </button>
            <a className="icon-btn" href={shortURL} target="_blank" rel="noreferrer" title="Open">↗</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAV */}
        <nav>
          <span className="nav-logo" onClick={() => navigate("home")}>
            <span className="nav-logo-icon">⚡</span>
            Snip.ly
          </span>
          <div className="nav-links">
            <button className={`nav-link${page === "home" ? " active" : ""}`} onClick={() => navigate("home")}>Home</button>
            <button className={`nav-link${page === "shorten" ? " active" : ""}`} onClick={() => navigate("shorten")}>Shorten</button>
            <button className="nav-link" onClick={() => navigate("features")}>Features</button>
            <button className="nav-link" onClick={() => navigate("how")}>How it works</button>
          </div>
          <button className="nav-cta" onClick={() => navigate("shorten")}>Get started</button>
          <button className="nav-mobile-toggle" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu">
            <button className="mobile-nav-link" onClick={() => navigate("home")}>Home</button>
            <button className="mobile-nav-link" onClick={() => navigate("shorten")}>Shorten a URL</button>
            <button className="mobile-nav-link" onClick={() => navigate("features")}>Features</button>
            <button className="mobile-nav-link" onClick={() => navigate("how")}>How it works</button>
            <button className="mobile-cta" onClick={() => navigate("shorten")}>Get started free →</button>
          </div>
        )}

        {/* HOME PAGE */}
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-glow" />
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Free forever · No account needed
              </div>
              <h1>Short links that<br /><span>actually work</span></h1>
              <p>Paste any URL, get a clean short link in seconds. Track clicks, share everywhere, and keep full control.</p>
              <ShortenerWidget />
            </section>

            <div className="stats-strip">
              {[["12M+","Links created"],["4.8B+","Clicks tracked"],["99.9%","Uptime SLA"],["180+","Countries served"]].map(([n, l]) => (
                <div className="stat-item" key={n}>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>

            {/* FEATURES INLINE */}
            <div className="features-section">
              <div className="section-eyebrow">Features</div>
              <div className="section-title">Everything you need<br />to share smarter</div>
              <p className="section-sub">Built for marketers, developers, and anyone who sends links.</p>
              <div className="features-grid">
                {FEATURES.map(f => (
                  <div className="feature-card" key={f.title}>
                    <div className="feature-icon">{f.icon}</div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOW IT WORKS INLINE */}
            <div className="how-section">
              <div className="how-inner">
                <div style={{textAlign:"center",marginBottom:"0.5rem"}} className="section-eyebrow">How it works</div>
                <div className="section-title" style={{textAlign:"center"}}>Three steps to a shorter link</div>
                <div className="steps-grid">
                  {STEPS.map(s => (
                    <div className="step-card" key={s.num}>
                      <div className="step-num">{s.num}</div>
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* SHORTEN PAGE */}
        {page === "shorten" && (
          <div className="page-shortener">
            <div className="page-title">Shorten a URL</div>
            <p className="page-sub">Paste your link below and get a compact, shareable URL instantly.</p>
            <ShortenerWidget />
          </div>
        )}

        {/* FEATURES PAGE */}
        {page === "features" && (
          <div className="features-section" style={{paddingTop:"8rem"}}>
            <div className="section-eyebrow">Features</div>
            <div className="section-title">Everything you need<br />to share smarter</div>
            <p className="section-sub">Built for marketers, developers, and anyone who sends links.</p>
            <div className="features-grid">
              {FEATURES.map(f => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS PAGE */}
        {page === "how" && (
          <div className="how-section" style={{paddingTop:"8rem", minHeight:"100vh"}}>
            <div className="how-inner">
              <div className="section-eyebrow">How it works</div>
              <div className="section-title">Three steps to a shorter link</div>
              <div className="steps-grid" style={{marginTop:"3rem"}}>
                {STEPS.map(s => (
                  <div className="step-card" key={s.num}>
                    <div className="step-num">{s.num}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer>
          <div>
            <div className="footer-logo">⚡ Snip.ly</div>
            <div className="footer-text" style={{marginTop:"4px"}}>Shorten. Share. Track.</div>
          </div>
          <div className="footer-links">
            <span className="footer-link" onClick={() => navigate("home")}>Home</span>
            <span className="footer-link" onClick={() => navigate("shorten")}>Shorten</span>
            <span className="footer-link" onClick={() => navigate("features")}>Features</span>
            <span className="footer-link" onClick={() => navigate("how")}>How it works</span>
          </div>
          <div className="footer-text">© 2026 Snip.ly. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}