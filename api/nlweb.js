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
  const query = (req.query && req.query.query) || (req.body && req.body.query) || '';
  const limit = parseInt((req.query && req.query.limit) || (req.body && req.body.limit) || '10');

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
    ai_answer: query ? siteConfig.name + ': ' + siteConfig.description : undefined
  });
};
