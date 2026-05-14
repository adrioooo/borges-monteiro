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

function ServiceIcon({ num }) {
  const p = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "#FFD200", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (num) {
    case "01": return <svg {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case "02": return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>;
    case "03": return <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>;
    case "04": return <svg {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    default:   return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>;
  }
}

const SERVICES = [
  {
    num: "01", title: "Contrôle périodique", tag: "Obligation légale",
    desc: "Le contrôle périodique OIBT est une obligation légale visant à garantir la sécurité des installations électriques dans le temps. Il concerne aussi bien les habitations privées que les bâtiments commerciaux ou industriels.",
    desc2: "Nous effectuons une vérification complète de votre installation afin de détecter toute anomalie ou usure pouvant représenter un danger. À l'issue du contrôle, vous recevez un rapport détaillé ainsi que les recommandations nécessaires pour une mise en conformité.",
    for: "Propriétaires · Gérances · Entreprises",
    goal: "Prévenir les risques et respecter les obligations légales",
    details: ["Vérification visuelle complète", "Tests de mesure normalisés", "Rapport OIBT officiel", "Recommandations incluses"],
  },
  {
    num: "02", title: "Contrôle final", tag: "Après travaux",
    desc: "Le contrôle final intervient à la fin de travaux électriques, avant la mise en service de l'installation. Il permet de vérifier que tous les travaux ont été réalisés conformément aux normes en vigueur.",
    desc2: "Nous contrôlons l'ensemble des éléments installés afin de garantir leur bon fonctionnement et leur sécurité. Une attestation de conformité est délivrée après validation.",
    for: "Nouvelles constructions · Rénovations",
    goal: "Assurer une mise en service conforme et sécurisée",
    details: ["Contrôle post-installation", "Validation des travaux", "Attestation de conformité", "Mise en service autorisée"],
  },
  {
    num: "03", title: "Contrôle de réception", tag: "Indépendant",
    desc: "Le contrôle de réception est réalisé indépendamment de l'installateur, afin de garantir une vérification neutre et objective de l'installation électrique.",
    desc2: "Ce contrôle est souvent exigé pour certains types de bâtiments ou installations. Il permet d'assurer que tout est conforme avant validation officielle.",
    for: "Maîtres d'ouvrage · Promoteurs",
    goal: "Garantir une conformité indépendante",
    details: ["Organisme tiers indépendant", "Rapport objectif certifié", "Sans conflit d'intérêt", "Valide pour les autorités"],
  },
  {
    num: "04", title: "Changement de propriétaire", tag: "Vente / Transfert",
    desc: "Selon l'interprétation officielle de l'ESTI, toute installation électrique soumise à un contrôle périodique de 10 ou 20 ans doit faire l'objet d'un contrôle lors d'un changement de propriétaire, lorsque le dernier contrôle remonte à plus de 5 ans.",
    desc2: "La notion de « changement de propriétaire » comprend notamment la vente d'un bien immobilier, la donation, la succession, l'avancement d'hoirie, le partage successoral et le transfert entre copropriétaires.",
    for: "Vendeurs · Acheteurs · Notaires",
    goal: "Assurer la conformité lors d'un transfert de propriété",
    details: ["Vente immobilière", "Donation", "Succession", "Avancement d'hoirie", "Partage successoral", "Transfert entre copropriétaires"],
  },
];

const PROCESS = [
  { n: "01", t: "Prise de contact",       d: "Appelez-nous ou remplissez le formulaire. Nous évaluons vos besoins et planifions l'intervention." },
  { n: "02", t: "Intervention sur site",   d: "Nos experts se déplacent chez vous et effectuent un contrôle rigoureux, complet et non-invasif." },
  { n: "03", t: "Rapport détaillé",        d: "Vous recevez un rapport officiel complet avec résultats, anomalies détectées et recommandations." },
  { n: "04", t: "Attestation",             d: "En cas de conformité, l'attestation officielle vous est remise. Sinon, nous vous guidons." },
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
      <style>{`
        .svc-card:not(.active):hover { border-color: rgba(255,210,0,.28) !important; transform: translateY(-3px); box-shadow: 0 20px 56px rgba(0,0,0,.3) !important; }
        .svc-card.active { border-color: rgba(255,210,0,.5) !important; background: rgba(255,210,0,.035) !important; box-shadow: 0 24px 64px rgba(255,210,0,.07) !important; transform: none !important; }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .process-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .process-line  { display: none !important; }
        }
        @media (max-width: 480px) { .process-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ══ HEADER ══ */}
      <section style={{
        background: "linear-gradient(180deg,#111 0%,#0a0a0a 100%)",
        padding: "clamp(56px,9vw,100px) clamp(20px,4vw,48px)",
        borderBottom: "1px solid rgba(255,255,255,.05)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom,transparent 5%,#FFD200 28%,#FFD200 72%,transparent 95%)" }} />
        <div style={{
          maxWidth: 1140, margin: "0 auto", position: "relative",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)", transition: "all .7s ease",
        }}>
          <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 20, padding: "5px 15px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20 }}>Nos prestations</div>
          <h1 style={{ fontSize: "clamp(2.8rem,7.5vw,5.5rem)", fontWeight: 900, letterSpacing: "-.035em", color: "#fff", lineHeight: .93, marginBottom: 22, marginTop: 14 }}>
            Des contrôles pour<br /><span style={{ color: "#FFD200" }}>chaque situation</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: "clamp(.9rem,1.8vw,1.05rem)", maxWidth: 500, lineHeight: 1.85 }}>
            Chaque type d'installation a ses exigences. Nos experts interviennent selon vos besoins et les normes légales suisses.
          </p>
        </div>
      </section>

      {/* ══ CARDS ══ */}
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(12px,2vw,18px)" }} className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div
                className={`svc-card${active === i ? " active" : ""}`}
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  border: "1px solid rgba(255,255,255,.07)", borderRadius: 14,
                  padding: "clamp(24px,3vw,36px)",
                  background: "rgba(255,255,255,.018)",
                  cursor: "pointer", position: "relative", overflow: "hidden",
                  transition: "border-color .3s, background .3s, transform .3s, box-shadow .3s",
                }}
              >
                {/* Tag */}
                <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,210,0,.07)", border: "1px solid rgba(255,210,0,.16)", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
                  <span style={{ color: "#FFD200", fontSize: ".63rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>{s.tag}</span>
                </div>

                {/* Icon + Title */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: "rgba(255,210,0,.07)", border: "1px solid rgba(255,210,0,.13)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ServiceIcon num={s.num} />
                  </div>
                  <h3 style={{ fontSize: "clamp(.98rem,2vw,1.12rem)", fontWeight: 800, color: "#fff", lineHeight: 1.28, marginTop: 5, letterSpacing: "-.01em" }}>{s.title}</h3>
                </div>

                <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".87rem", lineHeight: 1.82, marginBottom: 16 }}>{s.desc}</p>

                {/* Expandable */}
                <div style={{ maxHeight: active === i ? 340 : 0, overflow: "hidden", transition: "max-height .45s ease" }}>
                  <p style={{ color: "rgba(255,255,255,.35)", fontSize: ".85rem", lineHeight: 1.82, marginBottom: 16 }}>{s.desc2}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 14, marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                      {s.details.map(d => (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: ".79rem", color: "rgba(255,255,255,.42)", fontWeight: 500 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFD200", flexShrink: 0 }} />{d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); navigate("/contact"); }} style={{
                    background: "#FFD200", color: "#0a0a0a", border: "none",
                    padding: "10px 22px", borderRadius: 7,
                    fontFamily: "inherit", fontWeight: 800, fontSize: ".78rem",
                    cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
                  }}
                    onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(255,210,0,.35)"; }}
                    onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >Demander un devis →</button>
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 14, marginTop: 6 }}>
                  <div style={{ fontSize: ".73rem", color: "rgba(255,255,255,.26)", marginBottom: 10 }}>
                    <span style={{ color: "rgba(255,255,255,.42)", fontWeight: 600 }}>Pour : </span>{s.for}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: ".71rem", color: "rgba(255,255,255,.24)", fontStyle: "italic" }}>Objectif : {s.goal}</span>
                    <span style={{ fontSize: ".71rem", color: "#FFD200", fontWeight: 700 }}>{active === i ? "▲ Réduire" : "▼ Détails"}</span>
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#FFD200,transparent)", opacity: active === i ? 1 : 0, transition: "opacity .3s" }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ PROCESSUS ══ */}
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(20px,4vw,48px)", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(44px,7vw,64px)" }}>
              <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "5px 15px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20, marginBottom: 18 }}>Méthode</div>
              <h2 style={{ fontSize: "clamp(2.1rem,5vw,3.1rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: 1.06, marginTop: 14 }}>
                Comment ça <span style={{ color: "#FFD200" }}>fonctionne ?</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div className="process-line" style={{ position: "absolute", top: 27, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg, #FFD200, rgba(255,210,0,.2) 50%, #FFD200)", zIndex: 0 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(12px,2vw,20px)", position: "relative" }} className="process-grid">
              {PROCESS.map((p, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: "50%",
                      background: i === 0 ? "#FFD200" : "#0d0d0d",
                      border: i === 0 ? "none" : "1px solid rgba(255,255,255,.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 20px",
                      fontWeight: 900, fontSize: ".9rem",
                      color: i === 0 ? "#0a0a0a" : "rgba(255,255,255,.28)",
                    }}>{p.n}</div>
                    <h4 style={{ fontWeight: 800, fontSize: ".9rem", color: "#fff", marginBottom: 10, letterSpacing: "-.01em" }}>{p.t}</h4>
                    <p style={{ color: "rgba(255,255,255,.32)", fontSize: ".81rem", lineHeight: 1.78 }}>{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ══ */}
      <section style={{ padding: "clamp(56px,9vw,90px) clamp(20px,4vw,48px)", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,.05)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", padding: "5px 15px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20, marginBottom: 22 }}>Prendre contact</div>
          <h2 style={{ fontSize: "clamp(1.9rem,4.5vw,3rem)", fontWeight: 900, letterSpacing: "-.025em", color: "#fff", marginBottom: 16, marginTop: 14 }}>
            Besoin d'un contrôle ?
          </h2>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: ".93rem", maxWidth: 400, margin: "0 auto 36px", lineHeight: 1.8 }}>
            Vente, rénovation, demande des autorités — nous intervenons sur toute la Suisse romande.
          </p>
          <button onClick={() => navigate("/contact")} style={{
            background: "#FFD200", color: "#0a0a0a", border: "none",
            padding: "16px 40px", borderRadius: 7,
            fontFamily: "inherit", fontWeight: 800, fontSize: ".86rem",
            cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(255,210,0,.35)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >Demander un devis →</button>
        </Reveal>
      </section>
    </div>
  );
}
