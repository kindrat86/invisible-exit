/**
 * A2A (Agent-to-Agent) Protocol Endpoint — Vite / Express / Vercel Serverless
 * ---------------------------------------------------------------------------
 * Protocol: https://github.com/google/agent-to-agent  (JSON-RPC 2.0)
 *
 * ESM module. Works as:
 *   1. A Vercel serverless function  → place at  api/a2a.js   (ESM project)
 *                                        or    api/a2a.cjs  (CJS project)
 *   2. An Express route              → app.post("/api/a2a", handler)
 *   3. A Vite dev middleware         → connect-style adapter
 *
 * Config: reads `a2a-config.json` from the repo root (or A2A_CONFIG_PATH env).
 *
 * Supported JSON-RPC methods:
 *   - "agent/info"         — identity + protocol version
 *   - "agent/capabilities" — what this agent can do
 *   - "agent/query"        — natural-language query over site content
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

let cachedConfig = null;

function loadConfigSync() {
  if (cachedConfig) return cachedConfig;
  const cfgPath =
    process.env.A2A_CONFIG_PATH ||
    path.join(process.cwd(), "a2a-config.json");
  try {
    cachedConfig = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  } catch {
    cachedConfig = {
      siteName: "Unconfigured Site",
      description:
        "A2A endpoint installed but no a2a-config.json found at repo root.",
      domain: "",
      capabilities: [],
      contentItems: [],
    };
  }
  return cachedConfig;
}

// ---------------------------------------------------------------------------
// Method handlers
// ---------------------------------------------------------------------------

function handleAgentInfo(cfg) {
  return {
    protocolVersion: cfg.protocolVersion || "0.3.0",
    name: cfg.siteName,
    description: cfg.description,
    url: cfg.domain,
    preferredTransport: "JSONRPC",
    version: "1.0.0",
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: (cfg.capabilities || []).map((c) => ({
      id: c.name,
      name: c.name,
      description: c.description,
      tags: c.examples || [],
      examples: c.examples || [],
    })),
    ...(cfg.contact ? { contact: cfg.contact } : {}),
    attribution: `${cfg.siteName}, ${cfg.domain}`,
  };
}

function handleAgentCapabilities(cfg) {
  return {
    protocolVersion: cfg.protocolVersion || "0.3.0",
    capabilities: cfg.capabilities || [],
    content: cfg.contentItems || [],
  };
}

function rankContent(query, items) {
  const q = (query || "").toLowerCase();
  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  if (terms.length === 0) return items || [];
  return (items || [])
    .map((it) => {
      const haystack = `${it.title} ${it.description}`.toLowerCase();
      let score = 0;
      for (const t of terms) if (haystack.includes(t)) score += 1;
      return { item: it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

function handleAgentQuery(cfg, params) {
  params = params || {};
  const query = params.query || params.q || "";
  const results = rankContent(query, cfg.contentItems);
  return {
    query,
    site: cfg.siteName,
    results: results.map((r) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    })),
    total: results.length,
  };
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const METHODS = {
  "agent/info": handleAgentInfo,
  "agent/capabilities": handleAgentCapabilities,
  "agent/query": handleAgentQuery,
};

function rpcError(id, code, message, data) {
  return { jsonrpc: "2.0", id, error: { code, message, data } };
}
function rpcOk(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function dispatch(body, cfg) {
  const id = body && body.id != null ? body.id : null;

  if (!body || typeof body !== "object" || typeof body.method !== "string") {
    return rpcError(id, -32600, "Invalid Request: missing or non-object body");
  }

  const fn = METHODS[body.method];
  if (!fn) {
    return rpcError(id, -32601, `Method not found: ${body.method}`);
  }

  try {
    const result = fn(cfg, body.params);
    return rpcOk(id, result);
  } catch (err) {
    const message = err && err.message ? err.message : "Internal error";
    return rpcError(id, -32603, `Internal error: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ---------------------------------------------------------------------------
// Vercel / Express handler (Node req/res)
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204);
    return res.end();
  }

  const cfg = loadConfigSync();

  // GET → agent card (discovery)
  if (req.method === "GET") {
    return res.status(200).json(handleAgentInfo(cfg));
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || null;

  // Batch request
  if (Array.isArray(body)) {
    return res.status(200).json(body.map((b) => dispatch(b, cfg)));
  }

  const out = dispatch(body, cfg);
  const status = out.error && out.error.code === -32600 ? 400 : 200;
  return res.status(status).json(out);
}

// Named exports so the same file can be mounted in Express:
//   import { handler, dispatch } from "./a2a-endpoint.js";
//   app.post("/api/a2a", handler); app.get("/api/a2a", handler);
export { dispatch, handleAgentInfo, handleAgentCapabilities, handleAgentQuery };
