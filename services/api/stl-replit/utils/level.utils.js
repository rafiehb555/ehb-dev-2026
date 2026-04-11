export function getLevelFromScore(score) {
  const s = Number(score || 0);
  if (s <= 20) return 1;
  if (s <= 40) return 2;
  if (s <= 55) return 3;
  if (s <= 65) return 4;
  if (s <= 75) return 5;
  if (s <= 85) return 6;
  if (s <= 95) return 7;
  return 8;
}

export function getLockLevel(amount) {
  const a = Number(amount || 0);
  if (a >= 5000) return 8;
  if (a >= 2500) return 7;
  if (a >= 1000) return 6;
  if (a >= 500) return 5;
  if (a >= 300) return 4;
  if (a >= 100) return 3;
  if (a >= 50) return 2;
  return 1;
}

