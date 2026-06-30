const express = require('express');
const axios = require('axios');
const { YOUTUBE_API_KEY } = require('../config');

const router = express.Router();

const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

function getCached(playlistId) {
  const cached = cache.get(playlistId);
  
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(playlistId);
    return null;
  }

  return cached.data;
}

function setCached(playlistId, data) {
  cache.set(playlistId, {
    data,
    timestamp: Date.now()
  });
}

setInterval(() => {
  cache.clear();
}, CACHE_DURATION); // Limpar cache a cada hora

router.get('/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const maxResults = parseInt(req.query.maxResults) || 50;

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

module.exports = router;