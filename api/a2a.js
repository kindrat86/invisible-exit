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
    return res.status(200).json({
      name: require('path').basename(process.cwd()),
      description: 'Site description not yet configured',
      url: `https://${process.env.VERCEL_URL || 'example.com'}`,
      capabilities: [],
      content: []
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json(siteConfig);
  }

  const { jsonrpc, method, params, id } = req.body || {};

  if (jsonrpc !== '2.0') {
    return res.status(200).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id: id || null });
  }

  switch (method) {
    case 'agent/info':
    case 'agent.describe':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: {
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          capabilities: siteConfig.capabilities || [],
          version: siteConfig.version || '1.0.0',
          authentication: siteConfig.authentication || { type: 'none' }
        },
        id
      });

    case 'agent/capabilities':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { capabilities: siteConfig.capabilities || [], content: siteConfig.content || [] },
        id
      });

    case 'agent/query':
    case 'agent/search':
      const query = (params && (params.query || params.q)) || '';
      const content = (siteConfig.content || []).filter(item => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (item.title || '').toLowerCase().includes(q) ||
               (item.description || '').toLowerCase().includes(q);
      });
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { query, results: content, total: content.length },
        id
      });

    default:
      return res.status(200).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: `Method not found: ${method}` },
        id
      });
  }
};
