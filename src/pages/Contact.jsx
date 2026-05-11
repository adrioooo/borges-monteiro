import { useEffect, useState } from "react";

const INPUT = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 9, fontFamily: "inherit", fontSize: ".9rem", color: "#fff",
  outline: "none", transition: "border-color .2s, box-shadow .2s",
};
const LABEL = {
  display: "block", fontSize: ".62rem", fontWeight: 700,
  color: "rgba(255,255,255,.32)", letterSpacing: ".11em",
  textTransform: "uppercase", marginBottom: 8,
};
const onFocus = e => { e.target.style.borderColor = "#FFD200"; e.target.style.boxShadow = "0 0 0 3px rgba(255,210,0,.1)"; };
const onBlur  = e => { e.target.style.borderColor = "rgba(255,255,255,.09)"; e.target.style.boxShadow = "none"; };

const InfoIcon = ({ id }) => {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "#FFD200", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "phone": return <svg {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
    case "mail":  return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>;
    case "pin":   return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "time":  return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    default: return null;
  }
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", property: "", message: "" });
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
    setForm({ name: "", email: "", phone: "", service: "", property: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const INFOS = [
    { ic: "phone", lb: "Téléphone",           val: "+41 78 239 23 90",        href: "tel:+41782392390" },
    { ic: "mail",  lb: "Email",                val: "info@borges-monteiro.ch", href: "mailto:info@borges-monteiro.ch" },
    { ic: "pin",   lb: "Zone d'intervention",  val: "Toute la Suisse romande" },
    { ic: "time",  lb: "Horaires",             val: "Lun – Ven · 8h00 – 18h00" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,.18); }
        select option { background: #1a1a1a; color: #fff; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr !important; } }
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
          <div style={{ display: "inline-block", color: "#FFD200", fontSize: ".67rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 20, padding: "5px 15px", border: "1px solid rgba(255,210,0,.2)", borderRadius: 20 }}>Contact</div>
          <h1 style={{ fontSize: "clamp(2.8rem,7.5vw,5.5rem)", fontWeight: 900, letterSpacing: "-.035em", color: "#fff", lineHeight: .93, marginBottom: 22, marginTop: 14 }}>
            Demandez votre<br /><span style={{ color: "#FFD200" }}>devis gratuit</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: "clamp(.9rem,1.8vw,1.05rem)", lineHeight: 1.85 }}>
            Gratuit · Sans engagement · Réponse sous 24h
          </p>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <section style={{ padding: "clamp(56px,9vw,100px) clamp(20px,4vw,48px)", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.55fr", gap: "clamp(36px,7vw,88px)", alignItems: "start" }} className="contact-grid">

          {/* ── Info ── */}
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(1.1rem,2vw,1.3rem)", color: "#fff", marginBottom: 32, letterSpacing: "-.01em" }}>Nos coordonnées</h2>
            {INFOS.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,210,0,.06)", border: "1px solid rgba(255,210,0,.13)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <InfoIcon id={c.ic} />
                </div>
                <div style={{ paddingTop: 1 }}>
                  <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.24)", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 5 }}>{c.lb}</div>
                  {c.href
                    ? <a href={c.href} style={{ color: "#fff", fontWeight: 600, fontSize: ".93rem", textDecoration: "none", transition: "color .2s" }}
                        onMouseOver={e => e.target.style.color = "#FFD200"}
                        onMouseOut={e => e.target.style.color = "#fff"}>{c.val}</a>
                    : <div style={{ color: "#fff", fontWeight: 600, fontSize: ".93rem" }}>{c.val}</div>
                  }
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {["Agréé ESTI", "Rapport officiel", "OIBT"].map(b => (
                <div key={b} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "6px 14px", fontSize: ".71rem", color: "rgba(255,255,255,.35)", fontWeight: 600 }}>{b}</div>
              ))}
            </div>
          </div>

          {/* ── Form ── */}
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "clamp(28px,4vw,48px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#FFD200" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "clamp(48px,8vw,80px) 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,210,0,.1)", border: "1px solid rgba(255,210,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.8rem" }}>✅</div>
                <h3 style={{ fontWeight: 900, fontSize: "1.5rem", color: "#fff", marginBottom: 10, letterSpacing: "-.02em" }}>Message envoyé !</h3>
                <p style={{ color: "rgba(255,255,255,.35)", fontSize: ".9rem" }}>Nous vous répondrons sous 24 heures.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={LABEL}>Nom complet *</label>
                    <input required type="text" placeholder="Jean Dupont" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={LABEL}>Email *</label>
                    <input required type="email" placeholder="jean@exemple.ch" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={LABEL}>Téléphone</label>
                    <input placeholder="+41 XX XXX XX XX" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={LABEL}>Service</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                      style={{ ...INPUT, color: form.service ? "#fff" : "rgba(255,255,255,.28)", cursor: "pointer" }}
                      onFocus={e => { e.target.style.borderColor = "#FFD200"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.09)"; }}>
                      <option value="" style={{ background: "#1a1a1a" }}>Choisir…</option>
                      {["Contrôle périodique OIBT","Contrôle final","Contrôle de réception","Conseil conformité"].map(o => (
                        <option key={o} style={{ background: "#1a1a1a" }}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={LABEL}>Type de bien immobilier</label>
                  <select value={form.property} onChange={e => setForm({ ...form, property: e.target.value })}
                    style={{ ...INPUT, color: form.property ? "#fff" : "rgba(255,255,255,.28)", cursor: "pointer" }}
                    onFocus={e => { e.target.style.borderColor = "#FFD200"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.09)"; }}>
                    <option value="" style={{ background: "#1a1a1a" }}>Choisir…</option>
                    {["Appartement","Maison individuelle","Villa","Immeuble (PPE / locatif)","Local commercial","Bâtiment industriel","Autre"].map(o => (
                      <option key={o} style={{ background: "#1a1a1a" }}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={LABEL}>Message</label>
                  <textarea rows={5} placeholder="Décrivez votre installation, la surface, votre situation…"
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...INPUT, resize: "vertical" }}
                    onFocus={onFocus} onBlur={onBlur} />
                </div>

                <button type="submit" style={{
                  width: "100%", background: "#FFD200", color: "#0a0a0a",
                  border: "none", padding: "16px", borderRadius: 9, marginTop: 4,
                  fontFamily: "inherit", fontWeight: 800, fontSize: ".86rem",
                  cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .25s",
                }}
                  onMouseOver={e => { e.currentTarget.style.background = "#ffe033"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,210,0,.3)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "#FFD200"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >Envoyer ma demande →</button>

                <p style={{ textAlign: "center", color: "rgba(255,255,255,.15)", fontSize: ".68rem", marginTop: 2 }}>
                  Données confidentielles · Réponse sous 24h · Sans engagement
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
