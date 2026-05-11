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
    <div ref={ref} style={{ textAlign: "center", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all .6s ease ${delay}ms`, padding: "clamp(20px,3vw,32px) clamp(16px,2vw,24px)", borderLeft: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)", fontWeight: 900, color: "#FFD200", lineHeight: 1, letterSpacing: "-.02em" }}>{count}{suffix}</div>
      <div style={{ color: "rgba(255,255,255,.38)", fontSize: ".76rem", marginTop: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function WhyIcon({ id }) {
  const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "#FFD200", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "shield":
      return <svg {...base}><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "doc":
      return <svg {...base}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>;
    case "clock":
      return <svg {...base}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
    case "check":
      return <svg {...base}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case "chat":
      return <svg {...base}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>;
    default: return null;
  }
}

const WHY = [
  { id: "shield", title: "Agréé ESTI", desc: "Autorisation officielle de contrôle électrique en Suisse." },
  { id: "doc",    title: "Rapport officiel", desc: "Document certifié remis après chaque intervention." },
  { id: "clock",  title: "Réactivité", desc: "Intervention planifiée rapidement sur toute la Suisse romande." },
  { id: "check",  title: "Conformité garantie", desc: "Chaque contrôle respecte les normes OIBT en vigueur." },
  { id: "chat",   title: "Conseil inclus", desc: "Nous vous expliquons chaque étape clairement." },
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
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          transform: "scale(1.04)",
          transition: "transform 8s ease",
          filter: "brightness(.85)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(6,6,6,.92) 0%, rgba(6,6,6,.65) 45%, rgba(6,6,6,.12) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom, transparent, #FFD200 25%, #FFD200 75%, transparent)" }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
          transition: "opacity .9s ease, transform .9s ease",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.25)", borderRadius: 20, padding: "6px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD200", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#FFD200", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
              Organisme agréé ESTI · Suisse romande
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(3rem,8vw,6rem)", fontWeight: 900, lineHeight: .93, letterSpacing: "-.03em", marginBottom: 30, maxWidth: 760, textShadow: "0 2px 20px rgba(0,0,0,.5)" }}>
            <span style={{ display: "block", color: "#fff" }}>Contrôle</span>
            <span style={{ display: "block", color: "#FFD200" }}>électrique</span>
            <span style={{ display: "block", color: "rgba(255,255,255,.8)", fontSize: ".52em", fontWeight: 700, letterSpacing: "-.01em", marginTop: 10 }}>certifié OIBT en Suisse</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,.85)", fontSize: "clamp(1rem,2vw,1.1rem)", lineHeight: 1.8, maxWidth: 480, marginBottom: 46, textShadow: "0 1px 12px rgba(0,0,0,.5)" }}>
            Sécurité, conformité et rigueur — rapport officiel certifié à chaque intervention en Suisse romande.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/contact")} style={{
              background: "#FFD200", color: "#0a0a0a", border: "none",
              padding: "15px 34px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 800, fontSize: ".88rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
              transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(255,210,0,.38)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Devis gratuit →
            </button>
            <button onClick={() => navigate("/services")} style={{
              background: "transparent", color: "rgba(255,255,255,.8)",
              border: "1px solid rgba(255,255,255,.22)", padding: "14px 32px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 600, fontSize: ".88rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
              transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#FFD200"; e.currentTarget.style.color = "#FFD200"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.22)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; }}
            >
              Nos services
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .45, animation: "float 2.5s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, #FFD200, transparent)" }} />
          <span style={{ fontSize: ".56rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#FFD200" }}>Scroll</span>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)", padding: "clamp(12px,2vw,20px) clamp(20px,4vw,48px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }} className="stats-grid">
          <Stat val={500} suffix="+" label="Contrôles réalisés" delay={0} />
          <Stat val={100} suffix="%" label="Clients satisfaits" delay={100} />
          <Stat val={15}  suffix="+" label="Ans d'expérience" delay={200} />
        </div>
      </section>

      {/* ══ POURQUOI NOUS ══ */}
      <section style={{ padding: "clamp(72px,10vw,110px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(44px,7vw,70px)" }}>
              <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 16, padding: "4px 14px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20 }}>Pourquoi nous</div>
              <h2 style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: 1.05, marginTop: 14 }}>
                Votre partenaire<br /><span style={{ color: "#FFD200" }}>de confiance</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,2vw,14px)" }} className="why-grid">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{
                  border: "1px solid rgba(255,255,255,.06)", borderRadius: 12,
                  padding: "clamp(22px,3vw,32px) clamp(18px,2.5vw,28px)",
                  background: "rgba(255,255,255,.018)",
                  transition: "all .3s ease", cursor: "default",
                  height: "100%",
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,210,0,.3)"; e.currentTarget.style.background = "rgba(255,210,0,.025)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,.3)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.background = "rgba(255,255,255,.018)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <WhyIcon id={w.id} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: ".95rem", color: "#fff", marginBottom: 10, letterSpacing: "-.01em" }}>{w.title}</h4>
                  <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".84rem", lineHeight: 1.75 }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA band */}
          <Reveal delay={100}>
            <div style={{
              marginTop: "clamp(44px,6vw,64px)",
              background: "#FFD200", borderRadius: 14,
              padding: "clamp(28px,4vw,48px) clamp(28px,4vw,44px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: "-4%", top: "-50%", width: "35%", aspectRatio: "1", background: "rgba(0,0,0,.05)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", right: "8%", bottom: "-60%", width: "25%", aspectRatio: "1", background: "rgba(0,0,0,.04)", borderRadius: "50%" }} />
              <div style={{ position: "relative" }}>
                <h3 style={{ fontSize: "clamp(1.4rem,3vw,2.1rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-.02em", marginBottom: 8 }}>
                  Prêt à sécuriser votre installation ?
                </h3>
                <p style={{ color: "rgba(0,0,0,.5)", fontSize: ".9rem", fontWeight: 500 }}>Réponse sous 24h · Devis gratuit · Sans engagement</p>
              </div>
              <button onClick={() => navigate("/contact")} style={{
                flexShrink: 0, background: "#0a0a0a", color: "#FFD200",
                border: "none", padding: "16px 32px", borderRadius: 8,
                fontFamily: "inherit", fontWeight: 800, fontSize: ".85rem",
                cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
                transition: "all .25s", position: "relative",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,.35)"; }}
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
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .why-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 580px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
