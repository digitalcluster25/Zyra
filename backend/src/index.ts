import express from 'express';

const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Analytics endpoint (заглушка)
app.get('/api/analytics/recovery', (req, res) => {
  // TODO: получить данные из БД, рассчитать recovery series
  res.json({ series: [] });
});

// Admin panel endpoint (заглушка)
app.get('/api/admin/users', (req, res) => {
  // TODO: получить список пользователей
  res.json({ users: [] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
