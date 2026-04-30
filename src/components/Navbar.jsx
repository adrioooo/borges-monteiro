import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const solid = scrolled || !isHome;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: solid ? "rgba(8,8,8,.97)" : "transparent",
      backdropFilter: solid ? "blur(20px)" : "none",
      borderBottom: solid ? "1px solid rgba(255,255,255,.06)" : "none",
      transition: "all .35s ease",
      padding: solid ? "14px 0" : "26px 0",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(.9rem,2vw,1.05rem)", letterSpacing: ".2em", color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
            BORGES MONTEIRO
          </div>
          <div style={{ fontSize: ".48rem", letterSpacing: ".32em", color: "#FFD200", textTransform: "uppercase", marginTop: 3 }}>
            CONTRÔLE ÉLECTRIQUE
          </div>
        </NavLink>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
          {[
            ["/", "Accueil"],
            ["/services", "Services"],
            ["/contact", "Contact"],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#FFD200" : "rgba(255,255,255,.6)",
              fontSize: ".82rem",
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              transition: "color .2s",
              borderBottom: isActive ? "2px solid #FFD200" : "2px solid transparent",
              paddingBottom: 3,
            })}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact">
            <button style={{
              background: "#FFD200", color: "#0a0a0a", border: "none",
              padding: "10px 22px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 800, fontSize: ".78rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
              transition: "all .25s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#ffe033"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(255,210,0,.3)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#FFD200"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Devis gratuit
            </button>
          </NavLink>
        </div>

        {/* Burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="burger"
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
        background: "rgba(8,8,8,.99)",
        borderTop: menuOpen ? "1px solid rgba(255,255,255,.07)" : "none",
      }}>
        <div style={{ padding: "18px clamp(20px,4vw,48px)", display: "flex", flexDirection: "column" }}>
          {[["/", "Accueil"], ["/services", "Services"], ["/contact", "Contact"]].map(([to, label]) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              textDecoration: "none",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,.05)",
              color: isActive ? "#FFD200" : "rgba(255,255,255,.7)",
              fontSize: "1rem",
            })}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact" style={{ marginTop: 16 }}>
            <button style={{
              width: "100%", background: "#FFD200", color: "#0a0a0a",
              border: "none", padding: "14px", borderRadius: 6,
              fontFamily: "inherit", fontWeight: 800, fontSize: ".85rem",
              cursor: "pointer", letterSpacing: ".07em", textTransform: "uppercase",
            }}>
              Devis gratuit →
            </button>
          </NavLink>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
