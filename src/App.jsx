import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const SERVICES = [
  {
    id: 1, num: "01",
    title: "Contrôle périodique OIBT",
    tag: "Obligation légale",
    desc: "Vérification complète de votre installation pour détecter anomalies et usures. Rapport détaillé inclus.",
    for: "Propriétaires · Gérances · Entreprises",
  },
  {
    id: 2, num: "02",
    title: "Contrôle final",
    tag: "Après travaux",
    desc: "Vérifie que vos travaux sont conformes aux normes avant mise en service. Attestation officielle délivrée.",
    for: "Constructions · Rénovations",
  },
  {
    id: 3, num: "03",
    title: "Contrôle de réception",
    tag: "Indépendant",
    desc: "Contrôle neutre et objectif de l'installation, indépendant de l'installateur. Validité officielle garantie.",
    for: "Maîtres d'ouvrage · Promoteurs",
  },
  {
    id: 4, num: "04",
    title: "Conseil conformité",
    tag: "Sur mesure",
    desc: "Solutions claires et adaptées pour corriger les défauts. Nous vous guidons vers les meilleures options.",
    for: "Installations non conformes",
  },
];

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
    }}>
      {children}
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

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#0a0a0a";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.background = "#0a0a0a";
    document.documentElement.style.overflowX = "hidden";
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const scrolled = scrollY > 60;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0a0a0a", color: "#fff", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0a0a0a; overflow-x: hidden; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #FFD200; border-radius: 2px; }

        .nav-link {
          cursor: pointer;
          color: rgba(255,255,255,.6);
          font-size: .85rem;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          transition: color .2s;
          background: none;
          border: none;
          padding: 0;
        }
        .nav-link:hover { color: #FFD200; }

        .btn-yellow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFD200;
          color: #0a0a0a;
          border: none;
          padding: 13px 28px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: .82rem;
          cursor: pointer;
          letter-spacing: .07em;
          text-transform: uppercase;
          transition: all .25s;
        }
        .btn-yellow:hover {
          background: #ffe033;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,210,0,.3);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: rgba(255,255,255,.7);
          border: 1px solid rgba(255,255,255,.2);
          padding: 12px 28px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: .82rem;
          cursor: pointer;
          letter-spacing: .07em;
          text-transform: uppercase;
          transition: all .25s;
        }
        .btn-outline:hover {
          border-color: #FFD200;
          color: #FFD200;
        }

        .inp {
          width: 100%;
          padding: 13px 15px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem;
          color: #fff;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .inp::placeholder { color: rgba(255,255,255,.22); }
        .inp:focus {
          border-color: #FFD200;
          box-shadow: 0 0 0 3px rgba(255,210,0,.12);
        }
        .inp option { background: #1a1a1a; color: #fff; }

        .service-card {
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 10px;
          padding: 32px 28px;
          background: rgba(255,255,255,.02);
          transition: all .3s ease;
          position: relative;
          overflow: hidden;
        }
        .service-card:hover {
          border-color: rgba(255,210,0,.4);
          background: rgba(255,210,0,.03);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(255,210,0,.08);
        }
        .service-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFD200, transparent);
          opacity: 0;
          transition: opacity .3s;
        }
        .service-card:hover::after { opacity: 1; }

        @keyframes pulse {
          0%,100% { opacity: .8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .burger { display: flex !important; }
          .hero-title { font-size: clamp(3rem, 12vw, 5rem) !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { flex-direction: column !important; }
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(10,10,10,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.05)" : "none",
        transition: "all .35s ease",
        padding: scrolled ? "14px 0" : "24px 0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div onClick={() => go("accueil")} style={{ cursor: "pointer" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(.95rem,2vw,1.1rem)", letterSpacing: ".18em", color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
              BORGES MONTEIRO
            </div>
            <div style={{ fontSize: ".5rem", letterSpacing: ".3em", color: "#FFD200", textTransform: "uppercase", marginTop: 3 }}>
              CONTRÔLE ÉLECTRIQUE
            </div>
          </div>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["accueil","Accueil"],["services","Services"],["contact","Contact"]].map(([id, label]) => (
              <button key={id} className="nav-link" onClick={() => go(id)}>{label}</button>
            ))}
            <button className="btn-yellow" onClick={() => go("contact")} style={{ padding: "10px 22px", fontSize: ".78rem" }}>
              Devis gratuit
            </button>
          </div>

          {/* Burger */}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <span style={{ display: "block", width: 24, height: 2, background: menuOpen ? "#FFD200" : "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 24, height: 2, background: menuOpen ? "#FFD200" : "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          maxHeight: menuOpen ? 300 : 0, overflow: "hidden",
          transition: "max-height .35s ease",
          background: "rgba(10,10,10,.98)",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,.06)" : "none",
        }}>
          <div style={{ padding: "20px clamp(20px,4vw,40px)", display: "flex", flexDirection: "column", gap: 2 }}>
            {[["accueil","Accueil"],["services","Services"],["contact","Contact"]].map(([id, label]) => (
              <span key={id} onClick={() => go(id)} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "rgba(255,255,255,.7)", fontSize: "1rem", cursor: "pointer" }}>{label}</span>
            ))}
            <button className="btn-yellow" onClick={() => go("contact")} style={{ marginTop: 16, justifyContent: "center" }}>
              Devis gratuit →
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="accueil" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(100px,15vw,140px) clamp(20px,4vw,40px) clamp(60px,8vw,80px)", position: "relative", overflow: "hidden" }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        {/* Yellow glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "40vw", maxWidth: 700, background: "radial-gradient(ellipse, rgba(255,210,0,.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, #0a0a0a, transparent)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.25)", borderRadius: 20, padding: "6px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD200", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
            <span style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
              Organisme agréé ESTI · Suisse romande
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title" style={{ fontSize: "clamp(3.5rem, 9vw, 6rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-.02em", marginBottom: 28, color: "#fff" }}>
            Contrôle électrique<br />
            <span style={{ color: "#FFD200" }}>certifié OIBT</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,.5)", fontSize: "clamp(1rem,2vw,1.1rem)", lineHeight: 1.75, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Sécurité, conformité et rigueur — avec rapport officiel certifié à chaque intervention en Suisse romande.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-yellow" onClick={() => go("contact")}>
              Devis gratuit →
            </button>
            <button className="btn-outline" onClick={() => go("services")}>
              Nos services
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", gap: "clamp(20px,4vw,48px)", justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {[["⚡","OIBT"],["🛡️","Agréé ESTI"],["📋","Rapport officiel"],["48h","Délai intervention"]].map(([ic, lb]) => (
              <div key={lb} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.35)", fontSize: ".82rem" }}>
                <span style={{ fontSize: "1rem" }}>{ic}</span>
                <span>{lb}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .35 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #FFD200, transparent)" }} />
          <span style={{ fontSize: ".6rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#FFD200" }}>Scroll</span>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services" style={{ padding: "clamp(64px,10vw,110px) clamp(20px,4vw,40px)", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
              <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Nos prestations</div>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
                Des contrôles pour<br />chaque situation
              </h2>
              <div style={{ width: 48, height: 3, background: "#FFD200", borderRadius: 2 }} />
            </div>
          </Reveal>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(12px,2vw,18px)" }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <div className="service-card">
                  {/* Number watermark */}
                  <div style={{ position: "absolute", top: 16, right: 20, fontWeight: 900, fontSize: "4.5rem", color: "rgba(255,255,255,.03)", lineHeight: 1, userSelect: "none" }}>
                    {s.num}
                  </div>
                  {/* Tag */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.25)", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
                    <span style={{ color: "#FFD200", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.tag}</span>
                  </div>
                  <h3 style={{ fontSize: "clamp(1rem,2vw,1.15rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".87rem", lineHeight: 1.75, marginBottom: 18 }}>{s.desc}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 14, fontSize: ".75rem", color: "rgba(255,255,255,.3)" }}>
                    <span style={{ color: "rgba(255,255,255,.5)", fontWeight: 600 }}>Pour : </span>{s.for}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA band */}
          <Reveal delay={150}>
            <div style={{
              marginTop: "clamp(20px,3vw,28px)",
              background: "rgba(255,210,0,.06)",
              border: "1px solid rgba(255,210,0,.2)",
              borderRadius: 10,
              padding: "clamp(24px,4vw,36px) clamp(20px,4vw,36px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "clamp(1rem,2.5vw,1.3rem)", color: "#fff", marginBottom: 6 }}>Besoin d'un contrôle en urgence ?</div>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem" }}>Vente, sinistre ou demande des autorités — traitement prioritaire et rapport express.</p>
              </div>
              <button className="btn-yellow" onClick={() => go("contact")} style={{ flexShrink: 0 }}>
                Nous contacter →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" style={{ padding: "clamp(64px,10vw,110px) clamp(20px,4vw,40px)", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
              <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Contact</div>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
                Demandez votre devis
              </h2>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".9rem" }}>Gratuit · Sans engagement · Réponse sous 24h</p>
              <div style={{ width: 48, height: 3, background: "#FFD200", borderRadius: 2, marginTop: 16 }} />
            </div>
          </Reveal>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "clamp(32px,6vw,64px)", alignItems: "start" }}>
            {/* Info */}
            <Reveal>
              <div>
                {[
                  { ic: "📞", lb: "Téléphone", val: "+41 XX XXX XX XX", href: "tel:+41XXXXXXXXXX" },
                  { ic: "✉️", lb: "Email", val: "info@borges-monteiro.ch", href: "mailto:info@borges-monteiro.ch" },
                  { ic: "📍", lb: "Zone", val: "Toute la Suisse romande" },
                  { ic: "🕐", lb: "Horaires", val: "Lun–Ven · 8h00–18h00" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 22, paddingBottom: 22, borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, background: "rgba(255,210,0,.08)", border: "1px solid rgba(255,210,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem", flexShrink: 0 }}>
                      {c.ic}
                    </div>
                    <div>
                      <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{c.lb}</div>
                      {c.href
                        ? <a href={c.href} style={{ color: "#fff", fontWeight: 600, fontSize: ".92rem", textDecoration: "none", transition: "color .2s" }}
                            onMouseOver={e => e.target.style.color = "#FFD200"}
                            onMouseOut={e => e.target.style.color = "#fff"}>{c.val}</a>
                        : <div style={{ color: "#fff", fontWeight: 600, fontSize: ".92rem" }}>{c.val}</div>
                      }
                    </div>
                  </div>
                ))}

                <div style={{ background: "rgba(255,210,0,.06)", border: "1px solid rgba(255,210,0,.2)", borderRadius: 10, padding: "18px 16px" }}>
                  <div style={{ fontWeight: 800, color: "#FFD200", marginBottom: 6, fontSize: ".9rem" }}>Urgence ?</div>
                  <div style={{ color: "rgba(255,255,255,.4)", fontSize: ".82rem", lineHeight: 1.65 }}>Intervention prioritaire disponible. Appelez-nous directement.</div>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={120}>
              <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "clamp(24px,4vw,40px)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#FFD200", borderRadius: "12px 12px 0 0" }} />

                {sent ? (
                  <div style={{ textAlign: "center", padding: "clamp(40px,8vw,70px) 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 18 }}>✅</div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>Message envoyé !</h3>
                    <p style={{ color: "rgba(255,255,255,.4)" }}>Nous vous répondrons sous 24 heures.</p>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      {[
                        { lb: "Nom complet *", ph: "Jean Dupont", type: "text", f: "name" },
                        { lb: "Email *", ph: "jean@exemple.ch", type: "email", f: "email" },
                      ].map(x => (
                        <div key={x.f}>
                          <label style={{ display: "block", fontSize: ".65rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{x.lb}</label>
                          <input className="inp" type={x.type} required placeholder={x.ph} value={form[x.f]} onChange={e => setForm({ ...form, [x.f]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: ".65rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Téléphone</label>
                        <input className="inp" placeholder="+41 XX XXX XX XX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: ".65rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Service</label>
                        <select className="inp" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ cursor: "pointer" }}>
                          <option value="">Choisir…</option>
                          <option>Contrôle périodique OIBT</option>
                          <option>Contrôle final</option>
                          <option>Contrôle de réception</option>
                          <option>Conseil conformité</option>
                          <option>Contrôle urgent</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: ".65rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Message</label>
                      <textarea className="inp" rows={4} placeholder="Décrivez votre installation, la surface, votre situation…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="btn-yellow" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: ".85rem" }}>
                      Envoyer ma demande →
                    </button>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,.2)", fontSize: ".7rem", marginTop: 12 }}>
                      Données confidentielles · Réponse sous 24h · Sans engagement
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,.05)", padding: "clamp(28px,4vw,40px) clamp(20px,4vw,40px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }} className="footer-grid">
          <div>
            <div style={{ fontWeight: 800, fontSize: ".95rem", letterSpacing: ".18em", color: "#fff", textTransform: "uppercase" }}>BORGES MONTEIRO</div>
            <div style={{ fontSize: ".5rem", letterSpacing: ".3em", color: "#FFD200", textTransform: "uppercase", marginTop: 3 }}>CONTRÔLE ÉLECTRIQUE</div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[["accueil","Accueil"],["services","Services"],["contact","Contact"]].map(([id, label]) => (
              <span key={id} onClick={() => go(id)} style={{ color: "rgba(255,255,255,.3)", fontSize: ".82rem", cursor: "pointer", transition: "color .2s" }}
                onMouseOver={e => e.target.style.color = "#FFD200"}
                onMouseOut={e => e.target.style.color = "rgba(255,255,255,.3)"}
              >{label}</span>
            ))}
          </div>
          <div style={{ color: "rgba(255,255,255,.2)", fontSize: ".76rem" }}>
            © 2026 Borges Monteiro · Agréé ESTI
          </div>
        </div>
      </footer>
    </div>
  );
}
