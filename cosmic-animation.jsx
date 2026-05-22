// cosmic-animation.jsx
// Sprite-based cosmic-scale animation.
// Monochrome, Helvetica. Circles as celestial bodies + text-based stats.
//
// Scenes (global timeline seconds):
//   0 – 4     Title
//   4 – 9     You are here
//   9 – 15    Earth
//  15 – 22    Earth ↔ Moon
//  22 – 28    "30 Earths in between"
//  28 – 36    The Sun
//  36 – 42    Light travel
//  42 – 48    Jupiter
//  48 – 54    Voyager 1
//  54 – 62    Proxima Centauri
//  62 – 69    Milky Way
//  69 – 78    Observable universe
//  78 – 82    Return to a single dot

const STAGE_W = 1600;
const STAGE_H = 900;
const CENTER_X = STAGE_W / 2;
const CENTER_Y = STAGE_H / 2;

const helv = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, SFMono-Regular, "Courier New", monospace';

// ── Reusable atoms ──────────────────────────────────────────────────────────

// A solid white circle that scales in from 0 and (optionally) scales out.
// `start` is an offset (in seconds) within the parent Sprite — useful for
// staggering the appearance of multiple bodies within one scene.
function CircleBody({
  x, y, diameter,
  color = '#fff',
  ring = false,
  ringWidth = 1,
  start = 0,
  entryDur = 0.6,
  exitDur = 0.4,
  entryEase = window.Easing.easeOutCubic,
}) {
  const { localTime, duration } = window.useSprite();
  const t = localTime - start;
  const sceneRemaining = Math.max(0, duration - start);
  const exitStart = Math.max(0, sceneRemaining - exitDur);

  if (t < -0.001) return null;

  let scale = 1, opacity = 1;
  if (t < entryDur) {
    const k = entryEase(window.clamp(t / entryDur, 0, 1));
    scale = k;
    opacity = k;
  } else if (t > exitStart) {
    const k = window.Easing.easeInCubic(window.clamp((t - exitStart) / exitDur, 0, 1));
    opacity = 1 - k;
  }

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: diameter, height: diameter,
      marginLeft: -diameter / 2,
      marginTop: -diameter / 2,
      borderRadius: '50%',
      background: ring ? 'transparent' : color,
      border: ring ? `${ringWidth}px solid ${color}` : 'none',
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
    }} />
  );
}

// A horizontal tick-line with a numeric label centered above it.
function Measure({ x1, x2, y, label, sublabel, color = '#fff', entryDelay = 0 }) {
  const { localTime } = window.useSprite();
  const t = window.clamp((localTime - entryDelay) / 0.6, 0, 1);
  const eased = window.Easing.easeOutCubic(t);
  const mid = (x1 + x2) / 2;
  const width = (x2 - x1) * eased;
  const lineLeft = mid - width / 2;

  return (
    <>
      <div style={{
        position: 'absolute',
        left: lineLeft, top: y - 0.5,
        width, height: 1,
        background: color,
        opacity: eased,
      }} />
      {/* End caps */}
      <div style={{
        position: 'absolute',
        left: x1 + (1 - eased) * (mid - x1), top: y - 6,
        width: 1, height: 12, background: color, opacity: eased,
      }} />
      <div style={{
        position: 'absolute',
        left: x2 - (1 - eased) * (x2 - mid), top: y - 6,
        width: 1, height: 12, background: color, opacity: eased,
      }} />
      {label && (
        <div style={{
          position: 'absolute',
          left: mid, top: y - 34,
          transform: 'translateX(-50%)',
          fontFamily: mono,
          fontSize: 14,
          color,
          opacity: eased,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
      {sublabel && (
        <div style={{
          position: 'absolute',
          left: mid, top: y + 12,
          transform: 'translateX(-50%)',
          fontFamily: mono,
          fontSize: 11,
          color,
          opacity: eased * 0.55,
          letterSpacing: '0.18em',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}>{sublabel}</div>
      )}
    </>
  );
}

// Big scene title (kicker + headline + sub)
function SceneHeader({ kicker, title, sub, x = 80, y = 80, color = '#fff', maxWidth = 820 }) {
  const { localTime, duration } = window.useSprite();
  const fade = (t, start, end) => {
    const inT = window.clamp((t - start) / 0.5, 0, 1);
    const outT = window.clamp((t - end) / 0.4, 0, 1);
    return window.Easing.easeOutCubic(inT) * (1 - window.Easing.easeInCubic(outT));
  };
  const exitStart = duration - 0.5;
  const op = fade(localTime, 0, exitStart);
  const ty = (1 - window.Easing.easeOutCubic(window.clamp(localTime / 0.5, 0, 1))) * 14;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      color, fontFamily: helv,
      opacity: op,
      transform: `translateY(${ty}px)`,
      willChange: 'transform, opacity',
    }}>
      {kicker && (
        <div style={{
          fontFamily: mono, fontSize: 15, letterSpacing: '0.32em',
          textTransform: 'uppercase', opacity: 0.6, marginBottom: 22,
        }}>{kicker}</div>
      )}
      {title && (
        <div style={{
          fontSize: 108, fontWeight: 700, letterSpacing: '-0.04em',
          lineHeight: 0.94, marginBottom: 22, textTransform: 'uppercase',
        }}>{title}</div>
      )}
      {sub && (
        <div style={{
          fontSize: 30, fontWeight: 400, letterSpacing: '-0.01em',
          color, opacity: 0.85, maxWidth, lineHeight: 1.32,
        }}>{sub}</div>
      )}
    </div>
  );
}

// Big punchline / analogy block. One large quote-style callout per scene.
// Appears below the SceneHeader and helps anchor a hard-to-grasp number to
// something everyday.
function Analogy({ x = 80, y, text, hint, delay = 0.3, color = '#fff', maxWidth = 720 }) {
  const { localTime, duration } = window.useSprite();
  const inT = window.Easing.easeOutCubic(window.clamp((localTime - delay) / 0.7, 0, 1));
  const out = window.Easing.easeInCubic(window.clamp((localTime - (duration - 0.5)) / 0.5, 0, 1));
  const op = inT * (1 - out);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      color, fontFamily: helv, opacity: op, maxWidth,
      transform: `translateY(${(1 - inT) * 10}px)`,
      willChange: 'transform, opacity',
    }}>
      {hint && (
        <div style={{
          fontFamily: mono, fontSize: 12, color, opacity: 0.55,
          letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 14,
        }}>{hint}</div>
      )}
      <div style={{
        fontFamily: helv, fontSize: 26, lineHeight: 1.35,
        color, fontWeight: 400, letterSpacing: '-0.01em',
        borderLeft: '2px solid #fff', paddingLeft: 22,
      }}>{text}</div>
    </div>
  );
}

