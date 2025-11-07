const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const syncRoutes = require('./routes/sync');

const app = express();

// Middleware CORS
app.use(cors({
  origin: function(origin, callback) {
    // Définir les origines autorisées par défaut
    const defaultOrigins = 'http://localhost:*,http://192.168.*.*,exp://*';
    const allowedOriginsString = process.env.ALLOWED_ORIGINS || defaultOrigins;
    const allowedOrigins = allowedOriginsString.split(',');
    
    // Permettre les requêtes sans origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Gérer les wildcards (192.168.*.*)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Origin non autorisée: ${origin}`);
      callback(null, true); // En dev, on permet quand même
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
┌─────────────────────────────────────────────────────────┐
│  🚀 Kame Daay Backend MySQL                             │
│  📍 Port: ${PORT}                                        │
│  🌍 Environment: ${process.env.NODE_ENV}                │
│  ✅ Health: http://localhost:${PORT}/api/health         │
└─────────────────────────────────────────────────────────┘
  `);
});
