function containsAny(text, words) {
  return words.some((w) => text.includes(w));
}

export function decideDepartmentFromText(message = "") {
  const text = String(message).toLowerCase();

  if (containsAny(text, ["verify", "verification", "kyc", "complaint", "trust"])) {
    return "PSS";
  }

  if (containsAny(text, ["exam", "test", "retry", "assessment", "failed"])) {
    return "CRB";
  }

  if (containsAny(text, ["job", "office", "task", "operation", "work"])) {
    return "EMO";
  }

  return "EMO";
}

export function actionFromDepartment(department) {
  switch (department) {
    case "PSS":
      return "Create verification task and guide KYC completion.";
    case "CRB":
      return "Create exam retry task and prepare exam support.";
    default:
      return "Create operational follow-up task for user activity.";
  }
}

