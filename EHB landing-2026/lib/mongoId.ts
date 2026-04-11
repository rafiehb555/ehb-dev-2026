export function isMongoObjectId(value: string | null | undefined) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
}
