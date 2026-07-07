const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  let siteConfig;
  try {
    const paths = [
      join(process.cwd(), '.well-known', 'agent-card.json'),
      join(process.cwd(), 'public', '.well-known', 'agent-card.json'),
      join(process.cwd(), '..', '.well-known', 'agent-card.json'),
    ];
    for (const p of paths) {
      if (existsSync(p)) {
        siteConfig = JSON.parse(readFileSync(p, 'utf-8'));
        break;
      }
    }
    if (!siteConfig) throw new Error('not found');
  } catch (e) {
    return res.status(200).json({ query: '', results: [], total: 0 });
  }

  const query = req.query?.query || req.body?.query || '';
  const limit = parseInt(req.query?.limit || req.body?.limit || '10');

  const results = (siteConfig.content || []).filter(item => {
    if (!query) return true;
    const q = String(query).toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.description || '').toLowerCase().includes(q);
  }).slice(0, limit);

  return res.status(200).json({
    query,
    results: results.map(c => ({
      url: c.url,
      name: c.title,
      description: c.description,
      site_name: siteConfig.name,
      site_url: siteConfig.url,
      type: c.type || 'webpage',
      score: 1.0
    })),
    total: results.length,
    ai_answer: query ? `${siteConfig.name}: ${siteConfig.description}` : undefined
  });
};
