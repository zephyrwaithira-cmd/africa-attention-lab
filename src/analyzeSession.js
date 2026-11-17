
export function analyzeSession(data) {
  if (
    data?.phase !== 1 ||
    !data.sessionState ||
    !Array.isArray(data.sessionState.events)
  ) {
    throw new Error("Invalid Phase 1 session data");
  }

  const session = data.sessionState;
  const events = session.events;

  const evidenceOpened = new Set(
    (session.opened || []).filter(
      (index) => Number.isInteger(index) &&
        index >= 0 && index < 6
    )
  ).size;

  const decisions = events.filter(
    (event) => event.type === "Decision changed"
  );

  const submissions = events.filter(
    (event) => event.type === "Decision submitted"
  );

  const submitted = session.status === "submitted" &&
    submissions.length > 0;

  const completionMs = submitted
    ? submissions[submissions.length - 1].elapsed
    : null;

  const rationale = session.rationale || "";
  const rationaleLength = rationale.trim().length;

  const evidenceCoverage = Math.round(
    (evidenceOpened / 6) * 1000
  ) / 10;

  return {
    participantId: data.participantId,
    status: session.status,
    evidenceOpened,
    evidenceTotal: 6,
    evidenceCoverage,
    decisionSelections: decisions.length,
    decisionRevisions: Math.max(0, decisions.length - 1),
    completionSeconds: completionMs === null
      ? null
      : Math.round(completionMs / 100) / 10,
    rationaleLength,
    reasoningEvidence:
      rationaleLength < 50
        ? "Insufficient for review"
        : "Available for human review",
    submitted
  };
}
