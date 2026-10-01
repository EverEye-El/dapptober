export type PromptEngagementTarget = {
  kind: "prompt"
  dappDay: number
}

export type SubmissionEngagementTarget = {
  kind: "submission"
  submissionId: string
  dappDay: number
}

export type EngagementTarget = PromptEngagementTarget | SubmissionEngagementTarget

export function isPromptTarget(target: EngagementTarget): target is PromptEngagementTarget {
  return target.kind === "prompt"
}
