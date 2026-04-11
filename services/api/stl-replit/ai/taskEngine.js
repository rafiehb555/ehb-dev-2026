export function buildTasksFromUser(user) {
  const tasks = [];

  if (!user.modules?.pss?.kycVerified) {
    tasks.push({
      userId: user.userId,
      title: "Complete KYC",
      description: "Verify your identity to increase trust score",
      type: "KYC",
      reward: 10,
    });
  }

  if ((user.modules?.crb?.examsFailed || 0) > 0) {
    tasks.push({
      userId: user.userId,
      title: "Retake Failed Exam",
      description: "Pass exam to improve CRB score",
      type: "EXAM",
      reward: 8,
    });
  }

  if (user.modules?.dmo?.activityLevel === "low") {
    tasks.push({
      userId: user.userId,
      title: "Increase Activity",
      description: "Stay active daily to boost STL",
      type: "ACTIVITY",
      reward: 5,
    });
  }

  return tasks;
}

