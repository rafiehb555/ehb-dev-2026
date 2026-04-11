import Task from "../models/Task.js";
import { buildTasksFromUser } from "../ai/taskEngine.js";

export async function generateTasks(user) {
  const tasks = buildTasksFromUser(user);

  if (tasks.length === 0) {
    return [];
  }

  const existingPending = await Task.find({
    userId: user.userId,
    status: "pending",
    type: { $in: tasks.map((t) => t.type) },
  }).select("type");

  const existingTypes = new Set(existingPending.map((t) => t.type));
  const toCreate = tasks.filter((t) => !existingTypes.has(t.type));
  if (toCreate.length === 0) return [];

  return Task.insertMany(toCreate);
}

export async function createTaskFromDepartment(userId, department) {
  const map = {
    PSS: {
      title: "Complete KYC",
      description: "Voice/AI detected verification need. Complete KYC.",
      type: "KYC",
      reward: 10,
    },
    EDR: {
      title: "Retake Failed Exam",
      description: "Voice/AI detected exam retry intent.",
      type: "EXAM",
      reward: 8,
    },
    EMO: {
      title: "Increase Activity",
      description: "Voice/AI detected activity improvement need.",
      type: "ACTIVITY",
      reward: 5,
    },
  };

  const template = map[department] || map.EMO;
  const already = await Task.findOne({ userId, type: template.type, status: "pending" });
  if (already) return already;

  return Task.create({ userId, ...template });
}

