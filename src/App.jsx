import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import logoImg from "./assets/image.png";

function Footer() {
  const location = useLocation();

  return (
    <footer style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,.05)", padding: "clamp(24px,3vw,36px) clamp(20px,4vw,48px)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <NavLink to="/">
          <img
            src={logoImg}
            alt="Borges Monteiro"
            style={{ height: 44, width: "auto", mixBlendMode: "screen", display: "block" }}
          />
        </NavLink>
        <div style={{ display: "flex", gap: 24 }}>
          {[["/","Accueil"],["/services","Services"],["/contact","Contact"]].map(([path, label]) => (
            <a key={path} href={path} style={{ color: location.pathname === path ? "#FFD200" : "rgba(255,255,255,.3)", fontSize: ".82rem", textDecoration: "none", transition: "color .2s" }}
              onMouseOver={e => e.target.style.color = "#FFD200"}
              onMouseOut={e => e.target.style.color = location.pathname === path ? "#FFD200" : "rgba(255,255,255,.3)"}
            >
              {label}
            </a>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,.2)", fontSize: ".74rem" }}>
          © 2026 Borges Monteiro · Agréé ESTI
        </div>
      </div>
    </footer>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#0a0a0a";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.background = "#0a0a0a";
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0a0a0a", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Rajdhani:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0a0a0a; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #FFD200; border-radius: 2px; }
        a { text-decoration: none; }
      `}</style>
      <ScrollTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
