// Stealth Score SVG Badge API — Vercel serverless function
// GET /api/stealth-badge?score=N[&style=benchmark]
module.exports = function handler(req, res) {
  const { score = '0', style = 'default' } = req.query;
  const s = Math.min(100, Math.max(0, parseInt(score) || 0));

  let color, label;
  if (s >= 75) {
    color = '#22c55e';
    label = 'WELL-STEALTHED';
  } else if (s >= 50) {
    color = '#f59e0b';
    label = 'EXPOSED EDGES';
  } else {
    color = '#ef4444';
    label = 'HIGH RISK';
  }

  let svg;
  if (style === 'benchmark') {
    const pct = s >= 75 ? 'Top ' + Math.round((100 - s) / 4 + 1) + '%'
      : s >= 50 ? 'Top ' + Math.round((100 - s) / 2 + 15) + '%'
      : 'Bottom ' + Math.round(s / 2 + 10) + '%';
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="64" viewBox="0 0 320 64">
  <rect width="320" height="64" rx="10" fill="#141414" stroke="#2a2a2a" stroke-width="1.2"/>
  <text x="16" y="23" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#999">STEALTH SCORE</text>
  <text x="16" y="47" font-family="Inter,system-ui,sans-serif" font-size="19" font-weight="800" fill="${color}">${s}/100</text>
  <text x="95" y="23" font-family="Inter,system-ui,sans-serif" font-size="9" fill="#666">${pct}</text>
  <text x="95" y="41" font-family="Inter,system-ui,sans-serif" font-size="9" fill="${color}">${label}</text>
  <text x="195" y="25" font-family="Inter,system-ui,sans-serif" font-size="8" fill="#555">invisibleexit.com</text>
  <text x="195" y="43" font-family="Inter,system-ui,sans-serif" font-size="9" font-weight="600" fill="#a78bfa">Check yours →</text>
</svg>`;
  } else {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="64" viewBox="0 0 280 64">
  <rect width="280" height="64" rx="10" fill="#141414" stroke="#2a2a2a" stroke-width="1.2"/>
  <text x="16" y="26" font-family="Inter,system-ui,sans-serif" font-size="11" fill="#999">STEALTH SCORE</text>
  <text x="16" y="49" font-family="Inter,system-ui,sans-serif" font-size="21" font-weight="800" fill="${color}">${s}/100</text>
  <text x="100" y="25" font-family="Inter,system-ui,sans-serif" font-size="9" fill="#666">${label}</text>
  <text x="100" y="45" font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="600" fill="#a78bfa">Invisible Exit →</text>
</svg>`;
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(svg);
};