// Bottom-right stats block (mono fact list)
function StatBlock({ items, x, y, align = 'right' }) {
  const { localTime, duration } = window.useSprite();
  const exitStart = duration - 0.45;
  const inT = window.Easing.easeOutCubic(window.clamp((localTime - 0.3) / 0.6, 0, 1));
  const outT = window.Easing.easeInCubic(window.clamp((localTime - exitStart) / 0.45, 0, 1));
  const op = inT * (1 - outT);

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: align === 'right' ? 'translateX(-100%)' : 'none',
      fontFamily: mono,
      color: '#fff',
      opacity: op,
      textAlign: align,
      willChange: 'opacity',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex',
          flexDirection: align === 'right' ? 'row-reverse' : 'row',
          gap: 32,
          fontSize: 16,
          letterSpacing: '0.04em',
          padding: '12px 0',
          borderTop: i === 0 ? '1px solid rgba(255,255,255,0.3)' : 'none',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          minWidth: 420,
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            flex: '0 0 auto',
            fontSize: 13,
            letterSpacing: '0.18em',
            alignSelf: 'center',
          }}>{it[0]}</span>
          <span style={{
            flex: 1,
            textAlign: align,
            color: '#fff',
            fontWeight: 500,
          }}>{it[1]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Scenes ──────────────────────────────────────────────────────────────────

// 0–4: Title
function SceneTitle() {
  const { localTime, duration } = window.useSprite();
  const titleIn = window.Easing.easeOutCubic(window.clamp(localTime / 0.8, 0, 1));
  const out = window.Easing.easeInCubic(window.clamp((localTime - (duration - 0.5)) / 0.5, 0, 1));
  const op = titleIn * (1 - out);

  // Pulsing dot
  const pulse = 0.5 + 0.5 * Math.sin(localTime * 2.2);
  const dotOp = op * (0.4 + 0.5 * pulse);

  return (
    <>
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y - 80,
        transform: `translate(-50%, -50%) translateY(${(1 - titleIn) * 20}px)`,
        fontFamily: helv,
        fontSize: 168,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.045em',
        lineHeight: 0.9,
        opacity: op,
        whiteSpace: 'nowrap',
      }}>
        A COSMIC SCALE
      </div>
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y + 60,
        transform: 'translate(-50%, 0)',
        fontFamily: helv,
        fontSize: 24,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '-0.005em',
        opacity: op,
        whiteSpace: 'nowrap',
      }}>
        Thirteen fun facts about the size and distance of things.
      </div>
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y + 130,
        transform: 'translate(-50%, 0)',
        fontFamily: mono,
        fontSize: 12,
        letterSpacing: '0.4em',
        color: 'rgba(255,255,255,0.4)',
        opacity: op,
        textTransform: 'uppercase',
      }}>
        ⟶ Press play
      </div>

      {/* Corner meta */}
      <div style={{
        position: 'absolute', top: 60, left: 80,
        fontFamily: mono, fontSize: 12, color: '#fff', opacity: op * 0.55,
        letterSpacing: '0.32em', textTransform: 'uppercase',
      }}>00 · Intro</div>

      <div style={{
        position: 'absolute', top: 60, right: 80,
        fontFamily: mono, fontSize: 12, color: '#fff', opacity: op * 0.55,
        letterSpacing: '0.32em', textTransform: 'uppercase',
      }}>Runtime 01:22</div>

      {/* Pulsing dot, bottom-right */}
      <div style={{
        position: 'absolute',
        left: STAGE_W - 200, top: STAGE_H - 120,
        width: 12, height: 12, borderRadius: '50%',
        background: '#fff', opacity: dotOp,
      }} />
      <div style={{
        position: 'absolute',
        left: STAGE_W - 200 - 16, top: STAGE_H - 120 - 16,
        width: 44, height: 44, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.4)',
        opacity: op * (0.6 - 0.6 * pulse + 0.6),
        transform: `scale(${1 + pulse * 0.4})`,
      }} />
    </>
  );
}

