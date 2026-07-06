/**
 * Honeypot component for bot protection.
 * Invisible to humans, filled in by bots. Server-side validation rejects submissions
 * where the honeypot field has a value.
 *
 * Usage:
 *   <Honeypot />  // place inside any form
 *
 * Server-side validation in API routes:
 *   if (body.hp_name) { return 400 } // bot detected
 *
 * For Vercel API routes, also add a hidden timestamp field to reject
 * submissions faster than 2 seconds (impossible for humans).
 */

import { useId } from "react";

interface HoneypotProps {
  /** Optional custom field name (default: hp_name) */
  fieldName?: string;
}

/**
 * Hidden honeypot field + timestamp check.
 * Renders nothing visible — style + position ensure only bots interact with it.
 */
export function Honeypot({ fieldName = "hp_name" }: HoneypotProps) {
  const id = useId();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        opacity: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <label htmlFor={`${id}-${fieldName}`}>Leave this empty</label>
      <input
        id={`${id}-${fieldName}`}
        name={fieldName}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
      <input
        name="hp_ts"
        type="hidden"
        defaultValue={String(Date.now())}
      />
    </div>
  );
}

/**
 * Server-side honeypot + timestamp validation.
 * Returns an error message if bot detected, or null if human.
 */
export function validateHoneypot(body: Record<string, unknown>): string | null {
  // Check honeypot field
  const hpValue = body["hp_name"];
  if (typeof hpValue === "string" && hpValue.length > 0) {
    return "Bot detected";
  }

  // Check submission speed (faster than 2s = likely bot)
  const hpTs = body["hp_ts"];
  if (typeof hpTs === "string") {
    const ts = Number(hpTs);
    if (!isNaN(ts) && Date.now() - ts < 2000) {
      return "Too fast";
    }
  }

  return null;
}

export default Honeypot;
