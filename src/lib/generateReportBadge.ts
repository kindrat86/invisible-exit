import { formatCurrency } from "@/lib/fym-calculations";

export interface ReportBadgeData {
  tier: "starter" | "founding" | "standard";
  freedomLevel: number;
  levelName: string;
  fymScore: number;
  freedomPercentage: number;
  exitReadiness: number | null;
  generatedDate: string;
}

const W = 1200;
const H = 630;

const COLORS = {
  bgTop: "#0a1628",
  bgBottom: "#132244",
  gold: "#D4A843",
  mutedGold: "rgba(212, 168, 67, 0.6)",
  white: "#ffffff",
  muted: "rgba(255, 255, 255, 0.5)",
  dimText: "rgba(255, 255, 255, 0.35)",
  green: "#22c55e",
  red: "#ef4444",
  gridLine: "rgba(255, 255, 255, 0.05)",
  separator: "rgba(212, 168, 67, 0.3)",
};

const FONT = "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, COLORS.bgTop);
  grad.addColorStop(1, COLORS.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Grid overlay
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

function drawWordmark(ctx: CanvasRenderingContext2D) {
  ctx.font = `600 18px ${FONT}`;
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Invisible Exit", 48, 48);
}

function drawTierPill(ctx: CanvasRenderingContext2D, tier: ReportBadgeData["tier"]) {
  const isFoundingOrStandard = tier === "founding" || tier === "standard";
  const label = isFoundingOrStandard ? "FOUNDING MEMBER" : "STARTER";
  ctx.font = `700 13px ${FONT}`;
  const textWidth = ctx.measureText(label).width;
  const pillW = textWidth + 24;
  const pillH = 28;
  const pillX = W - 48 - pillW;
  const pillY = 34;

  roundRect(ctx, pillX, pillY, pillW, pillH, 14);

  if (isFoundingOrStandard) {
    ctx.fillStyle = COLORS.gold;
    ctx.fill();
    ctx.fillStyle = COLORS.bgTop;
  } else {
    ctx.strokeStyle = COLORS.mutedGold;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = COLORS.mutedGold;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, pillX + pillW / 2, pillY + pillH / 2);
}

function drawLevelCenter(
  ctx: CanvasRenderingContext2D,
  freedomLevel: number,
  levelName: string,
  isFoundingOrStandard: boolean
) {
  const centerY = 230;

  // Subtle gold glow for founding
  if (isFoundingOrStandard) {
    ctx.save();
    ctx.shadowColor = COLORS.gold;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = `800 72px ${FONT}`;
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`LEVEL ${freedomLevel}`, W / 2, centerY);
    ctx.restore();
  } else {
    ctx.font = `800 72px ${FONT}`;
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`LEVEL ${freedomLevel}`, W / 2, centerY);
  }

  // Level name
  ctx.font = `500 28px ${FONT}`;
  ctx.fillStyle = COLORS.gold;
  ctx.fillText(levelName, W / 2, centerY + 50);
}

function drawStatsRow(ctx: CanvasRenderingContext2D, data: ReportBadgeData) {
  const isFoundingOrStandard = data.tier === "founding" || data.tier === "standard";
  const showExitReadiness = data.exitReadiness !== null;
  const rowY = 410;
  const labelY = rowY;
  const valueY = rowY + 32;

  if (isFoundingOrStandard || showExitReadiness) {
    // 3 columns
    const cols = [W / 6, W / 2, (W * 5) / 6];

    // FYM Score
    drawStatColumn(ctx, cols[0], labelY, valueY, "FYM Score", formatCurrency(data.fymScore), data.fymScore >= 0 ? COLORS.green : COLORS.red);

    // Freedom %
    drawStatColumn(ctx, cols[1], labelY, valueY, "Freedom %", `${Math.round(data.freedomPercentage)}%`, COLORS.white);

    // Exit Readiness
    if (showExitReadiness) {
      drawStatColumn(ctx, cols[2], labelY, valueY, "Exit Readiness", `${data.exitReadiness}/100`, COLORS.white);
    } else {
      // Founding without exit readiness (shouldn't normally happen but handle gracefully)
      ctx.font = `400 12px ${FONT}`;
      ctx.fillStyle = COLORS.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Complete Invisibility Audit", cols[2], labelY + 16);
      ctx.fillText("to unlock Exit Readiness", cols[2], labelY + 32);
    }
  } else {
    // Starter without exit readiness: 2 columns + note
    const col1 = W / 4;
    const col2 = W / 2;

    drawStatColumn(ctx, col1, labelY, valueY, "FYM Score", formatCurrency(data.fymScore), data.fymScore >= 0 ? COLORS.green : COLORS.red);
    drawStatColumn(ctx, col2, labelY, valueY, "Freedom %", `${Math.round(data.freedomPercentage)}%`, COLORS.white);

    // "Full report" note
    ctx.font = `400 12px ${FONT}`;
    ctx.fillStyle = COLORS.dimText;
    ctx.textAlign = "center";
    ctx.fillText("Full report available", (W * 3) / 4, labelY + 10);
    ctx.fillText("with Founding Toolkit", (W * 3) / 4, labelY + 28);
  }
}

function drawStatColumn(
  ctx: CanvasRenderingContext2D,
  x: number,
  labelY: number,
  valueY: number,
  label: string,
  value: string,
  valueColor: string
) {
  ctx.font = `500 13px ${FONT}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.toUpperCase(), x, labelY);

  ctx.font = `700 28px ${FONT}`;
  ctx.fillStyle = valueColor;
  ctx.fillText(value, x, valueY);
}

function drawFooter(ctx: CanvasRenderingContext2D, generatedDate: string) {
  const lineY = 540;

  // Separator
  ctx.strokeStyle = COLORS.separator;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, lineY);
  ctx.lineTo(W - 48, lineY);
  ctx.stroke();

  const footerY = lineY + 30;

  ctx.font = `400 14px ${FONT}`;
  ctx.textBaseline = "middle";

  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = "left";
  ctx.fillText("Calculate yours: invisibleexit.com", 48, footerY);

  ctx.textAlign = "right";
  ctx.fillText(generatedDate, W - 48, footerY);
}

async function ensureFontLoaded(): Promise<void> {
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  } catch {
    // Fallback to system font silently
  }
}

export async function generateReportBadge(data: ReportBadgeData): Promise<Blob> {
  await ensureFontLoaded();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);
  drawWordmark(ctx);
  drawTierPill(ctx, data.tier);

  const isFoundingOrStandard = data.tier === "founding" || data.tier === "standard";
  drawLevelCenter(ctx, data.freedomLevel, data.levelName, isFoundingOrStandard);
  drawStatsRow(ctx, data);
  drawFooter(ctx, data.generatedDate);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate badge image"));
      },
      "image/png"
    );
  });
}