// 4–9: You are here
function SceneYouAreHere() {
  const { localTime, duration } = window.useSprite();
  const inT = window.Easing.easeOutCubic(window.clamp(localTime / 0.6, 0, 1));
  const out = window.Easing.easeInCubic(window.clamp((localTime - (duration - 0.5)) / 0.5, 0, 1));
  const op = inT * (1 - out);

  const pulse = 0.5 + 0.5 * Math.sin(localTime * 3);

  return (
    <>
      <SceneHeader
        kicker="01 · Scale 1 : 1"
        title="YOU ARE HERE"
        sub={"On a wet, mostly blue rock orbiting an ordinary star, in an unfashionable arm of an average galaxy."}
      />

      {/* Tiny dot center-right */}
      <div style={{
        position: 'absolute',
        left: CENTER_X + 200, top: CENTER_Y + 40,
        width: 8, height: 8, marginLeft: -4, marginTop: -4,
        background: '#fff', borderRadius: '50%',
        opacity: op,
      }} />
      <div style={{
        position: 'absolute',
        left: CENTER_X + 200, top: CENTER_Y + 40,
        width: 8 + 80 * pulse, height: 8 + 80 * pulse,
        marginLeft: -(8 + 80 * pulse) / 2, marginTop: -(8 + 80 * pulse) / 2,
        border: '1px solid rgba(255,255,255,0.6)', borderRadius: '50%',
        opacity: op * (1 - pulse),
      }} />

      {/* Connector text */}
      <div style={{
        position: 'absolute',
        left: CENTER_X + 230, top: CENTER_Y + 30,
        fontFamily: mono, fontSize: 12, color: '#fff',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        opacity: op * 0.8,
        whiteSpace: 'nowrap',
      }}>
        ← that's you
      </div>

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 220}
        items={[
          ['Population', '1 / 8,200,000,000'],
          ['Coordinates', '13.7563°N · 100.5018°E'],
          ['Local time', 'Approximately now'],
        ]}
      />
    </>
  );
}

// 9–15: Earth
function SceneEarth() {
  const { localTime } = window.useSprite();
  const angle = (localTime * 60) % 360;

  const r = 170;
  const cx = 1280;
  const cy = 460;
  return (
    <>
      <SceneHeader
        kicker="02 · OUR PLANET"
        title="EARTH"
        sub={"A pale blue dot. 4.54 billion years old. Currently host to about eight billion people, one of whom is me."}
      />

      <CircleBody x={cx} y={cy} diameter={r * 2} />

      <div style={{
        position: 'absolute', left: cx, top: cy,
        width: 0, height: 0,
        transform: `rotate(${angle}deg)`,
      }}>
        <div style={{ position: 'absolute', left: r + 18 - 4, top: -1, width: 8, height: 2, background: '#fff' }} />
      </div>
      <div style={{
        position: 'absolute',
        left: cx - (r + 30), top: cy - (r + 30),
        width: (r + 30) * 2, height: (r + 30) * 2,
        borderRadius: '50%',
        border: '1px dashed rgba(255,255,255,0.18)',
      }} />

      <Analogy
        x={80} y={460}
        hint="FOR SCALE"
        text={"If the Sun were the size of a beach ball, Earth would be a marble — and you would have to walk 22 metres away to find it."}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 240}
        items={[
          ['Diameter', '12,742 km'],
          ['Mass', '5.972 × 10²⁴ kg'],
          ['One day', '23h 56m 04s'],
          ['One year', '365.25 days'],
        ]}
      />
    </>
  );
}

