import Notification from "../models/Notification.js";

export async function notifyUser({ userId, type, title, message }) {
  try {
    await Notification.create({ userId, type, title, message });
  } catch {
    // Non-blocking notification persistence.
  }
}

export async function sendEmailNotification({ to, subject, body }) {
  // Placeholder for SMTP/provider integration in production.
  return { queued: true, to, subject, body };
}

