const express = require('express');
const cors = require('cors');

const { PORT } = require('./config');

const playlistRoutes = require('./routes/playlist');
const healthRoutes = require('./routes/health');

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

app.use("/api", playlistRoutes);
app.use("/api", healthRoutes);

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
  console.log(`🎵 Servidor da Rádio Tofu rodando em http://localhost:${PORT}`);
  console.log(`📝 API Key do YouTube configurada`);
});