// 15–22: Earth ↔ Moon
function SceneMoon() {
  const earthX = CENTER_X - 520;
  const moonX = CENTER_X + 520;
  const yMid = CENTER_Y + 180;
  const earthR = 64;
  const moonR = 64 * 0.273; // ~17.5px radius
  return (
    <>
      <SceneHeader
        kicker="03 · OUR ONLY NEIGHBOUR"
        title="THE MOON"
        sub={"About a quarter of Earth's width. The only place humans have ever walked, outside of this planet."}
      />

      <CircleBody x={earthX} y={yMid} diameter={earthR * 2} start={0.2} entryDur={0.5} />
      <CircleBody x={moonX} y={yMid} diameter={moonR * 2} start={0.8} entryDur={0.5} />

      <div style={{
        position: 'absolute', left: earthX, top: yMid + earthR + 28,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff', letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}>EARTH · Ø 12,742 km</div>
      <div style={{
        position: 'absolute', left: moonX, top: yMid + earthR + 28,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff', letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}>MOON · Ø 3,474 km</div>

      <Measure
        x1={earthX + earthR + 8}
        x2={moonX - moonR - 8}
        y={yMid - earthR - 60}
        label="384,400 km"
        sublabel="1.3 light-seconds"
        entryDelay={1.4}
      />

      <Analogy
        x={80} y={470}
        hint="PICTURE THIS"
        text={"If Earth were a basketball, the Moon would be a tennis ball — sitting 7.4 metres away across the room."}
        maxWidth={620}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={470}
        items={[
          ['Moon : Earth', '27.3 % the size'],
          ['Apollo flight', '76 hours one way'],
          ['Drifting away', '+3.8 cm / year'],
        ]}
      />
    </>
  );
}

// 22–28: 30 Earths in between
function SceneThirty() {
  const { localTime } = window.useSprite();
  const earthX = 220;
  const moonX = STAGE_W - 220;
  const yMid = CENTER_Y + 80;
  const earthR = 28;
  const moonR = earthR * 0.273;

  const N = 30;
  const gapStart = earthX + earthR + 20;
  const gapEnd = moonX - moonR - 20;
  const step = (gapEnd - gapStart) / (N - 1);

  // Live counter
  const visibleCount = Math.min(
    N,
    Math.max(0, Math.floor((localTime - 0.8) / 0.07) + 1)
  );

  return (
    <>
      <SceneHeader
        kicker="04 · MIND THE GAP"
        title={"30 EARTHS FIT"}
        sub={"Line up our planet side by side, and exactly thirty of them just barely span the gap to the Moon."}
      />

      <CircleBody x={earthX} y={yMid} diameter={earthR * 2} entryDur={0.4} />
      <CircleBody x={moonX} y={yMid} diameter={moonR * 2} entryDur={0.4} />

      {[...Array(N)].map((_, i) => {
        const appear = 0.8 + i * 0.07;
        const t = window.clamp((localTime - appear) / 0.4, 0, 1);
        const eased = window.Easing.easeOutCubic(t);
        const x = gapStart + step * i;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x, top: yMid,
            width: earthR * 2 * eased, height: earthR * 2 * eased,
            marginLeft: -(earthR * eased), marginTop: -(earthR * eased),
            borderRadius: '50%',
            background: '#fff',
            opacity: eased * 0.85,
          }} />
        );
      })}

      {/* Live big counter */}
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: yMid + 70,
        transform: 'translateX(-50%)',
        fontFamily: helv, fontSize: 96, fontWeight: 700,
        color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
        opacity: window.clamp((localTime - 0.8) / 0.4, 0, 1),
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(visibleCount).padStart(2, '0')}
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>/30</span>
      </div>
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: yMid + 180,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff',
        letterSpacing: '0.3em', textTransform: 'uppercase',
        opacity: window.clamp((localTime - 2.4) / 0.4, 0, 1),
      }}>
        EARTHS PLACED · Ø 12,742 KM EACH
      </div>

      {/* End labels */}
      <div style={{
        position: 'absolute', left: earthX, top: yMid + 60,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 12, color: '#fff',
        letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.7,
      }}>EARTH</div>
      <div style={{
        position: 'absolute', left: moonX, top: yMid + 60,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 12, color: '#fff',
        letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.7,
      }}>MOON</div>
    </>
  );
}

