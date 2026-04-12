import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const SERVICES = [
  {
    id: 1, emoji: "⚡", num: "01",
    title: "Contrôle périodique OIBT",
    tag: "Obligation légale",
    desc: "Vérification complète de votre installation pour détecter anomalies et usures. Rapport détaillé inclus.",
    for: "Propriétaires · Gérances · Entreprises",
    goal: "Prévenir les risques et respecter les obligations légales",
    color: "#E63946",
  },
  {
    id: 2, emoji: "🏗️", num: "02",
    title: "Contrôle final",
    tag: "Après travaux",
    desc: "Vérifie que vos travaux sont conformes aux normes avant mise en service. Attestation officielle délivrée.",
    for: "Constructions · Rénovations",
    goal: "Assurer une mise en service conforme et sécurisée",
    color: "#2EC4B6",
  },
  {
    id: 3, emoji: "🧾", num: "03",
    title: "Contrôle de réception",
    tag: "Indépendant",
    desc: "Contrôle neutre et objectif de l'installation, indépendant de l'installateur. Validité officielle garantie.",
    for: "Maîtres d'ouvrage · Promoteurs",
    goal: "Garantir une conformité indépendante",
    color: "#F4A261",
  },
  {
    id: 4, emoji: "🔧", num: "04",
    title: "Conseil conformité",
    tag: "Sur mesure",
    desc: "Solutions claires et adaptées pour corriger les défauts. Nous vous guidons vers les meilleures options.",
    for: "Installations non conformes",
    goal: "Sécuriser et régulariser votre installation",
    color: "#E63946",
  },
];

const STATS = [
  { val: 500, suffix: "+", label: "Contrôles réalisés" },
  { val: 100, suffix: "%", label: "Clients satisfaits" },
  { val: 48, suffix: "h", label: "Délai d'intervention" },
  { val: 15, suffix: "+", label: "Ans d'expérience" },
];

