function toggleTheme() {
      const body = document.body;
      const isLight = body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    const BACKEND_URL = 'http://localhost:3000';

    window.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode')
        }
        
      // Imagens de fundo para crossfade
      const images = [
      'images/1984-toyota-ae86-drift-car_100577710_h.jpg',
      'images/Drift is love.jpg',
      'images/Takumi-Itsuki.jpg',
      'images/Sudo Kyoichi vs Takahashi Ryosuke - ID 1st Stage.jpg'
    ];
      
      // Configuração do crossfade
      const layer1 = document.getElementById('layer1');
      const layer2 = document.getElementById('layer2');
      let current = 0;
      let showingLayer1 = true;

      function crossfade() {
        const next = (current + 1) % images.length;
        if (showingLayer1) {
          layer2.style.backgroundImage = `url('${images[next]}')`;
          layer2.classList.add('active');
          layer1.classList.remove('active');
        } else {
          layer1.style.backgroundImage = `url('${images[next]}')`;
          layer1.classList.add('active');
          layer2.classList.remove('active');
        }
        current = next;
        showingLayer1 = !showingLayer1;
      }

      layer1.style.backgroundImage = `url('${images[0]}')`;
      layer1.classList.add('active');

      setInterval(crossfade, 8000);
    });