// 28–36: The Sun
function SceneSun() {
  const sunR = 360;
  const earthR = 360 / 109;
  const cx = CENTER_X + 320;
  const cy = CENTER_Y + 140;

  return (
    <>
      <SceneHeader
        kicker="05 · OUR LOCAL STAR"
        title="THE SUN"
        sub={"You could pour 1.3 million Earths into the Sun — and there would still be space left over."}
      />

      <CircleBody x={cx} y={cy} diameter={sunR * 2} entryDur={1.2} />

      {/* Earth-for-scale dot top-left of sun */}
      <CircleBody
        x={cx - sunR - 100}
        y={cy - sunR + 30}
        diameter={earthR * 2}
        start={1.2}
        entryDur={0.5}
      />
      <div style={{
        position: 'absolute',
        left: cx - sunR - 100,
        top: cy - sunR + 60,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 13, color: '#fff',
        opacity: 0.85, letterSpacing: '0.2em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>← Earth, to scale</div>

      <Analogy
        x={80} y={460}
        hint="PUT IT THIS WAY"
        text={"If the Sun were a beach ball, Earth would be a peppercorn beside it. The next planet is 1,400 of these peppercorns away."}
        maxWidth={600}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 280}
        items={[
          ['Diameter', '1,392,700 km'],
          ['Mass : Earth', '333,000 ×'],
          ['Earths inside', '≈ 1,300,000'],
          ['Surface temp', '5,500 °C'],
        ]}
      />
    </>
  );
}

// 36–42: Light travel
function SceneLight() {
  const { localTime } = window.useSprite();
  const sunX = 240;
  const earthX = STAGE_W - 280;
  const yMid = CENTER_Y + 180;

  const travelStart = 1.6;
  const travelEnd = 5.2;
  const t = window.clamp((localTime - travelStart) / (travelEnd - travelStart), 0, 1);
  const photonX = sunX + (earthX - sunX) * t;
  const photonOp = (localTime > travelStart && localTime < travelEnd + 0.2) ? 1 : 0;

  // Show a virtual stopwatch counting up from 0:00 to 8:20
  const watchSeconds = Math.min(8 * 60 + 20, Math.round(t * (8 * 60 + 20)));
  const wm = Math.floor(watchSeconds / 60);
  const ws = watchSeconds % 60;

  return (
    <>
      <SceneHeader
        kicker="06 · THE SPEED OF LIGHT"
        title={"8 MIN 20 SEC"}
        sub={"That sunbeam warming your skin right now left the Sun before you finished your coffee."}
      />

      <CircleBody x={sunX} y={yMid} diameter={160} entryDur={0.5} />
      <CircleBody x={earthX} y={yMid} diameter={40} entryDur={0.5} />

      <div style={{
        position: 'absolute',
        left: sunX + 80 + 12,
        top: yMid - 0.5,
        width: earthX - sunX - 80 - 20 - 12,
        height: 1,
        backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.4) 0 6px, transparent 6px 12px)',
      }} />

      <div style={{
        position: 'absolute',
        left: photonX, top: yMid - 6,
        width: 12, height: 12, marginLeft: -6,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.4)',
        opacity: photonOp,
      }} />
      {photonOp > 0 && (
        <div style={{
          position: 'absolute',
          left: sunX + 80, top: yMid - 0.5,
          width: photonX - (sunX + 80), height: 1,
          background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.9))',
        }} />
      )}

      <div style={{
        position: 'absolute', left: sunX, top: yMid + 100,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff',
        letterSpacing: '0.24em', textTransform: 'uppercase',
      }}>SUN</div>
      <div style={{
        position: 'absolute', left: earthX, top: yMid + 60,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff',
        letterSpacing: '0.24em', textTransform: 'uppercase',
      }}>EARTH</div>

      {/* Big live stopwatch above the dotted path */}
      <div style={{
        position: 'absolute',
        left: (sunX + earthX) / 2,
        top: yMid - 130,
        transform: 'translateX(-50%)',
        fontFamily: helv, fontSize: 72, fontWeight: 700,
        color: '#fff', letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
      }}>{wm}:{String(ws).padStart(2, '0')}</div>
      <div style={{
        position: 'absolute',
        left: (sunX + earthX) / 2,
        top: yMid - 50,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: 0.7,
      }}>c · 299,792 km / s · 149.6 million km to go</div>

      <Analogy
        x={80} y={460}
        hint="WHICH MEANS"
        text={"When you look up at the Sun, you are seeing 8 minutes into the past. If it switched off right now, you would not know until 12:08."}
        maxWidth={600}
      />
    </>
  );
}

