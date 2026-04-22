import { useState, useEffect } from 'react';
import DashboardPlayer from './DashboardPlayer'
import "./style.css"

function App() {
  const [theme, setTheme] = useState('dark');
  const [currentBg, setCurrentBg] = useState(0);

  const images = [
    "/images/1984-toyota-ae86-drift-car_100577710_h.jpg",
    "/images/Drift-is-love.jpg",
    "/images/Takumi-Itsuki.jpg",
    "/images/Sudo-Kyoichi-vs-Takahashi-Ryosuke.jpg",
    "/images/86-FC-FD.jpg",
    "/images/chevette-drift.jpg",
    "/images/d1gp-noriyaro.jpg",
    "/images/hachi-roku.jpg"
  ];

  // Tema (escuro/claro)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }

  // Background (hero)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <img src="/images/tofu-fujiwara-eurobeat-radio.png" alt="logo"
            style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "5px" }} />
        </div>

        <div className="header-right">
          <nav className="nav">
            <ul>
              <li>
                <button onClick={toggleTheme} className="theme-toggle">🌓</button>
              </li>
              <li><a href="/sobre.html">Sobre</a></li>
              <li><a href="#player">Ouvir</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main>

        {/* HERO */}
        <section id="hero">
          <div className='hero-layer active'
            style={{ backgroundImage: `url(${images[currentBg]})` }} />

          <h1>Bem-vindo à Rádio Tofu de Fujiwara!</h1>
          <p>A primeira e melhor rádio de Eurobeat do Brasil!</p>
          <a href="#player" className="btn">Ouça Agora</a>
        </section>

        {/* PLAYER */}
        <section id="player">
          <h2>Ouvir agora!</h2>
          <div className="player-box">
            <DashboardPlayer />
            <p>* Aguarde alguns instantes para a transmissão carregar.</p>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre">
          <h2>Sobre</h2>
          <p>
            A Rádio Tofu de Fujiwara é feita para os amantes de carros, drift,
            cultura japonesa e trilhas sonoras nostálgicas. Uma homenagem ao AE86
            de Akina e às corridas noturnas.
          </p>
        </section>

        {/* CONTATO */}
        <section id="contato">
          <h2>Contato</h2>
          <p>
            Quer sugerir uma música ou falar sobre drift, eventos e notícias sobre automobilismo? Entre em contato com a gente no Instagram!
            <a href="https://www.instagram.com/lojadetofufujiwara">
              @lojadetofufujiwara
            </a>
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2026 Rádio Tofu de Fujiwara. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default App;