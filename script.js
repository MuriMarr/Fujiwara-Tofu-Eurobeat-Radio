function toggleTheme() {
      const body = document.body;
      const isLight = body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    const BACKEND_URL = 'http://localhost:3000';
    let youtubePlayer = null;

    window.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode')
        }

        const playlists = [
        { name: "Initial D - YouTube", type: "youtube", playlistId: "PLAZCk8xCc7mZbuQOpzt7xt_UpHrWkPuOm" }
      ];

      const selector = document.getElementById('playlistSelector');
      const audioPlayer = document.getElementById('audioPlayer');
      const youtubePlayerDiv = document.getElementById('youtubePlayer');

      playlists.forEach((track, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = track.name;
        selector.appendChild(option);
      });

      // Função para carregar vídeos da playlist via Backend
      async function loadYouTubePlaylistFromBackend(playlistId) {
        try {
          youtubePlayerDiv.innerHTML = '<p>⏳ Carregando playlist...</p>';

          const response = await fetch(`${BACKEND_URL}/api/playlist/${playlistId}`);
          const data = await response.json();

          if (!data.success) {
            youtubePlayerDiv.innerHTML = `<p>❌ Erro: ${data.error}</p>`;
            return;
          }

          // Criar container do player
          youtubePlayerDiv.innerHTML = `
            <div id="ytPlayerContainer" style="margin-bottom: 20px;">
              <div id="ytPlayer" style="width: 100%; max-width: 560px; margin: 0 auto;"></div>
            </div>
            <div style="background: var(--section); padding: 15px; border-radius: 6px; color: var(--text);">
              <h3 style="margin-bottom: 15px; color: var(--highlight);">📺 Vídeos da Playlist (${data.videos.length})</h3>
              <div id="videosList" style="max-height: 500px; overflow-y: auto;"></div>
            </div>
          `;

          // Inicializar player do YouTube
          youtubePlayer = new YT.Player('ytPlayer', {
            height: '360',
            width: '100%',
            videoId: data.videos[0].id,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });

          // Preencher lista de vídeos
          const videosList = document.getElementById('videosList');
          let html = '';
          data.videos.forEach((video, index) => {
            html += `
              <div style="padding: 10px; margin: 5px 0; background: #0d0d0d; border-left: 3px solid var(--highlight); border-radius: 4px; cursor: pointer; transition: background 0.3s;" 
                   onclick="playVideo('${video.id}', this)" 
                   onmouseover="this.style.background='#1a1a1a'" 
                   onmouseout="this.style.background='#0d0d0d'">
                <strong>${index + 1}. ${video.title}</strong><br>
                <small style="color: #aaa;">Clique para tocar</small>
              </div>
            `;
          });
          videosList.innerHTML = html;

        } catch (error) {
          console.error('Erro ao carregar playlist do backend:', error);
          youtubePlayerDiv.innerHTML = `<p>❌ Erro ao conectar com o backend: ${error.message}</p>`;
        }
      }

      // Função global para trocar vídeo no player
      window.playVideo = function(videoId, element) {
        if (youtubePlayer) {
          youtubePlayer.loadVideoById(videoId);
          
          // Destacar vídeo selecionado
          document.querySelectorAll('#videosList > div').forEach(div => {
            div.style.borderLeftWidth = '3px';
            div.style.borderLeftColor = 'var(--highlight)';
          });
          if (element) {
            element.style.borderLeftWidth = '5px';
            element.style.borderLeftColor = '#ffff00';
          }
        }
      };

      function onPlayerReady(event) {
        event.target.playVideo();
      }

      function onPlayerStateChange(event) {
        // Eventos do player (opcional: adicionar lógica aqui)
      }

      selector.addEventListener('change', (e) => {
        const playlistIndex = parseInt(e.target.value);
        if (playlistIndex === '') return;

        const selectedPlaylist = playlists[playlistIndex];

        if (selectedPlaylist.type === 'audio') {
          audioPlayer.style.display = 'block';
          youtubePlayerDiv.classList.remove('active');
          youtubePlayerDiv.innerHTML = '';
          
          const source = document.getElementById('audioSource');
          source.src = selectedPlaylist.url;
          audioPlayer.load();
          audioPlayer.play();
        } else if (selectedPlaylist.type === 'youtube') {
          audioPlayer.style.display = 'none';
          youtubePlayerDiv.classList.add('active');
          loadYouTubePlaylistFromBackend(selectedPlaylist.playlistId);
        }
      });

      // Imagens de fundo para crossfade
      const images = [
      './1984-toyota-ae86-drift-car_100577710_h.jpg',
      './Drift is love.jpg',
      './Takumi-Itsuki.jpg',
      './Sudo Kyoichi vs Takahashi Ryosuke - ID 1st Stage.jpg'
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