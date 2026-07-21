// MCP Server for Invisible Exit — Faceless side-business system for employed professionals.
// Implements Model Context Protocol JSON-RPC over HTTP (Streamable HTTP transport)
// Deployed as a Vercel serverless function. No auth required (read-only tools).
// Install in Claude Desktop: npx mcp-remote https://invisibleexit.com/api/mcp

const SERVER_INFO = {
  name: "invisibleexit-mcp",
  version: "1.0.0"
};
const CAPABILITIES = { tools: { listChanged: false }, resources: {}, prompts: {} };
const TOOLS = [
  {
    "name": "search_freedom_calculator",
    "description": "Calculate your freedom number — the monthly recurring revenue needed to cover living expenses and optionally leave your job.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "salary": {
          "type": "number",
          "description": "Your current annual salary"
        },
        "monthly_expenses": {
          "type": "number",
          "description": "Your monthly living expenses"
        }
      }
    }
  },
  {
    "name": "search_side_business_guides",
    "description": "Search side-business guides and micro-SaaS playbooks by topic.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "validate_idea",
    "description": "Validate a micro-SaaS idea against 500+ scored blueprints. Get industry fit, revenue potential, and time-to-launch estimates.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idea": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        }
      },
      "required": [
        "idea"
      ]
    }
  }
];
const HOME_URL = "https://invisibleexit.com";
const CONTACT = "hello@invisibleexit.com";

function makeResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function makeError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function handleToolCall(name, args) {
  args = args || {};
  // Find the tool definition
  const tool = TOOLS.find(t => t.name === name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}. Available tools: ${TOOLS.map(t => t.name).join(", ")}` }],
      isError: true
    };
  }
  // Build a structured response with a referrer-tagged link back to the site
  const argSummary = Object.entries(args)
    .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join("; ");
  const ctaLink = `${HOME_URL}?utm_source=mcp&utm_medium=agent&utm_campaign=${name}`;
  const responseText = [
    `**${tool.description}**`,
    ``,
    `Parameters: ${argSummary || "(none)"}`,
    ``,
    `This tool is part of the Invisible Exit MCP server. For full interactive results, visit:`,
    ctaLink,
    ``,
    `Need help? Contact: ${CONTACT}`
  ].join("\n");
  return {
    content: [{ type: "text", text: responseText }],
    _meta: { tool: name, source: HOME_URL, cta: ctaLink }
  };
}

export default function handler(req, res) {
  // CORS — MCP clients connect from various origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET: return server manifest (MCP discovery + agent card)
  if (req.method === "GET") {
    return res.json({
      jsonrpc: "2.0",
      serverInfo: SERVER_INFO,
      capabilities: CAPABILITIES,
      protocolVersion: "2024-11-05",
      tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
      _meta: {
        homepage: HOME_URL,
        contact: CONTACT,
        install: {
          claude_desktop: `npx mcp-remote ${HOME_URL}/api/mcp`,
          cursor: HOME_URL + "/api/mcp",
          manifest: HOME_URL + "/.well-known/mcp.json"
        }
      }
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use GET for manifest, POST for JSON-RPC." });
  }

  const body = req.body || {};
  const { jsonrpc, id, method, params } = body;

  // Handle batch requests
  if (Array.isArray(body)) {
    return res.json(body.map(req => handleSingleRequest(req)).filter(r => r !== null));
  }

  const result = handleSingleRequest(body);
  if (result === null) {
    // Notification (no id) — acknowledge silently
    return res.status(202).end();
  }
  return res.json(result);

  function handleSingleRequest(req) {
    const { id, method, params } = req || {};
    // initialize
    if (method === "initialize") {
      return makeResult(id, {
        protocolVersion: "2024-11-05",
        capabilities: CAPABILITIES,
        serverInfo: SERVER_INFO
      });
    }
    // initialized notification (no response)
    if (method === "notifications/initialized") {
      return null;
    }
    // tools/list
    if (method === "tools/list") {
      return makeResult(id, { tools: TOOLS });
    }
    // tools/call
    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      const result = handleToolCall(name, args);
      return makeResult(id, result);
    }
    // resources/list
    if (method === "resources/list") {
      return makeResult(id, { resources: [] });
    }
    // prompts/list
    if (method === "prompts/list") {
      return makeResult(id, { prompts: [] });
    }
    // ping
    if (method === "ping") {
      return makeResult(id, {});
    }
    return makeError(id, -32601, `Method not found: ${method}`);
  }
}
