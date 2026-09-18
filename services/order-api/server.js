const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.use(cors()); app.use(express.json());
app.get('/', (req, res) => res.json({
  service: 'resume-release-api',
  status: 'ok',
  description: 'REST/JSON support service for the DevOps & Release Engineer résumé PWA.',
  endpoints: { health: '/health', releaseSignal: '/release-signal', profile: '/profile' },
  app: 'http://localhost:3000',
}));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'resume-release-api' }));
app.get('/release-signal', (req, res) => res.json({ status: 'ready', message: 'Release candidate verified · ready for staging', checks: ['syntax', 'Playwright', 'release artifact'] }));
app.get('/profile', (req, res) => res.json({ name: 'Enrique Pujol', title: 'DevOps & Release Engineer', strengths: ['CI/CD', 'Bash automation', 'REST APIs', 'SRE operations'] }));
app.listen(PORT, () => console.log(`Resume release API running at http://localhost:${PORT}`));
