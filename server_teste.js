const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://www.googleapis.com https://www.youtube.com http://localhost:* localhost:*; frame-src https://www.youtube.com; font-src https://fonts.gstatic.com;"
  );
  next();
});

app.use(express.static('.')); // Serve arquivos estáticos

// Servir dream_init.html na raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dream_init.html');
});

// Variáveis de configuração
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Validar se a chave de API foi configurada
if (!YOUTUBE_API_KEY) {
  console.error('❌ Erro: YOUTUBE_API_KEY não configurada. Por favor, adicione ao arquivo .env');
  process.exit(1);
}

// Cache simples para evitar requisições repetidas
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

/**
 * Função para limpar cache expirado
 */
function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Endpoint para obter vídeos de uma playlist do YouTube
 * GET /api/playlist/:playlistId
 */
app.get('/api/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const maxResults = req.query.maxResults || 50;

    // Verificar cache
    const cachedData = getCached(playlistId);
    if (cachedData) {
      return res.json({
        success: true,
        cached: true,
        videos: cachedData
      });
    }

    // Requisição à API do YouTube
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    // Processar dados
    const videos = response.data.items.map(item => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      videoLink: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`
    }));

    // Cachear resultado
    setCached(playlistId, videos);

    res.json({
      success: true,
      cached: false,
      videos
    });

  } catch (error) {
    console.error('Erro ao buscar playlist:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao carregar playlist do YouTube'
    });
  }
});

/**
 * Endpoint para chamar yt-dlp e extrair áudio (futuro)
 * GET /api/audio/:videoId
 */
app.get('/api/audio/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Por enquanto, apenas retorna informação
    // Próximo passo: implementar extração com yt-dlp
    res.json({
      success: false,
      message: 'Extração de áudio ainda não implementada. Use a API do YouTube para reproduzir vídeos.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend da Rádio Tofu funcionando!' });
});

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
  console.log(`🎵 Servidor da Rádio Tofu rodando em http://localhost:${PORT}`);
  console.log(`📝 API Key do YouTube configurada`);
});
