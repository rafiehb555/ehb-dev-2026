/**
 * When the local DB has no marketplace/search rows, serve curated demo items in development
 * so screens stay fully interactive. Disable with EHB_DEMO_DATASET=false.
 */
export function isDevDemoDatasetEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const v = process.env.EHB_DEMO_DATASET;
  if (v === "false" || v === "0") return false;
  return true;
}
