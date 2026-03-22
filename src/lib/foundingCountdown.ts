/**
 * Deterministic daily countdown for founding spots.
 * Decreases by 1, 2, or 3 each day (pseudo-random but consistent),
 * starting from 99 on 2026-03-22, stopping at 3.
 */

const START_DATE = new Date("2026-03-22");
const START_SPOTS = 99;
const MIN_SPOTS = 3;

function getDaysSinceStart(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(
    START_DATE.getFullYear(),
    START_DATE.getMonth(),
    START_DATE.getDate()
  );
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
}

/** Simple hash to pick 1, 2, or 3 for a given day number */
function dailyDecrement(dayIndex: number): number {
  // Mix bits so the sequence looks random
  const hash = ((dayIndex * 2654435761) >>> 0) % 3;
  return hash + 1; // 1, 2, or 3
}

export function getFoundingSpotsLeft(): number {
  const days = getDaysSinceStart();
  let spots = START_SPOTS;

  for (let i = 0; i < days; i++) {
    spots -= dailyDecrement(i);
    if (spots <= MIN_SPOTS) return MIN_SPOTS;
  }

  return spots;
}

export function getFoundingMemberNumber(): number {
  return 100 - getFoundingSpotsLeft() + 1;
}
