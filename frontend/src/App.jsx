import { useState, useEffect } from 'react';
import DashboardPlayer from './DashboardPlayer'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'
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
  <Header />;
  
  <Hero />;
  
  <Footer />;
};

export default App;