// 42–48: Jupiter
function SceneJupiter() {
  const jR = 280;
  const earthR = jR / 11.2;
  const cx = CENTER_X + 320;
  const cy = CENTER_Y + 160;
  return (
    <>
      <SceneHeader
        kicker="07 · BIGGEST PLANET"
        title="JUPITER"
        sub={"A gas giant so massive that 1,321 Earths would rattle around inside it."}
      />

      <CircleBody x={cx} y={cy} diameter={jR * 2} entryDur={0.9} />
      <CircleBody
        x={cx - jR + 40}
        y={cy - jR + 40}
        diameter={earthR * 2}
        start={0.9}
        entryDur={0.4}
      />
      <div style={{
        position: 'absolute',
        left: cx - jR + 40,
        top: cy - jR + 40 + 28,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 13, color: '#fff',
        opacity: 0.85, letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>Earth</div>

      <Analogy
        x={80} y={460}
        hint="FUN FACT"
        text={"Its Great Red Spot is a single storm wider than Earth itself — and it has been spinning for at least 350 years."}
        maxWidth={600}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 260}
        items={[
          ['Diameter', '139,820 km'],
          ['Earths inside', '≈ 1,321'],
          ['Known moons', '95'],
          ['One year', '11.86 Earth-years'],
        ]}
      />
    </>
  );
}

// 48–54: Voyager 1
function SceneVoyager() {
  const { localTime } = window.useSprite();
  const t = window.clamp(localTime / 5.5, 0, 1);
  const eased = window.Easing.easeInOutCubic(t);
  const startX = 200;
  const endX = STAGE_W - 200;
  const probeX = startX + (endX - startX) * eased;
  const yMid = CENTER_Y + 160;

  return (
    <>
      <SceneHeader
        kicker="08 · FURTHEST HUMAN OBJECT"
        title="VOYAGER 1"
        sub={"Launched in 1977 and still phoning home from interstellar space, one faint radio bit at a time."}
      />

      <div style={{
        position: 'absolute',
        left: startX, top: yMid - 0.5,
        width: probeX - startX, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6))',
      }} />

      <div style={{
        position: 'absolute',
        left: probeX, top: yMid - 0.5,
        width: endX - probeX, height: 1,
        backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.25) 0 4px, transparent 4px 10px)',
      }} />

      <div style={{
        position: 'absolute', left: startX, top: yMid,
        width: 14, height: 14, marginLeft: -7, marginTop: -7,
        borderRadius: '50%', background: '#fff',
      }} />
      <div style={{
        position: 'absolute', left: startX, top: yMid + 22,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 13, color: '#fff',
        letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85,
      }}>Earth, 1977</div>

      <div style={{
        position: 'absolute', left: probeX, top: yMid,
        width: 8, height: 8, marginLeft: -4, marginTop: -4,
        borderRadius: '50%', background: '#fff',
      }} />
      <div style={{
        position: 'absolute', left: probeX, top: yMid,
        width: 30, height: 30, marginLeft: -15, marginTop: -15,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)',
      }} />
      <div style={{
        position: 'absolute', left: probeX, top: yMid - 56,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff',
        letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>Voyager 1</div>
      <div style={{
        position: 'absolute', left: probeX, top: yMid - 36,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 13, color: '#fff', opacity: 0.7,
        letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>+ {(24.0 + eased * 0.9).toFixed(2)} billion km</div>

      <Analogy
        x={80} y={460}
        hint="OLDER THAN"
        text={"Voyager left Earth before the first iPhone, before the World Wide Web, before Microsoft Excel. And it is still flying."}
        maxWidth={620}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 260}
        items={[
          ['Launched', '05 Sep 1977 · 49 yrs ago'],
          ['Distance now', '24.9 billion km'],
          ['Speed', '17 km / second'],
          ['Round-trip signal', '46 hours'],
        ]}
      />
    </>
  );
}

// 54–62: Proxima Centauri
function SceneProxima() {
  const yMid = CENTER_Y + 200;
  const sunX = 220;
  const proxX = STAGE_W - 220;
  return (
    <>
      <SceneHeader
        kicker="09 · THE NEXT-NEAREST STAR"
        title="PROXIMA CENTAURI"
        sub={"The closest star outside our Solar System. So far away that the word 'kilometre' starts to feel insulting."}
      />

      <CircleBody x={sunX} y={yMid} diameter={80} entryDur={0.5} />
      <CircleBody x={proxX} y={yMid} diameter={56} start={0.6} entryDur={0.5} />

      <div style={{
        position: 'absolute', left: sunX, top: yMid + 60,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff', letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}>SUN · G2V</div>
      <div style={{
        position: 'absolute', left: proxX, top: yMid + 48,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 14, color: '#fff', letterSpacing: '0.24em',
        textTransform: 'uppercase',
      }}>PROXIMA · M5.5V</div>

      <Measure
        x1={sunX + 50}
        x2={proxX - 36}
        y={yMid - 80}
        label="4.2465 LIGHT YEARS"
        sublabel="40,170,000,000,000 KM"
        entryDelay={1.4}
      />

      <Analogy
        x={80} y={460}
        hint="PACK A SANDWICH"
        text={"At Voyager's current speed, you would arrive at Proxima Centauri in the year 75,000. Light makes the same trip in 4 years."}
        maxWidth={620}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 230}
        items={[
          ['By Voyager', '73,000 years'],
          ['By light', '4 yr 89 days'],
          ['Known planets', '3 (one Earth-like)'],
        ]}
      />
    </>
  );
}

// 62–69: Milky Way (cluster of dots)
function SceneMilkyWay() {
  const { localTime } = window.useSprite();
  const dots = [];
  for (let i = 0; i < 280; i++) {
    const arm = i % 2;
    const t = i / 280;
    const angle = t * Math.PI * 4 + arm * Math.PI;
    const radius = 50 + t * 220 + (Math.sin(i * 1.3) * 10);
    const cx = CENTER_X + 340 + Math.cos(angle) * radius;
    const cy = CENTER_Y + 180 + Math.sin(angle) * radius * 0.55;
    const size = 1.4 + (1 - t) * 2.4 + Math.sin(i) * 0.8;
    dots.push({ cx, cy, size, t, i });
  }

  const rotation = localTime * 4;

  return (
    <>
      <SceneHeader
        kicker="10 · OUR GALAXY"
        title="MILKY WAY"
        sub={"A slowly turning disc of 100 to 400 billion stars. We sit about two-thirds of the way out, on a quiet edge."}
      />

      <div style={{
        position: 'absolute',
        left: CENTER_X + 340,
        top: CENTER_Y + 180,
        width: 0, height: 0,
        transform: `rotate(${rotation}deg)`,
      }}>
        {dots.map((d, i) => {
          const appear = 0.4 + d.t * 1.6;
          const a = window.clamp((localTime - appear) / 0.6, 0, 1);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: d.cx - CENTER_X - 340,
              top: d.cy - CENTER_Y - 180,
              width: d.size, height: d.size,
              marginLeft: -d.size / 2, marginTop: -d.size / 2,
              background: '#fff', borderRadius: '50%',
              opacity: a * (0.4 + (1 - d.t) * 0.6),
            }} />
          );
        })}

        {/* core */}
        <div style={{
          position: 'absolute',
          left: -8, top: -8,
          width: 16, height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 0 24px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)',
        }} />

        {/* "you are here" arrow */}
        <div style={{
          position: 'absolute',
          left: -180, top: -10,
          width: 12, height: 12, marginLeft: -6, marginTop: -6,
          borderRadius: '50%',
          border: '1.5px solid #fff',
          background: 'transparent',
          transform: `rotate(${-rotation}deg)`,
        }} />
      </div>

      <div style={{
        position: 'absolute',
        left: CENTER_X + 340 - 180,
        top: CENTER_Y + 180 + 30,
        transform: 'translateX(-50%)',
        fontFamily: mono, fontSize: 13, color: '#fff',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        opacity: window.clamp((localTime - 3) / 0.6, 0, 1),
      }}>you are here, give or take</div>

      <Analogy
        x={80} y={460}
        hint="TO PUT IT IN BANGKOK"
        text={"If the Milky Way were the size of Thailand, our entire Solar System would be smaller than a one-baht coin."}
        maxWidth={580}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 240}
        items={[
          ['Diameter', '≈ 100,000 light-years'],
          ['Stars', '100 – 400 billion'],
          ['Our seat from core', '26,000 light-years'],
          ['One full rotation', '230 million years'],
        ]}
      />
    </>
  );
}