const WHY = [
  { icon: "🔐", title: "Agréé ESTI", desc: "Autorisation officielle de contrôle électrique en Suisse." },
  { icon: "📋", title: "Rapport officiel", desc: "Document certifié remis après chaque intervention." },
  { icon: "⚡", title: "Réactivité 48h", desc: "Intervention rapide sur toute la Suisse romande." },
  { icon: "💬", title: "Conseil inclus", desc: "Nous vous expliquons chaque étape clairement." },
  { icon: "🛡️", title: "Conformité garantie", desc: "Chaque contrôle respecte les normes OIBT en vigueur." },
  { icon: "🚨", title: "Urgences traitées", desc: "Intervention prioritaire pour ventes et sinistres." },
];

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e) => setPos({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return pos;
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
function Reveal({ children, delay = 0, y = 40, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function StatCounter({ val, suffix, label, delay }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(val, inView);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".02em", color: "#E63946", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ color: "rgba(255,255,255,.45)", fontSize: ".82rem", marginTop: 6, letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function ElectricCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, lines = [], raf;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Line {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = -10;
        this.speed = 1.5 + Math.random() * 3;
        this.len = 40 + Math.random() * 120;
        this.alpha = .15 + Math.random() * .35;
        this.w = .5 + Math.random() * 1.2;
        this.drift = (Math.random() - .5) * .5;
      }
      update() {
        this.y += this.speed;
        this.x += this.drift;
        if (this.y > H + this.len) this.reset();
      }
      draw() {
        const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.len);
        grad.addColorStop(0, `rgba(230,57,70,0)`);
        grad.addColorStop(.5, `rgba(230,57,70,${this.alpha})`);
        grad.addColorStop(1, `rgba(230,57,70,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.w;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.drift * 8, this.y - this.len);
        ctx.stroke();
      }
    }

    for (let i = 0; i < 28; i++) {
      const l = new Line();
      l.y = Math.random() * H;
      lines.push(l);
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      lines.forEach(l => { l.update(); l.draw(); });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function ServiceCard({ s, i }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${i * 120}ms, transform .7s cubic-bezier(.16,1,.3,1) ${i * 120}ms`,
        background: hovered ? "rgba(230,57,70,.06)" : "rgba(255,255,255,.025)",
        border: `1px solid ${hovered ? "rgba(230,57,70,.5)" : "rgba(255,255,255,.07)"}`,
        borderRadius: 12,
        padding: "clamp(24px,4vw,36px)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
      }}>
      {/* Glow on hover */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 180, height: 180,
        background: `radial-gradient(circle, ${s.color}22 0%, transparent 70%)`,
        borderRadius: "50%", opacity: hovered ? 1 : 0, transition: "opacity .4s",
        pointerEvents: "none",
      }} />
      {/* Number */}
      <div style={{ position: "absolute", top: 20, right: 24, fontFamily: "'Bebas Neue',sans-serif", fontSize: "5rem", color: "rgba(255,255,255,.03)", lineHeight: 1, userSelect: "none" }}>
        {s.num}
      </div>
      {/* Tag */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${s.color}18`, border: `1px solid ${s.color}40`, borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
        <span style={{ color: s.color, fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.tag}</span>
      </div>
      {/* Icon */}
      <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{s.emoji}</div>
      <h3 style={{ fontSize: "clamp(1rem,2.5vw,1.2rem)", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-.01em" }}>{s.title}</h3>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".88rem", lineHeight: 1.75, marginBottom: 20 }}>{s.desc}</p>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 16 }}>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.3)", marginBottom: 5 }}>
          <span style={{ color: "rgba(255,255,255,.55)", fontWeight: 600 }}>Pour : </span>{s.for}
        </div>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.3)" }}>
          <span style={{ color: "rgba(255,255,255,.55)", fontWeight: 600 }}>Objectif : </span>{s.goal}
        </div>
      </div>
      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity .4s",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [hoveredWhy, setHoveredWhy] = useState(null);
  const mouse = useMouseParallax();

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Force body/html background to prevent white margins in iframe
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#080808";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.background = "#080808";
    document.documentElement.style.overflowX = "hidden";
  }, []);

  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const scrolled = scrollY > 60;

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#080808", color: "#fff", overflowX: "hidden", width: "100%", maxWidth: "100%", minHeight: "100vh", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Rajdhani:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { width: 100%; min-height: 100%; margin: 0 !important; padding: 0 !important; background: #080808; scroll-behavior: smooth; overflow-x: hidden; }
        body { width: 100%; min-height: 100%; margin: 0 !important; padding: 0 !important; background: #080808; overflow-x: hidden; }
        #root, [data-reactroot] { width: 100%; max-width: 100%; margin: 0; padding: 0; }
        section, nav, footer { width: 100%; max-width: 100%; display: block; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #E63946; border-radius: 2px; }

        .nav-a { cursor: pointer; color: rgba(255,255,255,.65); font-size: .88rem; font-weight: 500; letter-spacing: .04em; transition: color .2s; text-transform: uppercase; }
        .nav-a:hover { color: #fff; }
        .nav-a-dark { color: rgba(0,0,0,.65); }
        .nav-a-dark:hover { color: #000; }

        .cta { display: inline-flex; align-items: center; gap: 8px; background: #E63946; color: #fff; border: none; padding: 14px 28px; border-radius: 6px; font-family: 'DM Sans',sans-serif; font-weight: 700; font-size: .85rem; cursor: pointer; letter-spacing: .06em; text-transform: uppercase; transition: all .3s cubic-bezier(.16,1,.3,1); position: relative; overflow: hidden; }
        .cta::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #ff4757, #E63946); opacity: 0; transition: opacity .3s; }
        .cta:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(230,57,70,.5); }
        .cta:hover::before { opacity: 1; }
        .cta span { position: relative; z-index: 1; }
        .cta-ghost { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: rgba(255,255,255,.7); border: 1px solid rgba(255,255,255,.2); padding: 13px 28px; border-radius: 6px; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: .85rem; cursor: pointer; letter-spacing: .06em; text-transform: uppercase; transition: all .3s; }
        .cta-ghost:hover { border-color: rgba(255,255,255,.6); color: #fff; background: rgba(255,255,255,.05); }

        .inp { width: 100%; padding: 14px 16px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; font-family: 'DM Sans',sans-serif; font-size: .92rem; color: #fff; outline: none; transition: border-color .25s, box-shadow .25s, background .25s; }
        .inp::placeholder { color: rgba(255,255,255,.25); }
        .inp:focus { border-color: #E63946; box-shadow: 0 0 0 3px rgba(230,57,70,.15); background: rgba(255,255,255,.07); }
        .inp option { background: #1a1a1a; color: #fff; }

        .why-card { border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 28px 24px; background: rgba(255,255,255,.02); transition: all .35s cubic-bezier(.16,1,.3,1); cursor: default; }
        .why-card:hover { border-color: rgba(230,57,70,.4); background: rgba(230,57,70,.04); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(230,57,70,.15); }

        .process-step { display: flex; gap: 20px; align-items: flex-start; padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
        .process-step:last-child { border-bottom: none; }

        .hamburger span { display: block; width: 24px; height: 2px; background: #fff; border-radius: 2px; transition: all .3s; transform-origin: center; }

        @keyframes pulse-ring {
          0% { transform: scale(.8); opacity: .8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #E63946 0%, #ff6b6b 25%, #E63946 50%, #c0392b 75%, #E63946 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-card { display: none !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .desktop-nav { display: none !important; }
          .burger { display: flex !important; }
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(8,8,8,.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        padding: scrolled ? "14px 0" : "26px 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div onClick={() => go("accueil")} style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 1 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(1rem,2vw,1.2rem)", letterSpacing: ".2em", color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
              BORGES MONTEIRO
            </div>
            <div style={{ fontSize: ".55rem", letterSpacing: ".3em", color: "#E63946", textTransform: "uppercase", lineHeight: 1 }}>
              CONTRÔLE ÉLECTRIQUE
            </div>
          </div>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[["accueil","Accueil"],["services","Services"],["a-propos","À propos"],["contact","Contact"]].map(([id, label]) => (
              <span key={id} className="nav-a" onClick={() => go(id)}>{label}</span>
            ))}
            <button className="cta" onClick={() => go("contact")} style={{ padding: "10px 22px", fontSize: ".78rem" }}>
              <span>Devis gratuit</span>
            </button>
          </div>

          {/* Burger */}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", flexDirection: "column", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <span className="hamburger">
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "none" }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          maxHeight: menuOpen ? 400 : 0, overflow: "hidden",
          transition: "max-height .4s cubic-bezier(.16,1,.3,1)",
          background: "rgba(8,8,8,.98)", backdropFilter: "blur(20px)",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,.06)" : "none",
        }}>
          <div style={{ padding: "24px clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: 4 }}>
            {[["accueil","Accueil"],["services","Services"],["a-propos","À propos"],["contact","Contact"]].map(([id, label]) => (
              <span key={id} onClick={() => go(id)} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "rgba(255,255,255,.7)", fontSize: "1.05rem", cursor: "pointer", letterSpacing: ".04em" }}>{label}</span>
            ))}
            <button className="cta" onClick={() => go("contact")} style={{ marginTop: 16, justifyContent: "center" }}>
              <span>Devis gratuit →</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="accueil" style={{ minHeight: "100svh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "#080808" }}>
        {/* Electric rain canvas */}
        <ElectricCanvas />

        {/* Gradient orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", width: "60vw", height: "60vw", maxWidth: 700, maxHeight: 700,
            borderRadius: "50%", top: "-10%", left: "-10%",
            background: "radial-gradient(circle, rgba(230,57,70,.12) 0%, transparent 65%)",
            transform: `translate(${mouse.x * .4}px, ${mouse.y * .4}px)`,
            transition: "transform .8s cubic-bezier(.16,1,.3,1)",
          }} />
          <div style={{
            position: "absolute", width: "40vw", height: "40vw", maxWidth: 500, maxHeight: 500,
            borderRadius: "50%", bottom: "5%", right: "5%",
            background: "radial-gradient(circle, rgba(230,57,70,.08) 0%, transparent 65%)",
            transform: `translate(${-mouse.x * .2}px, ${-mouse.y * .2}px)`,
            transition: "transform .8s cubic-bezier(.16,1,.3,1)",
          }} />
          {/* Scanline */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.012) 2px, rgba(255,255,255,.012) 4px)", pointerEvents: "none" }} />
          {/* Grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
          {/* Bottom fade */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, #080808, transparent)" }} />
        </div>

        {/* Vertical red bar — logo DNA */}
        <div style={{ position: "absolute", right: "clamp(10%,16%,20%)", top: "6%", bottom: "6%", width: 4, background: "linear-gradient(to bottom, transparent, #E63946 20%, #ff4757 50%, #C0392B 80%, transparent)", borderRadius: 4, opacity: .6 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(100px,15vw,140px) clamp(20px,4vw,48px) clamp(60px,8vw,80px)", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "clamp(24px,4vw,40px)", position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E63946" }} />
                  <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid #E63946", animation: "pulse-ring 1.8s ease-out infinite" }} />
                </div>
                <span style={{ color: "#E63946", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                  Organisme agréé ESTI · Suisse romande
                </span>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: "clamp(3rem,8vw,6.5rem)", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".04em", lineHeight: .95, marginBottom: "clamp(20px,4vw,32px)" }}>
                <div style={{ color: "#fff" }}>CONTRÔLE</div>
                <div className="shimmer-text">ÉLECTRIQUE</div>
                <div style={{ color: "rgba(255,255,255,.18)", fontSize: ".38em", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".28em", marginTop: 8 }}>
                  BORGES MONTEIRO
                </div>
              </h1>

              <p style={{ color: "rgba(255,255,255,.55)", fontSize: "clamp(.95rem,1.8vw,1.1rem)", lineHeight: 1.8, marginBottom: "clamp(28px,5vw,48px)", maxWidth: 520 }}>
                Spécialistes des contrôles électriques OIBT en Suisse. Sécurité, conformité et rigueur — avec rapport officiel certifié à chaque intervention.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button className="cta" onClick={() => go("contact")}>
                  <span>Devis gratuit →</span>
                </button>
                <button className="cta-ghost" onClick={() => go("services")}>
                  Nos services
                </button>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: "clamp(16px,3vw,36px)", marginTop: "clamp(32px,5vw,56px)", flexWrap: "wrap" }}>
                {[["⚡","OIBT"], ["🛡️","Agréé ESTI"], ["📋","Rapport officiel"], ["📍","Suisse romande"]].map(([ic, lb]) => (
                  <div key={lb} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.35)", fontSize: ".8rem" }}>
                    <span style={{ fontSize: "1rem" }}>{ic}</span>
                    <span>{lb}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero floating card */}
            <div className="hero-card" style={{
              background: "rgba(255,255,255,.03)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,.08)", borderRadius: 16,
              overflow: "hidden", position: "relative",
              transform: `translate(${mouse.x * .15}px, ${mouse.y * .1}px)`,
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
              animation: "float 6s ease-in-out infinite",
            }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #E63946, #ff6b6b, #E63946)" }} />
              <div style={{ padding: "clamp(20px,3vw,28px)" }}>
                <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 20, fontWeight: 700 }}>
                  Nos prestations
                </div>
                {SERVICES.map((s, i) => (
                  <div key={s.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none", alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem", flexShrink: 0 }}>
                      {s.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: ".85rem", marginBottom: 2 }}>{s.title}</div>
                      <div style={{ color: "rgba(255,255,255,.3)", fontSize: ".72rem", lineHeight: 1.4 }}>{s.goal}</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, marginTop: 8, flexShrink: 0 }} />
                  </div>
                ))}
                <button className="cta" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center", marginTop: 20, fontSize: ".8rem", padding: "13px" }}>
                  <span>Prendre rendez-vous</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: .4 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, #E63946, transparent)" }} />
          <span style={{ fontSize: ".65rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#E63946" }}>Scroll</span>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.04)", padding: "clamp(40px,8vw,72px) clamp(20px,4vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(20px,4vw,40px)" }} className="why-grid">
          {STATS.map((s, i) => <StatCounter key={i} {...s} delay={i * 100} />)}
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" style={{ padding: "clamp(64px,10vw,120px) clamp(20px,4vw,48px)", background: "#080808" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(40px,7vw,72px)" }}>
              <div style={{ color: "#E63946", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>— Nos prestations</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.8rem,7vw,5rem)", letterSpacing: ".04em", lineHeight: .95, color: "#fff" }}>
                  DES CONTRÔLES<br /><span style={{ color: "#E63946" }}>POUR CHAQUE</span><br />SITUATION
                </h2>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".93rem", maxWidth: 360, lineHeight: 1.75 }}>
                  Chaque type d'installation a ses exigences. Nos experts interviennent selon vos besoins et les normes légales suisses.
                </p>
              </div>
              <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#E63946,transparent)", marginTop: 24, borderRadius: 2 }} />
            </div>
          </Reveal>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(12px,2vw,20px)" }}>
            {SERVICES.map((s, i) => <ServiceCard key={s.id} s={s} i={i} />)}
          </div>

          {/* Urgent banner */}
          <Reveal delay={200}>
            <div style={{
              marginTop: "clamp(16px,3vw,24px)",
              background: "linear-gradient(135deg, rgba(230,57,70,.12) 0%, rgba(192,57,43,.06) 100%)",
              border: "1px solid rgba(230,57,70,.25)", borderRadius: 12,
              padding: "clamp(24px,4vw,40px) clamp(20px,4vw,36px)",
              display: "flex", alignItems: "center", gap: "clamp(16px,3vw,32px)",
              flexWrap: "wrap", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom,#E63946,#C0392B)", borderRadius: "4px 0 0 4px" }} />
              <div style={{ fontSize: "2rem", animation: "float 3s ease-in-out infinite" }}>🚨</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(230,57,70,.2)", border: "1px solid rgba(230,57,70,.4)", borderRadius: 20, padding: "3px 12px", marginBottom: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E63946", boxShadow: "0 0 6px #E63946" }} />
                  <span style={{ color: "#E63946", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Intervention urgente</span>
                </div>
                <h3 style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>Besoin d'un contrôle en urgence ?</h3>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".88rem", lineHeight: 1.65 }}>
                  Vente, sinistre ou demande des autorités — traitement prioritaire et rapport express.
                </p>
                <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
                  {["Intervention rapide","Traitement prioritaire","Rapport express"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.5)", fontSize: ".8rem" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#E63946" }} />{t}
                    </div>
                  ))}
                </div>
              </div>
              <button className="cta" onClick={() => go("contact")} style={{ flexShrink: 0 }}>
                <span>Urgence →</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ PROCESSUS ══════════ */}
      <section style={{ padding: "clamp(64px,10vw,120px) clamp(20px,4vw,48px)", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,8vw,100px)", alignItems: "start" }} className="contact-grid">
          <Reveal>
            <div style={{ position: "sticky", top: 120 }}>
              <div style={{ color: "#E63946", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>— Méthode</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.8rem,6vw,4.5rem)", letterSpacing: ".04em", lineHeight: .95, color: "#fff", marginBottom: 24 }}>
                COMMENT ÇA<br /><span style={{ color: "#E63946" }}>FONCTIONNE ?</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 400 }}>
                Un processus clair et transparent, de la prise de contact jusqu'à la remise du rapport officiel.
              </p>
              <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#E63946,transparent)", marginTop: 24, borderRadius: 2 }} />
            </div>
          </Reveal>
          <div>
            {[
              { n:"01", t:"Prise de contact", d:"Appelez-nous ou remplissez le formulaire. Nous évaluons vos besoins et planifions l'intervention rapidement." },
              { n:"02", t:"Intervention sur site", d:"Nos experts se déplacent chez vous et effectuent un contrôle rigoureux, complet et non-invasif." },
              { n:"03", t:"Rapport détaillé", d:"Vous recevez un rapport officiel complet avec résultats, anomalies détectées et recommandations." },
              { n:"04", t:"Attestation de conformité", d:"En cas de conformité, l'attestation officielle vous est remise. Sinon, nous vous guidons vers la mise en conformité." },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="process-step">
                  <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 10, background: i === 0 ? "#E63946" : "rgba(255,255,255,.04)", border: i === 0 ? "none" : "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.3rem", color: i === 0 ? "#fff" : "rgba(255,255,255,.3)", letterSpacing: ".04em" }}>
                    {p.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 8 }}>{p.t}</h4>
                    <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".88rem", lineHeight: 1.7 }}>{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ POURQUOI NOUS ══════════ */}
      <section id="a-propos" style={{ padding: "clamp(64px,10vw,120px) clamp(20px,4vw,48px)", background: "#080808" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(40px,7vw,72px)" }}>
              <div style={{ color: "#E63946", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>— Pourquoi nous</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.8rem,7vw,5rem)", letterSpacing: ".04em", color: "#fff", lineHeight: .95 }}>
                VOTRE PARTENAIRE<br /><span style={{ color: "#E63946" }}>DE CONFIANCE</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".95rem", maxWidth: 480, margin: "20px auto 0", lineHeight: 1.75 }}>
                Borges Monteiro, c'est une expertise reconnue au service de la sécurité électrique en Suisse romande.
              </p>
            </div>
          </Reveal>

          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,2vw,16px)" }}>
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="why-card">
                  <div style={{ fontSize: "1.8rem", marginBottom: 16 }}>{w.icon}</div>
                  <h4 style={{ fontWeight: 800, fontSize: "1rem", color: "#fff", marginBottom: 8 }}>{w.title}</h4>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".86rem", lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Full-width CTA band */}
          <Reveal delay={100}>
            <div style={{
              marginTop: "clamp(40px,6vw,64px)",
              background: "linear-gradient(135deg, #E63946 0%, #C0392B 100%)",
              borderRadius: 14, padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-40%", right: "-5%", width: "50%", aspectRatio: "1", background: "rgba(255,255,255,.06)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", bottom: "-60%", left: "30%", width: "40%", aspectRatio: "1", background: "rgba(0,0,0,.08)", borderRadius: "50%" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", letterSpacing: ".04em", color: "#fff", lineHeight: 1, marginBottom: 8 }}>
                  PRÊT À SÉCURISER VOTRE INSTALLATION ?
                </h3>
                <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".95rem" }}>Réponse sous 24h · Devis gratuit · Sans engagement</p>
              </div>
              <button onClick={() => go("contact")} style={{
                flexShrink: 0, background: "#fff", color: "#E63946", border: "none",
                padding: "16px 32px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif",
                fontWeight: 800, fontSize: ".9rem", cursor: "pointer", letterSpacing: ".06em",
                textTransform: "uppercase", transition: "all .3s", position: "relative", zIndex: 1,
                boxShadow: "0 8px 30px rgba(0,0,0,.25)",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.35)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,.25)"; }}>
                Contactez-nous →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" style={{ padding: "clamp(64px,10vw,120px) clamp(20px,4vw,48px)", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
              <div style={{ color: "#E63946", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>— Contact</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.8rem,7vw,5rem)", letterSpacing: ".04em", lineHeight: .95, color: "#fff" }}>
                  DEMANDEZ<br /><span style={{ color: "#E63946" }}>VOTRE DEVIS</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".93rem", maxWidth: 340, lineHeight: 1.75 }}>
                  Gratuit, sans engagement, réponse sous 24h.
                </p>
              </div>
              <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#E63946,transparent)", marginTop: 24, borderRadius: 2 }} />
            </div>
          </Reveal>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "clamp(32px,6vw,72px)", alignItems: "start" }}>
            {/* Info col */}
            <Reveal>
              <div>
                {[
                  { ic: "📞", lb: "Téléphone", val: "+41 XX XXX XX XX", href: "tel:+41XXXXXXXXXX" },
                  { ic: "✉️", lb: "Email", val: "info@borges-monteiro.ch", href: "mailto:info@borges-monteiro.ch" },
                  { ic: "📍", lb: "Zone", val: "Toute la Suisse romande" },
                  { ic: "🕐", lb: "Horaires", val: "Lun–Ven · 8h00–18h00" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(230,57,70,.1)", border: "1px solid rgba(230,57,70,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                      {c.ic}
                    </div>
                    <div>
                      <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.3)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{c.lb}</div>
                      {c.href
                        ? <a href={c.href} style={{ color: "#fff", fontWeight: 600, fontSize: ".95rem", textDecoration: "none", transition: "color .2s" }}
                          onMouseOver={e => e.target.style.color = "#E63946"} onMouseOut={e => e.target.style.color = "#fff"}>{c.val}</a>
                        : <div style={{ color: "#fff", fontWeight: 600, fontSize: ".95rem" }}>{c.val}</div>
                      }
                    </div>
                  </div>
                ))}

                <div style={{ background: "rgba(230,57,70,.08)", border: "1px solid rgba(230,57,70,.2)", borderRadius: 10, padding: "20px 18px", marginTop: 8, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom, #E63946, #C0392B)", borderRadius: "3px 0 0 3px" }} />
                  <div style={{ paddingLeft: 8 }}>
                    <div style={{ fontWeight: 800, color: "#fff", marginBottom: 6, fontSize: ".95rem" }}>🚨 Urgence ?</div>
                    <div style={{ color: "rgba(255,255,255,.45)", fontSize: ".83rem", lineHeight: 1.65 }}>Intervention prioritaire disponible. Appelez-nous directement.</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={150}>
              <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "clamp(24px,4vw,40px)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #E63946, #ff6b6b)" }} />
                {sent ? (
                  <div style={{ textAlign: "center", padding: "clamp(40px,8vw,80px) 0" }}>
                    <div style={{ fontSize: "3.5rem", marginBottom: 20, animation: "float 2s ease-in-out infinite" }}>✅</div>
                    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: ".04em", color: "#fff", marginBottom: 10 }}>MESSAGE ENVOYÉ !</h3>
                    <p style={{ color: "rgba(255,255,255,.4)" }}>Nous vous répondrons sous 24 heures.</p>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      {[{lb:"Nom complet *",ph:"Jean Dupont",type:"text",req:true,f:"name"},{lb:"Email *",ph:"jean@exemple.ch",type:"email",req:true,f:"email"}].map(x => (
                        <div key={x.f}>
                          <label style={{ display: "block", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{x.lb}</label>
                          <input className="inp" type={x.type} required={x.req} placeholder={x.ph} value={form[x.f]} onChange={e => setForm({ ...form, [x.f]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: "block", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Téléphone</label>
                        <input className="inp" placeholder="+41 XX XXX XX XX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Service</label>
                        <select className="inp" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ cursor: "pointer" }}>
                          <option value="">Choisir…</option>
                          <option>Contrôle périodique OIBT</option>
                          <option>Contrôle final</option>
                          <option>Contrôle de réception</option>
                          <option>Conseil mise en conformité</option>
                          <option>Contrôle urgent</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 22 }}>
                      <label style={{ display: "block", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Message</label>
                      <textarea className="inp" rows={4} placeholder="Décrivez votre installation, la surface, votre situation…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="cta" style={{ width: "100%", justifyContent: "center", fontSize: ".88rem", padding: "16px" }}>
                      <span>Envoyer ma demande →</span>
                    </button>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,.2)", fontSize: ".72rem", marginTop: 14 }}>
                      🔒 Données confidentielles · Réponse sous 24h · Sans engagement
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,.06)", padding: "clamp(40px,6vw,72px) clamp(20px,4vw,48px) clamp(24px,3vw,32px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "clamp(32px,5vw,64px)", marginBottom: "clamp(32px,5vw,56px)" }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(1rem,2vw,1.2rem)", letterSpacing: ".2em", color: "#fff", textTransform: "uppercase", marginBottom: 2 }}>BORGES MONTEIRO</div>
              <div style={{ fontSize: ".55rem", letterSpacing: ".3em", color: "#E63946", textTransform: "uppercase", marginBottom: 16 }}>CONTRÔLE ÉLECTRIQUE</div>
              <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#E63946,transparent)", borderRadius: 1, marginBottom: 18 }} />
              <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".84rem", lineHeight: 1.8, maxWidth: 300 }}>
                Organisme de contrôle électrique agréé ESTI. Spécialistes des contrôles OIBT en Suisse romande.
              </p>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,.2)", fontWeight: 700, fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 18 }}>Services</div>
              {[...SERVICES.map(s => s.title), "Contrôle urgent"].map(t => (
                <div key={t} style={{ marginBottom: 10, fontSize: ".85rem", color: "rgba(255,255,255,.35)", cursor: "pointer", transition: "color .2s" }}
                  onMouseOver={e => e.target.style.color = "#E63946"} onMouseOut={e => e.target.style.color = "rgba(255,255,255,.35)"}>
                  {t}
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,.2)", fontWeight: 700, fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 18 }}>Contact</div>
              {[["📞","+41 XX XXX XX XX"],["✉️","info@borges-monteiro.ch"],["📍","Suisse romande"],["🕐","Lun–Ven · 8h–18h"]].map(([ic,t]) => (
                <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: ".84rem", color: "rgba(255,255,255,.35)", alignItems: "center" }}>
                  <span style={{ opacity: .6 }}>{ic}</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: ".76rem", color: "rgba(255,255,255,.2)" }}>
            <span>© 2026 Borges Monteiro Contrôle Électrique. Tous droits réservés.</span>
            <span>Agréé ESTI · Suisse romande</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
