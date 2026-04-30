import { useEffect, useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const INFOS = [
    { ic: "📞", lb: "Téléphone", val: "+41 XX XXX XX XX", href: "tel:+41XXXXXXXXXX" },
    { ic: "✉️", lb: "Email", val: "info@borges-monteiro.ch", href: "mailto:info@borges-monteiro.ch" },
    { ic: "📍", lb: "Zone d'intervention", val: "Toute la Suisse romande" },
    { ic: "🕐", lb: "Horaires", val: "Lun – Ven · 8h00 – 18h00" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>

      {/* ══ HEADER ══ */}
      <section style={{
        background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
        padding: "clamp(48px,8vw,90px) clamp(20px,4vw,48px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom, transparent, #FFD200 30%, #FFD200 70%, transparent)" }} />

        <div style={{
          maxWidth: 1140, margin: "0 auto", position: "relative",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)",
          transition: "all .7s ease",
        }}>
          <div style={{ color: "#FFD200", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
          <h1 style={{ fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#fff", lineHeight: .95, marginBottom: 20 }}>
            Demandez votre<br /><span style={{ color: "#FFD200" }}>devis gratuit</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "clamp(.9rem,1.8vw,1.05rem)", lineHeight: 1.8 }}>
            Gratuit · Sans engagement · Réponse sous 24h
          </p>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <section style={{ padding: "clamp(48px,8vw,90px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "clamp(32px,6vw,72px)", alignItems: "start" }} className="contact-grid">

          {/* Info */}
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(1.1rem,2vw,1.3rem)", color: "#fff", marginBottom: 28, letterSpacing: "-.01em" }}>Nos coordonnées</h2>
            {INFOS.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,210,0,.07)", border: "1px solid rgba(255,210,0,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                  {c.ic}
                </div>
                <div>
                  <div style={{ fontSize: ".63rem", color: "rgba(255,255,255,.28)", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{c.lb}</div>
                  {c.href
                    ? <a href={c.href} style={{ color: "#fff", fontWeight: 600, fontSize: ".95rem", textDecoration: "none", transition: "color .2s" }}
                        onMouseOver={e => e.target.style.color = "#FFD200"}
                        onMouseOut={e => e.target.style.color = "#fff"}>{c.val}</a>
                    : <div style={{ color: "#fff", fontWeight: 600, fontSize: ".95rem" }}>{c.val}</div>
                  }
                </div>
              </div>
            ))}

            {/* Urgence box */}
            <div style={{ background: "rgba(255,210,0,.06)", border: "1px solid rgba(255,210,0,.22)", borderRadius: 10, padding: "20px 18px", marginTop: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#FFD200", borderRadius: "3px 0 0 3px" }} />
              <div style={{ paddingLeft: 8 }}>
                <div style={{ fontWeight: 800, color: "#FFD200", marginBottom: 6, fontSize: ".9rem" }}>Urgence ?</div>
                <div style={{ color: "rgba(255,255,255,.45)", fontSize: ".83rem", lineHeight: 1.65 }}>
                  Intervention prioritaire disponible. Appelez-nous directement pour vente, sinistre ou demande des autorités.
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              {["Agréé ESTI", "Rapport officiel", "OIBT"].map(b => (
                <div key={b} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: "6px 14px", fontSize: ".72rem", color: "rgba(255,255,255,.45)", fontWeight: 600 }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "clamp(24px,4vw,44px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#FFD200" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "clamp(48px,8vw,80px) 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>✅</div>
                <h3 style={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", marginBottom: 10 }}>Message envoyé !</h3>
                <p style={{ color: "rgba(255,255,255,.4)" }}>Nous vous répondrons sous 24 heures.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {[
                    { lb: "Nom complet *", ph: "Jean Dupont", type: "text", f: "name" },
                    { lb: "Email *", ph: "jean@exemple.ch", type: "email", f: "email" },
                  ].map(x => (
                    <div key={x.f}>
                      <label style={{ display: "block", fontSize: ".63rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>{x.lb}</label>
                      <input required type={x.type} placeholder={x.ph} value={form[x.f]}
                        onChange={e => setForm({ ...form, [x.f]: e.target.value })}
                        style={{ width: "100%", padding: "13px 15px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontFamily: "inherit", fontSize: ".9rem", color: "#fff", outline: "none", transition: "border-color .2s, box-shadow .2s" }}
                        onFocus={e => { e.target.style.borderColor = "#FFD200"; e.target.style.boxShadow = "0 0 0 3px rgba(255,210,0,.12)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>

                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: ".63rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Téléphone</label>
                    <input placeholder="+41 XX XXX XX XX" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ width: "100%", padding: "13px 15px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontFamily: "inherit", fontSize: ".9rem", color: "#fff", outline: "none", transition: "border-color .2s, box-shadow .2s" }}
                      onFocus={e => { e.target.style.borderColor = "#FFD200"; e.target.style.boxShadow = "0 0 0 3px rgba(255,210,0,.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: ".63rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Service</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                      style={{ width: "100%", padding: "13px 15px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontFamily: "inherit", fontSize: ".9rem", color: form.service ? "#fff" : "rgba(255,255,255,.3)", outline: "none", cursor: "pointer", transition: "border-color .2s" }}
                      onFocus={e => { e.target.style.borderColor = "#FFD200"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; }}
                    >
                      <option value="" style={{ background: "#1a1a1a" }}>Choisir…</option>
                      {["Contrôle périodique OIBT", "Contrôle final", "Contrôle de réception", "Conseil conformité", "Contrôle urgent"].map(o => (
                        <option key={o} style={{ background: "#1a1a1a" }}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: "block", fontSize: ".63rem", fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Message</label>
                  <textarea rows={5} placeholder="Décrivez votre installation, la surface, votre situation…"
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: "100%", padding: "13px 15px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontFamily: "inherit", fontSize: ".9rem", color: "#fff", outline: "none", resize: "vertical", transition: "border-color .2s, box-shadow .2s" }}
                    onFocus={e => { e.target.style.borderColor = "#FFD200"; e.target.style.boxShadow = "0 0 0 3px rgba(255,210,0,.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <button type="submit" style={{
                  width: "100%", background: "#FFD200", color: "#0a0a0a",
                  border: "none", padding: "16px", borderRadius: 8,
                  fontFamily: "inherit", fontWeight: 800, fontSize: ".88rem",
                  cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
                  transition: "all .25s",
                }}
                  onMouseOver={e => { e.currentTarget.style.background = "#ffe033"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,210,0,.3)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "#FFD200"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Envoyer ma demande →
                </button>
                <p style={{ textAlign: "center", color: "rgba(255,255,255,.18)", fontSize: ".7rem", marginTop: 14 }}>
                  Données confidentielles · Réponse sous 24h · Sans engagement
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,.22); }
      `}</style>
    </div>
  );
}
