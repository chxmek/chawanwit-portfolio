// portfolio.jsx
// Portfolio sections + page composition.
// Theme: cosmic dark, accent gradients, scroll-reveal animations.

const helv = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, SFMono-Regular, "Courier New", monospace';

// ── Color system ────────────────────────────────────────────────────────────
const GROUP_COLOR = {
  Application: '#818cf8',   // indigo
  Services:    '#22d3ee',   // cyan
  Mobile:      '#fbbf24',   // amber
  Data:        '#34d399',   // emerald
  Ops:         '#60a5fa',   // blue
  Automation:  '#a78bfa',   // violet
  AI:          '#f472b6',   // pink
};

const TAG_COLOR = [
  '#818cf8','#22d3ee','#34d399','#f472b6','#fbbf24','#60a5fa','#a78bfa','#fb923c',
];

function tagColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return TAG_COLOR[h % TAG_COLOR.length];
}

// ── Scroll-reveal ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, x = 0, y = 48, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : `translate(${x}px,${y}px)`,
      transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ── Responsive breakpoint hook ───────────────────────────────────────────────
function useW() {
  const [w, setW] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ── Shared visual atoms ─────────────────────────────────────────────────────

function SectionLabel({ index, title }) {
  const [ref, vis] = useReveal(0.3);
  return (
    <div ref={ref} style={{
      display: 'flex', alignItems: 'baseline', gap: 24,
      borderTop: '2px solid transparent',
      borderImage: 'linear-gradient(90deg,#818cf8,#22d3ee,#34d399) 1',
      paddingTop: 18, marginBottom: 64,
      opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(-30px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <span style={{
        fontFamily: mono, fontSize: 12,
        background: 'linear-gradient(90deg,#818cf8,#22d3ee)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '0.32em', textTransform: 'uppercase',
      }}>{index}</span>
      <span style={{
        fontFamily: mono, fontSize: 12, color: '#fff',
        letterSpacing: '0.32em', textTransform: 'uppercase',
      }}>{title}</span>
    </div>
  );
}

// ── Top nav ─────────────────────────────────────────────────────────────────

function TopNav() {
  const w = useW();
  const isMobile = w < 900;
  const [open, setOpen] = React.useState(false);

  const links = [
    ['00', 'Intro'], ['01', 'About'], ['02', 'Focus'], ['03', 'Experience'],
    ['04', 'Principles'], ['05', 'Skills'], ['06', 'Education'], ['07', 'Contact'],
  ];

  const close = () => setOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '14px 20px' : '16px 32px',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontFamily: mono, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: '#fff',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#22d3ee)', display: 'inline-block', boxShadow: '0 0 8px #818cf8' }} />
          <span>Chawanwit · Silakhan</span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {links.map(([n, t]) => (
              <a key={n} href={`#sec-${n}`} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 120ms', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 4 }}>{n}</span>{t}
              </a>
            ))}
          </div>
        )}

        {/* Hamburger button */}
        {isMobile && (
          <button onClick={() => setOpen(o => !o)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6,
            display: 'flex', flexDirection: 'column', gap: 5, color: '#fff',
          }}>
            <span style={{ display: 'block', width: 22, height: 2, background: open ? 'linear-gradient(90deg,#818cf8,#22d3ee)' : '#fff', borderRadius: 2, transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: 'transform 200ms, background 200ms' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2, opacity: open ? 0 : 1, transition: 'opacity 200ms' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: open ? 'linear-gradient(90deg,#818cf8,#22d3ee)' : '#fff', borderRadius: 2, transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: 'transform 200ms, background 200ms' }} />
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49,
          background: 'rgba(0,0,0,0.96)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 32px 40px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 250ms ease',
        }}>
          <div style={{ display: 'grid', gap: 4 }}>
            {links.map(([n, t]) => (
              <a key={n} href={`#sec-${n}`} onClick={close} style={{
                display: 'flex', alignItems: 'baseline', gap: 16,
                padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', textDecoration: 'none',
              }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em' }}>{n}</span>
                <span style={{ fontFamily: helv, fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>{t}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero (the cosmic animation) ─────────────────────────────────────────────

function Hero() {
  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-00" style={{ position: 'relative' }}>
      {/* Intro strip above the stage */}
      <div style={{
        padding: isMobile ? '90px 20px 32px' : isTablet ? '100px 32px 32px' : '120px 48px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
        alignItems: 'end',
        gap: 48,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div>
          <div style={{
            fontFamily: mono, fontSize: 13, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            marginBottom: 32,
          }}>Portfolio · Full Stack Developer · 2024 — 2026</div>
          <h1 style={{
            fontFamily: helv, fontSize: 'clamp(72px, 11vw, 192px)',
            fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.88,
            margin: 0,
            background: 'linear-gradient(135deg, #fff 0%, #818cf8 35%, #22d3ee 65%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            CHAWANWIT<br/>SILAKHAN<span style={{ opacity: 0.5 }}>.</span>
          </h1>
          <p style={{
            fontFamily: helv, fontSize: isMobile ? 18 : 24, lineHeight: 1.4,
            color: 'rgba(255,255,255,0.78)', maxWidth: 780,
            marginTop: 36, marginBottom: 0, fontWeight: 400,
          }}>
            Full Stack Developer at <strong style={{ color: '#fff', fontWeight: 600 }}>Panasonic
            Solutions (Thailand)</strong>. I design and build end&#8209;to&#8209;end web and
            mobile systems &mdash; APIs, databases, cloud infrastructure, workflow automation,
            and AI&#8209;powered features. Based in Bangkok, Thailand.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
            <a
              href="uploads/resume-2026.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                borderRadius: 8,
                fontFamily: mono, fontSize: 12,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#000', fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 24px #818cf855',
                transition: 'opacity 150ms, transform 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CV
            </a>
            <a
              href="#sec-07"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: 8,
                fontFamily: mono, fontSize: 12,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                transition: 'border-color 150ms, transform 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >
              Get in Touch ↗
            </a>
          </div>
        </div>
        {!isMobile && (
        <div style={{
          fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          textAlign: 'right', display: 'grid', rowGap: 6,
        }}>
          <div>Scroll, or press play below</div>
          <div>Document version 2026.01</div>
          <div>Last updated this month</div>
        </div>
        )}
      </div>

      {/* Animation stage container */}
      {/* <div style={{
        position: 'relative',
        width: '100%',
        height: 'min(1000px, 86vh)',
        minHeight: 640,
        background: '#000',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}>
        <window.CosmicAnimation />
      </div> */}
    </section>
  );
}

// ── About ───────────────────────────────────────────────────────────────────

function About() {
  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-01" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '160px 48px 120px' }}>
      <SectionLabel index="01" title="About / professional summary" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.1fr 0.9fr',
        gap: isMobile ? 40 : 96, alignItems: 'start',
      }}>
        <div>
          <h2 style={{
            fontFamily: helv, fontSize: 'clamp(40px, 5vw, 80px)',
            fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.0,
            color: '#fff', margin: 0,
          }}>
            Full Stack Developer<br/>
            <span style={{
              background: 'linear-gradient(90deg,#818cf8,#22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>building reliable</span><br/>
            web and mobile<br/>
            <span style={{
              background: 'linear-gradient(90deg,#22d3ee,#34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>systems, end to end.</span>
          </h2>

          <div style={{
            marginTop: 56, display: 'grid', gap: 32,
            fontFamily: helv, fontSize: 22, lineHeight: 1.5,
            color: 'rgba(255,255,255,0.86)', maxWidth: 640,
          }}>
            <p style={{ margin: 0 }}>
              I am a Full Stack Developer with experience designing and shipping scalable web
              and application solutions. I currently work at
              <strong style={{ color: '#fff', fontWeight: 600 }}> Panasonic Solutions
              (Thailand)</strong>, where I build end-to-end applications, REST API integrations,
              database and cloud architecture, and AI-powered tools that support real business
              operations.
            </p>
            <p style={{ margin: 0 }}>
              My technology stack covers the full development lifecycle:
              <strong style={{ color: '#fff', fontWeight: 600 }}> ASP.NET MVC</strong> and
              <strong style={{ color: '#fff', fontWeight: 600 }}> Next.js</strong> for application
              development, <strong style={{ color: '#fff', fontWeight: 600 }}>FastAPI</strong> and
              Node.js for backend services, <strong style={{ color: '#fff', fontWeight: 600 }}>
              Flutter</strong> for mobile, <strong style={{ color: '#fff', fontWeight: 600 }}>
              SQL Server</strong> and <strong style={{ color: '#fff', fontWeight: 600 }}>
              PostgreSQL</strong> for data, plus <strong style={{ color: '#fff', fontWeight: 600 }}>
              Docker</strong>, <strong style={{ color: '#fff', fontWeight: 600 }}>
              Azure DevOps</strong>, <strong style={{ color: '#fff', fontWeight: 600 }}>
              AWS</strong>, and <strong style={{ color: '#fff', fontWeight: 600 }}>
              Microsoft Power Platform</strong> for deployment and automation.
            </p>
            <p style={{ margin: 0 }}>
              I have a growing focus on AI-powered application development, including
              <strong style={{ color: '#fff', fontWeight: 600 }}> Large Language Models
              (LLMs)</strong>, AI API integration, prompt engineering, and intelligent
              workflow automation.
            </p>
          </div>

          {/* Mini stat row */}
          <div style={{
            marginTop: 48, display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 0,
            borderTop: '1px solid rgba(255,255,255,0.22)',
            borderBottom: '1px solid rgba(255,255,255,0.22)',
          }}>
            {[
              ['Based', 'Bangkok, TH'],
              ['Role', 'Full Stack Dev'],
              ['Tenure', '1 yr 7 mo'],
              ['Languages', 'TH · EN'],
            ].map(([k, v], i) => (
              <div key={i} style={{
                padding: '24px 0', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.22)',
                paddingLeft: i === 0 ? 0 : 24,
              }}>
                <div style={{
                  fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10,
                }}>{k}</div>
                <div style={{
                  fontFamily: helv, fontSize: 22, color: '#fff', fontWeight: 500,
                }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait */}
        {isMobile ? (
          /* Mobile: compact card above stat row */
          <div style={{
            width: '100%',
            maxWidth: 340,
            margin: '0 auto',
            aspectRatio: '4 / 5',
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.22)',
            background: 'rgba(255,255,255,0.04)',
            order: -1,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #818cf811, #22d3ee11)',
              pointerEvents: 'none',
            }} />
            <img src="images/portrait.PNG" alt="Chawanwit Silakhan"
              style={{
                position: 'absolute',
                left: '50%', bottom: 0,
                transform: 'translateX(-50%)',
                height: '96%', width: 'auto',
                objectFit: 'contain',
              }} />
            <div style={{
              position: 'absolute', top: 12, left: 12, right: 12,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: mono, fontSize: 10,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.24em', textTransform: 'uppercase',
            }}>
              <span>Chawanwit Silakhan</span>
              <span>2026</span>
            </div>
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: mono, fontSize: 10,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.24em', textTransform: 'uppercase',
            }}>
              <span>Full Stack Dev</span>
              <span>Bangkok, TH</span>
            </div>
          </div>
        ) : (
        <div style={{
          position: isTablet ? 'relative' : 'sticky', top: 120,
          aspectRatio: '4 / 5',
          maxWidth: 520, marginLeft: 'auto', width: '100%',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.22)',
          }} />

          <img src="images/portrait.PNG" alt="Chawanwit Silakhan"
            style={{
              position: 'absolute',
              left: '50%', bottom: 0,
              transform: 'translateX(-50%)',
              height: '96%', width: 'auto',
              objectFit: 'contain',
              filter: 'grayscale(0%) contrast(1.05)',
            }} />

          {/* Caption — professional */}
          <div style={{
            position: 'absolute', top: 16, left: 16, right: 16,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: mono, fontSize: 11,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>
            <span>Chawanwit Silakhan</span>
            <span>2026</span>
          </div>
          <div style={{
            position: 'absolute', bottom: 16, left: 16, right: 16,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: mono, fontSize: 11,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>
            <span>Full Stack Developer</span>
            <span>Bangkok, Thailand</span>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

// ── Now / Currently ─────────────────────────────────────────────────────────

function Now() {
  const items = [
    {
      tag: 'BUILDING',
      title: 'Enterprise web applications',
      body: 'Designing, developing, and maintaining a portfolio of internal business systems at Panasonic Solutions — frontend, backend, integrations, and deployment.',
    },
    {
      tag: 'INTEGRATING',
      title: 'REST APIs across systems',
      body: 'Connecting applications to databases and external services. Standardising data flow between previously disconnected platforms.',
    },
    {
      tag: 'AUTOMATING',
      title: 'Workflows on cloud platforms',
      body: 'Power Apps, Power Automate, Azure DevOps, AWS Lambda and S3 — replacing manual processes with reliable automated pipelines.',
    },
    {
      tag: 'EXPERIMENTING',
      title: 'AI features with LLM APIs',
      body: 'Prompt engineering and intelligent application development — integrating Large Language Models to reduce repetitive work across business workflows.',
    },
    {
      tag: 'OPTIMISING',
      title: 'Database and system performance',
      body: 'Improving schemas, queries, and deployment practices to support scalability and long-term maintainability.',
    },
    {
      tag: 'LEARNING',
      title: 'New tools and methods',
      body: 'Continuously evaluating frameworks, libraries, and engineering practices to keep skills aligned with current industry standards.',
    },
  ];

  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-02" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '120px 48px 120px' }}>
      <SectionLabel index="02" title="Focus / current responsibilities" />

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
        gap: isMobile ? 24 : 96, alignItems: 'end', marginBottom: isMobile ? 40 : 80,
      }}>
        <h2 style={{
          fontFamily: helv, fontSize: 'clamp(40px, 5vw, 76px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1,
          color: '#fff', margin: 0,
        }}>
          What I am working on<br/>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>at the moment.</span>
        </h2>
        <p style={{
          fontFamily: helv, fontSize: 19, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 480,
          justifySelf: 'end',
        }}>
          A summary of the technical areas I am actively contributing to as a Full Stack
          Developer at Panasonic Solutions (Thailand).
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 0,
        borderTop: '1px solid rgba(255,255,255,0.22)',
        borderLeft: '1px solid rgba(255,255,255,0.22)',
      }}>
        {items.map((it, i) => {
          const color = TAG_COLOR[i % TAG_COLOR.length];
          return (
          <Reveal key={i} delay={i * 80} y={30} style={{ display: 'contents' }}>
          <article style={{
            padding: '36px 32px 40px',
            borderRight: '1px solid rgba(255,255,255,0.22)',
            borderBottom: '1px solid rgba(255,255,255,0.22)',
            display: 'flex', flexDirection: 'column', gap: 18,
            minHeight: 260,
            background: `radial-gradient(ellipse at 0% 0%, ${color}10 0%, transparent 60%)`,
            transition: 'background 300ms',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: color, boxShadow: `0 0 8px ${color}`,
              }} />
              <span style={{
                fontFamily: mono, fontSize: 12, color: color,
                letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>{it.tag}</span>
            </div>
            <h3 style={{
              fontFamily: helv, fontSize: 28, fontWeight: 600,
              letterSpacing: '-0.02em', lineHeight: 1.15,
              color: '#fff', margin: 0,
            }}>{it.title}</h3>
            <p style={{
              fontFamily: helv, fontSize: 17, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.7)', margin: 0,
            }}>{it.body}</p>
          </article>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ── How I work / Principles ─────────────────────────────────────────────────

function HowIWork() {
  const principles = [
    {
      n: '01',
      title: 'End-to-end ownership',
      body: 'I prefer to understand a feature from its database column up to the user interface. This produces software that is internally consistent and easier to maintain.',
    },
    {
      n: '02',
      title: 'Mature tools, where appropriate',
      body: 'ASP.NET, PostgreSQL, REST. Proven technologies chosen on purpose, so engineering effort can focus on solving the actual business problem.',
    },
    {
      n: '03',
      title: 'Automation where it pays off',
      body: 'Most workflows contain a manual step that can be eliminated. Power Automate, scheduled scripts, and LLM-assisted tools recover hours each week for the team.',
    },
    {
      n: '04',
      title: 'AI as a practical tool',
      body: 'Large Language Models are highly useful within a well-defined scope. Prompts are versioned, outputs are validated, and costs are monitored.',
    },
    {
      n: '05',
      title: 'Clear communication',
      body: 'Clear names, comments, commits, and documentation. If a teammate cannot follow the system, the implementation is not finished.',
    },
    {
      n: '06',
      title: 'Iterative delivery',
      body: 'A working version in production is more valuable than a perfect version in a branch. The system then improves through regular, measured iterations.',
    },
  ];

  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-04" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '120px 48px 120px' }}>
      <SectionLabel index="04" title="Principles / working approach" />

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
        gap: isMobile ? 24 : 96, alignItems: 'end', marginBottom: isMobile ? 40 : 80,
      }}>
        <h2 style={{
          fontFamily: helv, fontSize: 'clamp(40px, 5vw, 76px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1,
          color: '#fff', margin: 0,
        }}>
          Six principles<br/>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>that guide my work.</span>
        </h2>
        <p style={{
          fontFamily: helv, fontSize: 19, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 480,
          justifySelf: 'end',
        }}>
          A short list of engineering principles I have refined through professional experience
          delivering applications to internal users.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 0,
        borderTop: '1px solid rgba(255,255,255,0.22)',
      }}>
        {principles.map((p, i) => {
          const pColor = TAG_COLOR[i % TAG_COLOR.length];
          return (
          <Reveal key={i} delay={i * 70} y={30} style={{ display: 'contents' }}>
          <article style={{
            padding: '32px 0',
            paddingRight: isMobile ? 0 : i % 2 === 0 ? 48 : 0,
            paddingLeft: isMobile ? 0 : i % 2 === 1 ? 48 : 0,
            borderBottom: '1px solid rgba(255,255,255,0.22)',
            borderRight: isMobile ? 'none' : i % 2 === 0 ? '1px solid rgba(255,255,255,0.22)' : 'none',
            display: 'grid',
            gridTemplateColumns: '60px 1fr',
            gap: 20,
            alignItems: 'start',
            background: `radial-gradient(ellipse at 0% 100%, ${pColor}08 0%, transparent 60%)`,
          }}>
            <div style={{
              fontFamily: mono, fontSize: 14, color: pColor,
              letterSpacing: '0.24em', paddingTop: 4,
            }}>{p.n}</div>
            <div>
              <h3 style={{
                fontFamily: helv, fontSize: 28, fontWeight: 600,
                letterSpacing: '-0.02em', lineHeight: 1.1,
                color: '#fff', margin: '0 0 14px 0',
              }}>{p.title}</h3>
              <p style={{
                fontFamily: helv, fontSize: 18, lineHeight: 1.5,
                color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 520,
              }}>{p.body}</p>
            </div>
          </article>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Experience() {
  const jobs = [
    {
      n: 'Nov 2024 — Now',
      duration: '1 yr 7 mo',
      company: 'Panasonic Solutions (Thailand) Co., Ltd.',
      role: 'Full Stack Developer',
      summary: 'End-to-end web and enterprise systems for real business operations — frontend, backend, integrations, data, deploys, and an increasing layer of AI-assisted features.',
      bullets: [
        'Design, develop, and maintain web applications and enterprise systems for business operations.',
        'Build frontend and backend features using modern frameworks across the stack.',
        'Design and integrate REST APIs and connect applications with databases and external services.',
        'Optimise database structures and system performance for scalability and maintainability.',
        'Build and run cloud-based deployments and workflow automation.',
        'Collaborate with cross-functional teams to analyse requirements and deliver business solutions.',
        'Participate in system design, troubleshooting, testing, and deployment processes.',
      ],
      achievements: [
        'Shipped end-to-end business applications that improved day-to-day operational efficiency.',
        'Implemented API integrations and optimised data workflows across multiple disconnected systems.',
        'Raised maintainability and scalability through better architecture and deployment practices.',
        'Contributed to workflow automation and AI-powered solutions that gave teammates real hours back.',
      ],
      tags: ['ASP.NET MVC', 'Next.js', 'FastAPI', 'PostgreSQL', 'SQL Server', 'Docker', 'Azure DevOps', 'AWS Lambda', 'AWS S3', 'Power Apps', 'Power Automate', 'LLM APIs', 'Prompt Engineering'],
    },
    {
      n: 'Apr 2023 — Oct 2023',
      duration: '7 mo · co-op',
      company: 'AI Technovation Co., Ltd.',
      role: 'Mobile Application Developer (Co-op & Internship)',
      summary: 'Designed and built a production mobile app from blank Figma file to App Store-ready Flutter build — across UX, state management, auth, and team workflow.',
      bullets: [
        'Designed UX / UI for the application in Figma, then built it in Flutter.',
        'Implemented state management with the BLoC library across multi-step flows.',
        'Used Firebase for authentication and Crashlytics, with Postman / Swagger for API testing.',
        'Managed source control with Git / GitHub / SourceTree, and team tasks with Trello.',
      ],
      achievements: [],
      tags: ['Flutter', 'BLoC', 'Firebase', 'Figma', 'Postman', 'Swagger', 'Git', 'Trello'],
    },
  ];

  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-03" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '120px 48px 120px' }}>
      <SectionLabel index="03" title="Experience / professional history" />

      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: isMobile ? 40 : 80, gap: 24, flexWrap: 'wrap',
      }}>
        <h2 style={{
          fontFamily: helv, fontSize: 'clamp(40px, 5vw, 76px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1,
          color: '#fff', margin: 0, maxWidth: 900,
        }}>
          Two roles to date.<br/>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>One currently ongoing.</span>
        </h2>
        <div style={{
          fontFamily: mono, fontSize: 13, color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          textAlign: 'right', lineHeight: 1.8,
        }}>
          2 positions<br/>
          Approx. 26 months total<br/>
          1 currently active
        </div>
      </div>

      <div style={{ display: 'grid', gap: 0 }}>
        {jobs.map((j, idx) => (
          <Reveal key={idx} delay={idx * 120}>
          <article style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '240px 1fr',
            gap: isMobile ? 24 : 64,
            padding: isMobile ? '40px 0' : '64px 0',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            borderBottom: idx === jobs.length - 1 ? '1px solid rgba(255,255,255,0.22)' : 'none',
          }}>
            <div>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: idx === 0
                  ? 'linear-gradient(135deg,#34d399,#22d3ee)'
                  : 'transparent',
                border: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.55)',
                marginBottom: 28,
                boxShadow: idx === 0 ? '0 0 16px #34d39966' : 'none',
              }} />
              <div style={{
                fontFamily: mono, fontSize: 13, color: '#fff',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>{j.n}</div>
              <div style={{
                fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginTop: 8,
              }}>{j.duration}</div>
              {idx === 0 && (
                <div style={{
                  marginTop: 14,
                  display: 'inline-block',
                  fontFamily: mono, fontSize: 11, color: '#000',
                  background: 'linear-gradient(90deg,#34d399,#22d3ee)',
                  padding: '4px 10px',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  borderRadius: 4,
                  boxShadow: '0 0 12px #34d39966',
                }}>● Current</div>
              )}
            </div>

            <div>
              <div style={{
                fontFamily: mono, fontSize: 13, color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 14,
              }}>{j.company}</div>
              <h3 style={{
                fontFamily: helv, fontSize: 'clamp(34px, 3.6vw, 56px)',
                fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05,
                color: '#fff', margin: 0,
              }}>{j.role}</h3>
              <p style={{
                fontFamily: helv, fontSize: 20, lineHeight: 1.5,
                color: 'rgba(255,255,255,0.8)', margin: '24px 0 0 0', maxWidth: 820,
              }}>{j.summary}</p>

              {/* Responsibilities */}
              <div style={{
                marginTop: 44,
                fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18,
              }}>Responsibilities</div>
              <ul style={{
                padding: 0, listStyle: 'none',
                display: 'grid', gap: 14,
                fontFamily: helv, fontSize: 18, lineHeight: 1.5,
                color: 'rgba(255,255,255,0.82)', maxWidth: 880, margin: 0,
              }}>
                {j.bullets.map((b, i) => (
                  <li key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: 0,
                  }}>
                    <span style={{
                      fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.45)',
                      paddingTop: 6, letterSpacing: '0.18em',
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Key Achievements */}
              {j.achievements && j.achievements.length > 0 && (
                <>
                  <div style={{
                    marginTop: 44,
                    fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18,
                  }}>Key Achievements</div>
                  <div style={{
                    display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: 0,
                    border: '1px solid rgba(255,255,255,0.22)',
                    maxWidth: 1000,
                  }}>
                    {j.achievements.map((a, i) => (
                      <div key={i} style={{
                        padding: '24px 28px',
                        borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.22)' : 'none',
                        borderBottom: i < j.achievements.length - 2 ? '1px solid rgba(255,255,255,0.22)' : 'none',
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: '#fff', marginTop: 9, flex: '0 0 auto',
                        }} />
                        <div style={{
                          fontFamily: helv, fontSize: 17, lineHeight: 1.45,
                          color: '#fff',
                        }}>{a}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tags */}
              <div style={{
                marginTop: 44,
                fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16,
              }}>Tools in use</div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8,
              }}>
                {j.tags.map((t) => {
                  const c = tagColor(t);
                  return (
                  <span key={t} style={{
                    fontFamily: mono, fontSize: 12,
                    padding: '8px 14px',
                    border: `1px solid ${c}66`,
                    borderRadius: 999,
                    color: c,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    background: `${c}14`,
                  }}>{t}</span>
                  );
                })}
              </div>
            </div>
          </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Stack (skills as celestial bodies) ──────────────────────────────────────

// Simple Icons CDN slug + brand bg color for each skill
// local: use images/ path; slug: use Simple Icons CDN
const SKILL_ICON = {
  'ASP.NET MVC':        { slug: 'dotnet',               bg: '#512BD4' },
  'Next.js':            { slug: 'nextdotjs',             bg: '#000000', border: 'rgba(255,255,255,0.25)' },
  'FastAPI':            { slug: 'fastapi',               bg: '#009688' },
  'Flutter':            { slug: 'flutter',               bg: '#02569B' },
  'Node.js':            { slug: 'nodedotjs',             bg: '#215732' },
  'SQL Server':         { local: 'images/sql_server_icon.png',   bg: '#e45755' },
  'PostgreSQL':         { slug: 'postgresql',            bg: '#336791' },
  'Firebase':           { slug: 'firebase',              bg: '#F57C00' },
  'Docker':             { slug: 'docker',                bg: '#1D63ED' },
  'Azure DevOps':       { local: 'images/azure_devops.png',      bg: '#0078D4' },
  'AWS Lambda':         { local: 'images/aws_lambda_icon.png',   bg: '#FF9900' },
  'AWS S3':             { local: 'images/aws_s3_icon.png',       bg: '#232F3E' },
  'AWS DevOps':         { local: 'images/aws_icon.png',          bg: '#232F3E' },
  'Power Automate':     { local: 'images/power_automate_icon.png', bg: '#0066FF' },
  'Power Apps':         { local: 'images/power_app_icon.png',    bg: '#924492' },
  'RPA':                { slug: 'uipath',                bg: '#F97316' },
  'LLM / AI APIs':      { local: 'images/llm_ai_icon.png',       bg: '#10A37F' },
  'Prompt Engineering': { slug: 'anthropic',             bg: '#191919', border: 'rgba(255,255,255,0.2)' },
};

function SkillIcon({ name, size }) {
  const meta = SKILL_ICON[name] || {};
  const bg   = meta.bg || '#333';
  const border = meta.border ? `1px solid ${meta.border}` : 'none';
  const iconColor = meta.iconColor || 'white';
  const iconSize = Math.round(size * 0.56);

  // local image takes priority, then Simple Icons CDN
  const imgSrc = meta.local
    ? meta.local
    : meta.slug
      ? `https://cdn.simpleicons.org/${meta.slug}/${iconColor}`
      : null;

  return (
    <div style={{
      width: size, height: size,
      borderRadius: '28%',
      background: bg,
      border,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 24px ${bg}66, 0 0 0 1px ${bg}33`,
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* subtle inner glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.18), transparent 60%)',
        pointerEvents: 'none',
      }} />
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          width={iconSize}
          height={iconSize}
          style={{ position: 'relative', zIndex: 1, display: 'block', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span style={{ fontSize: Math.round(size * 0.42), lineHeight: 1 }}>⚙</span>
      )}
    </div>
  );
}

function Stack() {
  const skills = [
    { name: 'ASP.NET MVC',         mass: 9.5, group: 'Application' },
    { name: 'Next.js',             mass: 9.0, group: 'Application' },
    { name: 'FastAPI',             mass: 8.8, group: 'Services' },
    { name: 'Flutter',             mass: 8.2, group: 'Mobile' },
    { name: 'Node.js',             mass: 7.6, group: 'Services' },
    { name: 'SQL Server',          mass: 9.2, group: 'Data' },
    { name: 'PostgreSQL',          mass: 8.8, group: 'Data' },
    { name: 'Firebase',            mass: 7.0, group: 'Data' },
    { name: 'Docker',              mass: 8.0, group: 'Ops' },
    { name: 'Azure DevOps',        mass: 8.4, group: 'Ops' },
    { name: 'AWS Lambda',          mass: 7.4, group: 'Ops' },
    { name: 'AWS S3',              mass: 7.2, group: 'Ops' },
    { name: 'AWS DevOps',          mass: 7.0, group: 'Ops' },
    { name: 'Power Automate',      mass: 8.4, group: 'Automation' },
    { name: 'Power Apps',          mass: 8.0, group: 'Automation' },
    { name: 'RPA',                 mass: 7.6, group: 'Automation' },
    { name: 'LLM / AI APIs',       mass: 8.8, group: 'AI' },
    { name: 'Prompt Engineering',  mass: 8.4, group: 'AI' },
  ];

  const groups = ['Application', 'Services', 'Mobile', 'Data', 'Ops', 'Automation', 'AI'];

  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-05" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '120px 48px 120px' }}>
      <SectionLabel index="05" title="Skills / technologies and tools" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 16 : 96, alignItems: 'end', marginBottom: isMobile ? 40 : 96,
      }}>
        <h2 style={{
          fontFamily: helv, fontSize: 'clamp(40px, 5vw, 76px)',
          fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1,
          color: '#fff', margin: 0,
        }}>
          Each technology<br/>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>by daily usage.</span>
        </h2>
        <p style={{
          fontFamily: helv, fontSize: 18, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 540,
          justifySelf: 'end',
        }}>
          The size of each icon reflects my experience and usage level with each technology.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 48 }}>
        {groups.map((g, gi) => {
          const items = skills.filter(s => s.group === g);
          const gColor = GROUP_COLOR[g] || '#fff';
          return (
            <Reveal key={g} delay={gi * 60}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
              gap: isMobile ? 16 : 48,
              alignItems: isMobile ? 'start' : 'center',
              borderTop: `1px solid ${gColor}44`,
              paddingTop: 32,
            }}>
              <div>
                <div style={{
                  fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 8,
                }}>System</div>
                <div style={{
                  fontFamily: helv, fontSize: 28, color: gColor,
                  fontWeight: 600, letterSpacing: '-0.02em',
                }}>{g}</div>
              </div>
              <div style={{
                display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 16 : 40,
                flexWrap: 'wrap',
              }}>
                {items.map((s, si) => {
                  const d = 44 + (s.mass - 6) * 14;
                  const pct = Math.round(s.mass * 10);
                  return (
                    <Reveal key={s.name} delay={gi * 60 + si * 50} y={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <SkillIcon name={s.name} size={Math.round(d)} />
                      <div style={{
                        fontFamily: mono, fontSize: 11, color: '#fff',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap', textAlign: 'center',
                        maxWidth: 96,
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}>{s.name}</div>
                      <div style={{
                        fontFamily: mono, fontSize: 11, color: gColor,
                        letterSpacing: '0.16em',
                        marginTop: -4,
                      }}>{pct}%</div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ── Lab / Education + Certifications ────────────────────────────────────────

function Lab() {
  const certs = [
    {
      title: 'Runner-up Award (Nº 1) — Cooperative Project Competition',
      body: 'Won First Runner-up in the System Development for Telemedicine Application by Developing the System with the Flutter Framework category in the Cooperative Education Project Poster Competition for the academic year 2023.',
      org: 'Faculty of Engineering and Industrial Technology, Silpakorn University',
      year: '2024',
      url: 'https://drive.google.com/file/d/1WJad1-vqnhoDGl97h090O-fFsc1LqyCh/view?usp=drivesdk',
      tags: ['Flutter', 'Postman', 'Swagger', 'SourceTree', 'Firebase', 'GitHub', 'Figma'],
    },
    {
      title: 'Developing an Android Mobile Application with Flutter for Beginners (18 hrs.)',
      body: 'Creative electrical engineering project to enhance intelligence to develop Android Mobile Application with Flutter for beginners.',
      org: 'Department of Electrical Engineering, Silpakorn University',
      year: '2023',
      url: 'https://drive.google.com/file/d/1GU6-AZ_8LuhqNB4fvzV30PL5GQF6OzSq/view?usp=drivesdk',
      tags: ['Flutter', 'Android Studio'],
    },
    {
      title: 'IoT System Development using ESP32, MQTT and Node-RED (12 hrs.)',
      body: 'Creative electrical engineering project to enhance the wisdom of IoT system development using ESP32, MQTT and Node-RED.',
      org: 'Department of Electrical Engineering, Silpakorn University',
      year: '2023',
      url: 'https://drive.google.com/file/d/1GU6-AZ_8LuhqNB4fvzV30PL5GQF6OzSq/view?usp=drivesdk',
      tags: ['IoT', 'ESP32', 'MQTT', 'Node-RED'],
    },
    {
      title: 'Python Programming (12 hrs.)',
      body: 'Workshop project — Introduction to Python Programming.',
      org: 'Department of Electrical Engineering, Silpakorn University',
      year: '2022',
      url: 'https://drive.google.com/file/d/1GU6-AZ_8LuhqNB4fvzV30PL5GQF6OzSq/view?usp=drivesdk',
      tags: ['Python'],
    },
  ];

  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-06" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '120px 48px 120px' }}>
      <SectionLabel index="06" title="Education / academic background" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? 48 : 96, alignItems: 'start',
      }}>
        {/* Education */}
        <div style={{ display: 'grid', gap: 32 }}>
          <div style={{
            fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 8,
          }}>Education</div>

          {/* University */}
          <Reveal>
          <div style={{ border: '1px solid rgba(255,255,255,0.22)', padding: 36 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 20, fontFamily: mono, fontSize: 11,
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.28em', textTransform: 'uppercase',
            }}>
              <span>Silpakorn University</span>
              <span>2020 — 2024</span>
            </div>
            <h3 style={{
              fontFamily: helv, fontSize: 28, fontWeight: 700,
              letterSpacing: '-0.025em', lineHeight: 1.05, color: '#fff', margin: 0,
            }}>
              Bachelor of Engineering<br/>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>Electronics and Computer Systems Engineering</span>
            </h3>
            <p style={{
              fontFamily: helv, fontSize: 16, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)', margin: '20px 0 0 0',
            }}>
              Learned the fundamentals of programming and gained experience with C, C++, Assembly, Python, HTML, CSS, and JavaScript.
              Developed a full-stack classroom reservation system using the Django framework.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {['C','C++','Assembly','HTML','CSS','JavaScript','Python','Django','Flutter','MATLAB'].map(t => (
                <span key={t} style={{
                  fontFamily: mono, fontSize: 11, padding: '5px 12px',
                  border: `1px solid ${tagColor(t)}66`, borderRadius: 999,
                  color: tagColor(t), background: `${tagColor(t)}14`,
                  letterSpacing: '0.1em',
                }}>{t}</span>
              ))}
            </div>
            <div style={{
              marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
              borderTop: '1px solid rgba(255,255,255,0.18)',
            }}>
              {[['GPA','3.08 / 4.00'],['Award','Runner-up Nº 1, Co-op Project']].map(([k,v],i) => (
                <div key={k} style={{
                  padding: '16px 0',
                  borderLeft: i===0 ? 'none' : '1px solid rgba(255,255,255,0.18)',
                  paddingLeft: i===0 ? 0 : 20,
                }}>
                  <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 6 }}>{k}</div>
                  <div style={{ fontFamily: helv, fontSize: 16, color: '#fff', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          {/* High School */}
          <Reveal delay={100}>
          <div style={{ border: '1px solid rgba(255,255,255,0.22)', padding: 36 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 20, fontFamily: mono, fontSize: 11,
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.28em', textTransform: 'uppercase',
            }}>
              <span>Sakolraj Wittayanukul School</span>
              <span>2017 — 2020</span>
            </div>
            <h3 style={{
              fontFamily: helv, fontSize: 28, fontWeight: 700,
              letterSpacing: '-0.025em', lineHeight: 1.05, color: '#fff', margin: 0,
            }}>
              Science — Mathematics<br/>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>High School</span>
            </h3>
            <p style={{
              fontFamily: helv, fontSize: 16, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)', margin: '20px 0 0 0',
            }}>
              Started learning programming for the first time in the classroom, including C, C++ and Python.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {['Python','C','C++'].map(t => (
                <span key={t} style={{
                  fontFamily: mono, fontSize: 11, padding: '5px 12px',
                  border: `1px solid ${tagColor(t)}66`, borderRadius: 999,
                  color: tagColor(t), background: `${tagColor(t)}14`,
                  letterSpacing: '0.1em',
                }}>{t}</span>
              ))}
            </div>
            <div style={{
              marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: 16,
            }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 6 }}>GPA</div>
              <div style={{ fontFamily: helv, fontSize: 16, color: '#fff', fontWeight: 500 }}>3.20 / 4.00</div>
            </div>
          </div>
          </Reveal>
        </div>

        {/* Certifications */}
        <div>
          <div style={{
            fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 24,
          }}>Licences & Certifications</div>

          <div style={{ display: 'grid', gap: 0, border: '1px solid rgba(255,255,255,0.22)' }}>
            {certs.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noreferrer"
                style={{
                  display: 'block',
                  padding: '28px 32px',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.18)',
                  color: '#fff', textDecoration: 'none',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
                  <div style={{
                    fontFamily: helv, fontSize: 17, lineHeight: 1.35,
                    color: '#fff', fontWeight: 600, letterSpacing: '-0.005em',
                  }}>{c.title}</div>
                  <div style={{
                    flexShrink: 0,
                    fontFamily: mono, fontSize: 12, color: '#fff',
                    letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{c.year} ↗</div>
                </div>
                <div style={{
                  fontFamily: helv, fontSize: 14, lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.65)', marginBottom: 14,
                }}>{c.body}</div>
                <div style={{
                  fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12,
                }}>{c.org}</div>
                {c.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {c.tags.map(t => {
                      const c2 = tagColor(t);
                      return (
                        <span key={t} style={{
                          fontFamily: mono, fontSize: 10, padding: '3px 10px',
                          border: `1px solid ${c2}55`, borderRadius: 999,
                          color: c2, background: `${c2}12`,
                          letterSpacing: '0.1em',
                        }}>{t}</span>
                      );
                    })}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact / closer ───────────────────────────────────────────────────────

function Contact() {
  const w = useW();
  const isMobile = w < 640;
  const isTablet = w < 1024;
  return (
    <section id="sec-07" style={{ padding: isMobile ? '80px 20px 60px' : isTablet ? '100px 32px 80px' : '160px 48px 120px' }}>
      <SectionLabel index="07" title="Contact / get in touch" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.4fr 1fr',
        gap: isMobile ? 40 : 96, alignItems: 'end',
      }}>
        <div>
          <h2 style={{
            fontFamily: helv, fontSize: 'clamp(56px, 8vw, 144px)',
            fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.92,
            margin: 0,
            background: 'linear-gradient(135deg, #fff 0%, #818cf8 40%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Let's work<br/>
            <span style={{ opacity: 0.6 }}>together.</span>
          </h2>
          <p style={{
            fontFamily: helv, fontSize: isMobile ? 18 : 22, lineHeight: 1.45,
            color: 'rgba(255,255,255,0.7)', marginTop: 40, maxWidth: 720,
          }}>
            Open to full-stack development opportunities, AI integration projects, and
            consulting work. Available for both remote and Bangkok-based engagements.
          </p>
        </div>

        <div style={{
          display: 'grid', gap: 0,
          border: '1px solid rgba(255,255,255,0.22)',
        }}>
          {[
            ['Email', 'chawanwits@outlook.com', 'mailto:chawanwits@outlook.com'],
            ['Phone', '+66 97 129 1752', 'tel:+66971291752'],
            // ['LinkedIn', '/in/chawanwit-silakhan', '#'],
            ['GitHub', '@chxmek', 'https://github.com/chxmek'],
            ['Location', 'Bangkok, Thailand', null],
          ].map(([k, v, href], i) => {
            const Tag = href ? 'a' : 'div';
            return (
              <Tag key={k} href={href} style={{
                display: 'grid', gridTemplateColumns: isMobile ? '80px 1fr' : '120px 1fr',
                padding: isMobile ? '18px 20px' : '24px 32px', gap: 16,
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.18)',
                color: '#fff', textDecoration: 'none',
                transition: 'background 120ms',
              }}
              onMouseEnter={href ? e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)' : undefined}
              onMouseLeave={href ? e => e.currentTarget.style.background = 'transparent' : undefined}>
                <span style={{
                  fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  alignSelf: 'center',
                }}>{k}</span>
                <span style={{
                  fontFamily: helv, fontSize: 18, color: '#fff', fontWeight: 500,
                }}>{v}{href ? ' ↗' : ''}</span>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const w = useW();
  const isMobile = w < 640;
  return (
    <footer style={{
      padding: isMobile ? '24px 20px' : '32px 48px',
      borderTop: '1px solid rgba(255,255,255,0.18)',
      display: 'flex', justifyContent: isMobile ? 'center' : 'space-between',
      fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
      letterSpacing: '0.28em', textTransform: 'uppercase',
      flexWrap: 'wrap', gap: isMobile ? 12 : 24,
      textAlign: isMobile ? 'center' : 'left',
    }}>
      <span>© 2026 · Chawanwit Silakhan</span>
      <span>Full Stack Developer Portfolio</span>
      <span>Bangkok, Thailand</span>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

function App() {
  return (
    <div id="top" style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <TopNav />
      <Hero />
      <About />
      <Now />
      <Experience />
      <HowIWork />
      <Stack />
      <Lab />
      <Contact />
      <Footer />
    </div>
  );
}

window.PortfolioApp = App;
