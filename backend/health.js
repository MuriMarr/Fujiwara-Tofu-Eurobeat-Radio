app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend da Rádio Tofu funcionando!' });
});