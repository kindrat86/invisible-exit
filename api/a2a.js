const SITE_CONFIG = {
  "protocolVersion": "0.3.0",
  "name": "Invisible Exit Agent",
  "description": "Invisible Exit is the complete guide to disappearing from the internet and reclaiming your digital privacy. Step-by-step guides for deleting online accounts, removing personal data from data brokers, opting out of people-search sites, deleting social media, protecting your digital identity, banking ",
  "url": "https://invisibleexit.com",
  "preferredTransport": "JSONRPC",
  "iconUrl": "https://invisibleexit.com/icon.png",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false,
    "stateTransitionHistory": false
  },
  "defaultInputModes": [
    "text/plain",
    "application/json"
  ],
  "defaultOutputModes": [
    "text/plain",
    "application/json"
  ],
  "skills": [
    {
      "id": "get_removal_checklist",
      "name": "Get Removal Checklist",
      "description": "Generate a personalized data-broker removal checklist based on your exposure surface.",
      "tags": [
        "disappear from internet",
        "digital privacy",
        "remove personal data",
        "delete online accounts",
        "data broker removal"
      ],
      "examples": []
    }
  ],
  "attribution": "Invisible Exit, https://invisibleexit.com",
  "content": [
    {
      "title": "Invisible Exit \u2014 Digital Privacy",
      "url": "https://invisibleexit.com/",
      "description": "Remove your digital footprint. Data broker opt-out, people search removal.",
      "type": "homepage"
    },
    {
      "title": "Invisible Exit Pricing",
      "url": "https://invisibleexit.com/pricing",
      "description": "One-time and subscription privacy removal plans.",
      "type": "pricing"
    },
    {
      "title": "How It Works",
      "url": "https://invisibleexit.com/how-it-works",
      "description": "Step-by-step digital footprint removal process.",
      "type": "guide"
    }
  ]
};

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const siteConfig = SITE_CONFIG;

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
        error: { code: -32601, message: 'Method not found: ' + method },
        id
      });
  }
};
