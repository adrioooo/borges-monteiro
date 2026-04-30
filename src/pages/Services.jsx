import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useInView(threshold = 0.12) {
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const SERVICES = [
  {
    num: "01", icon: "⚡",
    title: "Contrôle périodique OIBT",
    tag: "Obligation légale",
    desc: "Vérification complète de votre installation électrique pour détecter anomalies, usures et non-conformités. Rapport officiel détaillé inclus.",
    for: "Propriétaires · Gérances · Entreprises",
    goal: "Prévenir les risques et respecter les obligations légales",
    details: ["Vérification visuelle complète", "Tests de mesure normalisés", "Rapport OIBT officiel", "Recommandations incluses"],
  },
  {
    num: "02", icon: "🏗️",
    title: "Contrôle final",
    tag: "Après travaux",
    desc: "Vérifie que vos travaux sont conformes aux normes OIBT avant mise en service. Attestation officielle délivrée sur place.",
    for: "Constructions · Rénovations",
    goal: "Assurer une mise en service conforme et sécurisée",
    details: ["Contrôle post-installation", "Validation des travaux", "Attestation de conformité", "Mise en service autorisée"],
  },
  {
    num: "03", icon: "🧾",
    title: "Contrôle de réception",
    tag: "Indépendant",
    desc: "Contrôle neutre et objectif de l'installation, indépendant de l'installateur. Validité officielle garantie.",
    for: "Maîtres d'ouvrage · Promoteurs",
    goal: "Garantir une conformité indépendante",
    details: ["Organisme tiers indépendant", "Rapport objectif certifié", "Sans conflit d'intérêt", "Valide pour les autorités"],
  },
  {
    num: "04", icon: "🔧",
    title: "Conseil conformité",
    tag: "Sur mesure",
    desc: "Solutions claires et adaptées pour corriger les défauts. Nos experts vous guident vers les meilleures options de mise en conformité.",
    for: "Installations non conformes",
    goal: "Sécuriser et régulariser votre installation",
    details: ["Analyse des défauts", "Plan de correction", "Priorisation des travaux", "Suivi jusqu'à conformité"],
  },
];

const PROCESS = [
  { n: "01", t: "Prise de contact", d: "Appelez-nous ou remplissez le formulaire. Nous évaluons vos besoins et planifions l'intervention rapidement." },
  { n: "02", t: "Intervention sur site", d: "Nos experts se déplacent chez vous et effectuent un contrôle rigoureux, complet et non-invasif." },
  { n: "03", t: "Rapport détaillé", d: "Vous recevez un rapport officiel complet avec résultats, anomalies détectées et recommandations." },
  { n: "04", t: "Attestation de conformité", d: "En cas de conformité, l'attestation officielle vous est remise. Sinon, nous vous guidons vers la mise en conformité." },
];

export default function Services() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>

      {/* ══ HEADER ══ */}
      <section style={{
        background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
        padding: "clamp(48px,8vw,90px) clamp(20px,4vw,48px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom, transparent, #FFD200 30%, #FFD200 70%, transparent)" }} />

        <div style={{
          maxWidth: 1140, margin: "0 auto", position: "relative",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)",
          transition: "all .7s ease",
        }}>
          <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16 }}>Nos prestations</div>
          <h1 style={{ fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: .95, marginBottom: 20 }}>
            Des contrôles pour<br /><span style={{ color: "#FFD200" }}>chaque situation</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "clamp(.9rem,1.8vw,1.05rem)", maxWidth: 540, lineHeight: 1.8 }}>
            Chaque type d'installation a ses exigences. Nos experts interviennent selon vos besoins et les normes légales suisses.
          </p>
        </div>
      </section>

      {/* ══ CARDS ══ */}
      <section style={{ padding: "clamp(48px,8vw,90px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(14px,2vw,20px)" }} className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 90}>
              <div
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  border: `1px solid ${active === i ? "rgba(255,210,0,.5)" : "rgba(255,255,255,.07)"}`,
                  borderRadius: 12, padding: "clamp(24px,3vw,36px)",
                  background: active === i ? "rgba(255,210,0,.04)" : "rgba(255,255,255,.02)",
                  cursor: "pointer", position: "relative", overflow: "hidden",
                  transition: "all .3s ease",
                  boxShadow: active === i ? "0 20px 60px rgba(255,210,0,.08)" : "none",
                }}
                onMouseOver={e => { if (active !== i) { e.currentTarget.style.borderColor = "rgba(255,210,0,.25)"; e.currentTarget.style.transform = "translateY(-3px)"; } }}
                onMouseOut={e => { if (active !== i) { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = "none"; } }}
              >
                {/* Number */}
                <div style={{ position: "absolute", top: 16, right: 20, fontWeight: 900, fontSize: "5rem", color: "rgba(255,255,255,.03)", lineHeight: 1, userSelect: "none" }}>{s.num}</div>

                {/* Tag */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20, padding: "4px 12px", marginBottom: 18 }}>
                  <span style={{ color: "#FFD200", fontSize: ".66rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.tag}</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: "1.8rem" }}>{s.icon}</span>
                  <h3 style={{ fontSize: "clamp(.95rem,2vw,1.1rem)", fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>{s.title}</h3>
                </div>

                <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".87rem", lineHeight: 1.75, marginBottom: 18 }}>{s.desc}</p>

                {/* Expandable details */}
                <div style={{ maxHeight: active === i ? 200 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 16, marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {s.details.map(d => (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".8rem", color: "rgba(255,255,255,.5)" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFD200", flexShrink: 0 }} />{d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 14 }}>
                  <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.3)" }}>
                    <span style={{ color: "rgba(255,255,255,.5)", fontWeight: 600 }}>Pour : </span>{s.for}
                  </div>
                  <div style={{ fontSize: ".72rem", color: "#FFD200", marginTop: 10, fontWeight: 600 }}>
                    {active === i ? "▲ Réduire" : "▼ En savoir plus"}
                  </div>
                </div>

                {/* Bottom glow */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #FFD200, transparent)", opacity: active === i ? 1 : 0, transition: "opacity .3s" }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ PROCESSUS ══ */}
      <section style={{ padding: "clamp(48px,8vw,90px) clamp(20px,4vw,48px)", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(36px,6vw,56px)" }}>
              <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Méthode</div>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: 1.05 }}>
                Comment ça <span style={{ color: "#FFD200" }}>fonctionne ?</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(12px,2vw,20px)", position: "relative" }} className="process-grid">
            {/* Connector line */}
            <div style={{ position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg, #FFD200, rgba(255,210,0,.2), rgba(255,210,0,.2), #FFD200)", zIndex: 0, display: "none" }} className="connector" />

            {PROCESS.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: i === 0 ? "#FFD200" : "rgba(255,255,255,.04)",
                    border: i === 0 ? "none" : "1px solid rgba(255,255,255,.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 18px",
                    fontWeight: 900, fontSize: "1rem",
                    color: i === 0 ? "#0a0a0a" : "rgba(255,255,255,.35)",
                  }}>
                    {p.n}
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: ".92rem", color: "#fff", marginBottom: 10 }}>{p.t}</h4>
                  <p style={{ color: "rgba(255,255,255,.38)", fontSize: ".82rem", lineHeight: 1.7 }}>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ══ */}
      <section style={{ padding: "clamp(48px,8vw,80px) clamp(20px,4vw,48px)", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,.05)", textAlign: "center" }}>
        <Reveal>
          <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Urgence ?</div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-.02em", color: "#fff", marginBottom: 16 }}>
            Besoin d'un contrôle rapide ?
          </h2>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".95rem", marginBottom: 32 }}>
            Vente, sinistre ou demande des autorités — traitement prioritaire et rapport express.
          </p>
          <button onClick={() => navigate("/contact")} style={{
            background: "#FFD200", color: "#0a0a0a", border: "none",
            padding: "15px 36px", borderRadius: 6,
            fontFamily: "inherit", fontWeight: 800, fontSize: ".88rem",
            cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase", transition: "all .25s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(255,210,0,.35)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Demander un devis →
          </button>
        </Reveal>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
