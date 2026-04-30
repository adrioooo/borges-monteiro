import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function useCounter(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

function Stat({ val, suffix, label, delay }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(val, inView);
  return (
    <div ref={ref} style={{ textAlign: "center", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all .6s ease ${delay}ms` }}>
      <div style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#FFD200", lineHeight: 1 }}>{count}{suffix}</div>
      <div style={{ color: "rgba(255,255,255,.4)", fontSize: ".78rem", marginTop: 6, letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

const WHY = [
  { icon: "🔐", title: "Agréé ESTI", desc: "Autorisation officielle de contrôle électrique en Suisse." },
  { icon: "📋", title: "Rapport officiel", desc: "Document certifié remis après chaque intervention." },
  { icon: "⚡", title: "Réactivité 48h", desc: "Intervention rapide sur toute la Suisse romande." },
  { icon: "🛡️", title: "Conformité garantie", desc: "Chaque contrôle respecte les normes OIBT en vigueur." },
  { icon: "💬", title: "Conseil inclus", desc: "Nous vous expliquons chaque étape clairement." },
  { icon: "🚨", title: "Urgences traitées", desc: "Intervention prioritaire pour ventes et sinistres." },
];

export default function Accueil() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", height: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          transform: "scale(1.04)",
          transition: "transform 8s ease",
          filter: "brightness(.45)",
        }} />

        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,8,8,.92) 0%, rgba(8,8,8,.55) 55%, rgba(8,8,8,.2) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />

        {/* Yellow accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom, transparent, #FFD200 30%, #FFD200 70%, transparent)" }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
          transition: "opacity .9s ease, transform .9s ease",
        }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(255,210,0,.1)", border: "1px solid rgba(255,210,0,.3)", borderRadius: 20, padding: "6px 16px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFD200", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
              Organisme agréé ESTI · Suisse romande
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(3rem,8vw,6rem)", fontWeight: 900, lineHeight: .95, letterSpacing: "-.03em", marginBottom: 28, maxWidth: 760 }}>
            <span style={{ display: "block", color: "#fff" }}>Contrôle</span>
            <span style={{ display: "block", color: "#FFD200" }}>électrique</span>
            <span style={{ display: "block", color: "rgba(255,255,255,.75)", fontSize: ".55em", fontWeight: 700, letterSpacing: "-.01em", marginTop: 8 }}>certifié OIBT en Suisse</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,.55)", fontSize: "clamp(1rem,2vw,1.1rem)", lineHeight: 1.8, maxWidth: 500, marginBottom: 44 }}>
            Sécurité, conformité et rigueur — rapport officiel certifié à chaque intervention en Suisse romande.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/contact")} style={{
              background: "#FFD200", color: "#0a0a0a", border: "none",
              padding: "15px 32px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 800, fontSize: ".88rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
              transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(255,210,0,.35)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Devis gratuit →
            </button>
            <button onClick={() => navigate("/services")} style={{
              background: "transparent", color: "rgba(255,255,255,.8)",
              border: "1px solid rgba(255,255,255,.25)", padding: "14px 32px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 600, fontSize: ".88rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
              transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#FFD200"; e.currentTarget.style.color = "#FFD200"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.25)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
            >
              Nos services
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .5, animation: "float 2.5s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, #FFD200, transparent)" }} />
          <span style={{ fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#FFD200" }}>Scroll</span>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)", padding: "clamp(36px,6vw,60px) clamp(20px,4vw,48px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(20px,4vw,40px)" }} className="stats-grid">
          <Stat val={500} suffix="+" label="Contrôles réalisés" delay={0} />
          <Stat val={100} suffix="%" label="Clients satisfaits" delay={100} />
          <Stat val={48} suffix="h" label="Délai d'intervention" delay={200} />
          <Stat val={15} suffix="+" label="Ans d'expérience" delay={300} />
        </div>
      </section>

      {/* ══ POURQUOI NOUS ══ */}
      <section style={{ padding: "clamp(64px,9vw,100px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(36px,6vw,60px)" }}>
              <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Pourquoi nous</div>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: 1.05 }}>
                Votre partenaire<br /><span style={{ color: "#FFD200" }}>de confiance</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,2vw,16px)" }} className="why-grid">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{
                  border: "1px solid rgba(255,255,255,.07)", borderRadius: 10,
                  padding: "28px 24px", background: "rgba(255,255,255,.02)",
                  transition: "all .3s ease", cursor: "default",
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,210,0,.35)"; e.currentTarget.style.background = "rgba(255,210,0,.03)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.background = "rgba(255,255,255,.02)"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ fontSize: "1.7rem", marginBottom: 14 }}>{w.icon}</div>
                  <h4 style={{ fontWeight: 800, fontSize: ".95rem", color: "#fff", marginBottom: 8 }}>{w.title}</h4>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".84rem", lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA band */}
          <Reveal delay={100}>
            <div style={{
              marginTop: "clamp(36px,5vw,56px)",
              background: "#FFD200", borderRadius: 12,
              padding: "clamp(28px,4vw,48px) clamp(24px,4vw,40px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: "-5%", top: "-40%", width: "40%", aspectRatio: "1", background: "rgba(0,0,0,.06)", borderRadius: "50%" }} />
              <div style={{ position: "relative" }}>
                <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-.02em", marginBottom: 6 }}>
                  Prêt à sécuriser votre installation ?
                </h3>
                <p style={{ color: "rgba(0,0,0,.55)", fontSize: ".9rem" }}>Réponse sous 24h · Devis gratuit · Sans engagement</p>
              </div>
              <button onClick={() => navigate("/contact")} style={{
                flexShrink: 0, background: "#0a0a0a", color: "#FFD200",
                border: "none", padding: "15px 30px", borderRadius: 8,
                fontFamily: "inherit", fontWeight: 800, fontSize: ".85rem",
                cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
                transition: "all .25s", position: "relative",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,.3)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Contactez-nous →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
