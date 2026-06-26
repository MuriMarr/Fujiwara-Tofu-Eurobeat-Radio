const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://fujiwara-tofu-eurobeat-radio.vercel.app'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida'));
    }
  }
}));
app.use(express.json());

// Variáveis de configuração
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Cache simples para evitar requisições repetidas
setInterval(() => {
  cache.clear();
  }, 1000 * 60 * 60); // 1 hora

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
  console.log(`🎵 Servidor da Rádio Tofu rodando em http://localhost:${PORT}`);
  console.log(`📝 API Key do YouTube configurada`);
});