// 69–78: Observable universe
function SceneUniverse() {
  const { localTime } = window.useSprite();
  const dots = React.useMemo(() => {
    const arr = [];
    let seed = 42;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 700; i++) {
      const x = rng() * STAGE_W;
      const y = 380 + rng() * (STAGE_H - 480);
      const size = 0.6 + Math.pow(rng(), 3) * 6;
      const op = 0.25 + rng() * 0.75;
      const appear = rng() * 2.5;
      arr.push({ x, y, size, op, appear });
    }
    return arr;
  }, []);

  return (
    <>
      <SceneHeader
        kicker="11 · EVERYTHING WE CAN SEE"
        title={"2 TRILLION GALAXIES"}
        sub={"Each speck of light below is an entire galaxy. Each galaxy holds hundreds of billions of stars."}
      />

      {dots.map((d, i) => {
        const a = window.clamp((localTime - d.appear) / 0.6, 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            marginLeft: -d.size / 2, marginTop: -d.size / 2,
            borderRadius: '50%',
            background: '#fff',
            opacity: a * d.op,
          }} />
        );
      })}

      <Analogy
        x={80} y={460}
        hint="BIGGER THAN A BEACH"
        text={"There are more galaxies in the observable universe than grains of sand on every beach, on every continent, on Earth."}
        maxWidth={620}
      />

      <StatBlock
        x={STAGE_W - 80}
        y={STAGE_H - 220}
        items={[
          ['Diameter', '93 billion light-years'],
          ['Galaxies', '≈ 2,000,000,000,000'],
          ['Age', '13.787 billion years'],
        ]}
      />
    </>
  );
}

