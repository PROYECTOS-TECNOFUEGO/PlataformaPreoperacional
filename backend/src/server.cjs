const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/index.cjs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Prefijo /api (match con el front)
app.use('/api', api);

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
