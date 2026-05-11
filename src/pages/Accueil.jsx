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

function Stat({ val, suffix, label, delay, last }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(val, inView);
  return (
    <div ref={ref} style={{
      textAlign: "center",
      padding: "clamp(28px,5vw,44px) clamp(16px,3vw,32px)",
      borderRight: last ? "none" : "1px solid rgba(255,255,255,.05)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `all .6s ease ${delay}ms`,
    }}>
      <div style={{ fontSize: "clamp(2.6rem,5.5vw,3.8rem)", fontWeight: 900, color: "#FFD200", lineHeight: 1, letterSpacing: "-.03em" }}>
        {count}<span style={{ fontSize: ".6em" }}>{suffix}</span>
      </div>
      <div style={{ color: "rgba(255,255,255,.28)", fontSize: ".7rem", marginTop: 10, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function WhyIcon({ id }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "#FFD200", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "shield": return <svg {...p}><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "doc":    return <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>;
    case "clock":  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
    case "check":  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case "chat":   return <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>;
    default: return null;
  }
}

const WHY = [
  { id: "shield", title: "Agréé ESTI",         desc: "Autorisation officielle de contrôle électrique en Suisse." },
  { id: "doc",    title: "Rapport officiel",    desc: "Document certifié remis après chaque intervention." },
  { id: "clock",  title: "Réactivité",          desc: "Planifié rapidement sur toute la Suisse romande." },
  { id: "check",  title: "Conformité garantie", desc: "Chaque contrôle respecte les normes OIBT en vigueur." },
  { id: "chat",   title: "Conseil inclus",      desc: "Nous vous expliquons chaque étape clairement." },
];

export default function Accueil() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }
        .why-card:hover { border-color: rgba(255,210,0,.35) !important; background: rgba(255,210,0,.03) !important; transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,.35) !important; }
        @media (max-width: 860px) {
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .why-grid   { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .why-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", height: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover", backgroundPosition: "center 40%",
          filter: "brightness(.82)", transform: "scale(1.03)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(6,6,6,.94) 0%, rgba(6,6,6,.68) 44%, rgba(6,6,6,.1) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "32%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom, transparent 5%, #FFD200 28%, #FFD200 72%, transparent 95%)" }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(28px)",
          transition: "opacity .95s ease, transform .95s ease",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 34, background: "rgba(255,210,0,.07)", border: "1px solid rgba(255,210,0,.22)", borderRadius: 20, padding: "6px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD200", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase" }}>Organisme agréé ESTI · Suisse romande</span>
          </div>

          <h1 style={{ fontSize: "clamp(3rem,8vw,6.2rem)", fontWeight: 900, lineHeight: .92, letterSpacing: "-.035em", marginBottom: 30, maxWidth: 740 }}>
            <span style={{ display: "block", color: "#fff" }}>Contrôle</span>
            <span style={{ display: "block", color: "#FFD200" }}>électrique</span>
            <span style={{ display: "block", color: "rgba(255,255,255,.72)", fontSize: ".52em", fontWeight: 700, letterSpacing: "-.01em", marginTop: 10 }}>certifié OIBT en Suisse</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,.78)", fontSize: "clamp(.95rem,1.8vw,1.05rem)", lineHeight: 1.85, maxWidth: 460, marginBottom: 46 }}>
            Sécurité, conformité et rigueur — rapport officiel certifié à chaque intervention en Suisse romande.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/contact")} style={{
              background: "#FFD200", color: "#0a0a0a", border: "none",
              padding: "15px 36px", borderRadius: 7,
              fontFamily: "inherit", fontWeight: 800, fontSize: ".86rem",
              cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 42px rgba(255,210,0,.38)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >Devis gratuit →</button>
            <button onClick={() => navigate("/services")} style={{
              background: "transparent", color: "rgba(255,255,255,.75)",
              border: "1px solid rgba(255,255,255,.2)", padding: "14px 32px", borderRadius: 7,
              fontFamily: "inherit", fontWeight: 600, fontSize: ".86rem",
              cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,210,0,.5)"; e.currentTarget.style.color = "#FFD200"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"; e.currentTarget.style.color = "rgba(255,255,255,.75)"; }}
            >Nos services</button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .35, animation: "float 3s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, #FFD200, transparent)" }} />
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent 5%, #FFD200 35%, #FFD200 65%, transparent 95%)" }} />
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }} className="stats-grid">
          <Stat val={500} suffix="+" label="Contrôles réalisés" delay={0} />
          <Stat val={100} suffix="%" label="Clients satisfaits"  delay={120} />
          <Stat val={15}  suffix="+" label="Ans d'expérience"    delay={240} last />
        </div>
      </section>

      {/* ══ POURQUOI NOUS ══ */}
      <section style={{ padding: "clamp(72px,10vw,120px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(44px,7vw,68px)" }}>
              <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "5px 16px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20, marginBottom: 18 }}>Pourquoi nous</div>
              <h2 style={{ fontSize: "clamp(2.1rem,5vw,3.1rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: 1.06 }}>
                Votre partenaire<br /><span style={{ color: "#FFD200" }}>de confiance</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,1.8vw,14px)" }} className="why-grid">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 65}>
                <div className="why-card" style={{
                  border: "1px solid rgba(255,255,255,.06)", borderRadius: 12,
                  padding: "clamp(24px,3vw,32px)",
                  background: "rgba(255,255,255,.018)",
                  transition: "border-color .3s, background .3s, transform .3s, box-shadow .3s",
                  cursor: "default", height: "100%",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <WhyIcon id={w.id} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: ".95rem", color: "#fff", marginBottom: 9, letterSpacing: "-.01em" }}>{w.title}</h4>
                  <p style={{ color: "rgba(255,255,255,.32)", fontSize: ".84rem", lineHeight: 1.8 }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div style={{
              marginTop: "clamp(48px,7vw,80px)",
              background: "#FFD200", borderRadius: 14,
              padding: "clamp(32px,4.5vw,52px) clamp(28px,4vw,48px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: "-3%", top: "-55%", width: "30%", aspectRatio: "1", background: "rgba(0,0,0,.05)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", right: "9%", bottom: "-65%", width: "20%", aspectRatio: "1", background: "rgba(0,0,0,.04)", borderRadius: "50%" }} />
              <div style={{ position: "relative" }}>
                <h3 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-.025em", marginBottom: 8 }}>Prêt à sécuriser votre installation ?</h3>
                <p style={{ color: "rgba(0,0,0,.45)", fontSize: ".88rem", fontWeight: 500 }}>Devis gratuit · Réponse sous 24h · Sans engagement</p>
              </div>
              <button onClick={() => navigate("/contact")} style={{
                flexShrink: 0, background: "#0a0a0a", color: "#FFD200", border: "none",
                padding: "16px 32px", borderRadius: 9,
                fontFamily: "inherit", fontWeight: 800, fontSize: ".83rem",
                cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.35)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >Contactez-nous →</button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