// 78–82: Return to a single dot
function SceneReturn() {
  const { localTime, duration } = window.useSprite();
  const inT = window.Easing.easeOutCubic(window.clamp(localTime / 1.2, 0, 1));

  const pulse = 0.5 + 0.5 * Math.sin(localTime * 2.4);

  return (
    <>
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y - 60,
        transform: 'translate(-50%, -50%)',
        fontFamily: helv,
        fontSize: 88, fontWeight: 700, color: '#fff',
        letterSpacing: '-0.04em',
        opacity: inT,
        whiteSpace: 'nowrap',
      }}>
        and you are still here.
      </div>

      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y + 24,
        transform: 'translate(-50%, 0)',
        fontFamily: helv,
        fontSize: 22, color: 'rgba(255,255,255,0.65)',
        opacity: inT,
        whiteSpace: 'nowrap',
      }}>
        And that, all things considered, is no small thing.
      </div>

      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y + 120,
        width: 8, height: 8, marginLeft: -4, marginTop: -4,
        borderRadius: '50%',
        background: '#fff',
        opacity: inT,
      }} />
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CENTER_Y + 120,
        width: 8 + 40 * pulse, height: 8 + 40 * pulse,
        marginLeft: -(8 + 40 * pulse) / 2, marginTop: -(8 + 40 * pulse) / 2,
        border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%',
        opacity: inT * (1 - pulse),
      }} />
    </>
  );
}

// ── Frame chrome ────────────────────────────────────────────────────────────

function Frame() {
  const time = window.useTime();
  const sceneIndex = (() => {
    if (time < 4) return 0;
    if (time < 9) return 1;
    if (time < 15) return 2;
    if (time < 22) return 3;
    if (time < 28) return 4;
    if (time < 36) return 5;
    if (time < 42) return 6;
    if (time < 48) return 7;
    if (time < 54) return 8;
    if (time < 62) return 9;
    if (time < 69) return 10;
    if (time < 78) return 11;
    return 12;
  })();

  return (
    <>
      {/* Top-left mark */}
      <div style={{
        position: 'absolute', top: 32, left: 32,
        fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.3em', textTransform: 'uppercase',
      }}>
        Chawanwit Silakhan &nbsp;/&nbsp; Portfolio
      </div>

      {/* Top-right counter */}
      <div style={{
        position: 'absolute', top: 32, right: 32,
        fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.3em', textTransform: 'uppercase',
      }}>
        Scene {String(sceneIndex).padStart(2, '0')} / 12
      </div>

      {/* Bottom register marks */}
      <div style={{
        position: 'absolute', bottom: 32, left: 32, right: 32,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.3em', textTransform: 'uppercase',
      }}>
        <span>Animated Portfolio Intro</span>
        <span>Sprite-based, monochrome</span>
        <span>{time.toFixed(2)} sec</span>
      </div>
    </>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────

function CosmicAnimation() {
  return (
    <window.Stage
      width={STAGE_W}
      height={STAGE_H}
      duration={82}
      background="#000"
      persistKey="cosmic"
    >
      <Frame />

      <window.Sprite start={0}    end={4}>  <SceneTitle /></window.Sprite>
      <window.Sprite start={4}    end={9}>  <SceneYouAreHere /></window.Sprite>
      <window.Sprite start={9}    end={15}> <SceneEarth /></window.Sprite>
      <window.Sprite start={15}   end={22}> <SceneMoon /></window.Sprite>
      <window.Sprite start={22}   end={28}> <SceneThirty /></window.Sprite>
      <window.Sprite start={28}   end={36}> <SceneSun /></window.Sprite>
      <window.Sprite start={36}   end={42}> <SceneLight /></window.Sprite>
      <window.Sprite start={42}   end={48}> <SceneJupiter /></window.Sprite>
      <window.Sprite start={48}   end={54}> <SceneVoyager /></window.Sprite>
      <window.Sprite start={54}   end={62}> <SceneProxima /></window.Sprite>
      <window.Sprite start={62}   end={69}> <SceneMilkyWay /></window.Sprite>
      <window.Sprite start={69}   end={78}> <SceneUniverse /></window.Sprite>
      <window.Sprite start={78}   end={82}> <SceneReturn /></window.Sprite>
    </window.Stage>
  );
}

window.CosmicAnimation = CosmicAnimation;
