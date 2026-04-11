import Log from "../models/Log.js";

export async function logEvent({ userId, event, entity, meta }) {
  try {
    await Log.create({ userId, event, entity, meta });
  } catch {
    // Non-blocking logging.
  }
}

