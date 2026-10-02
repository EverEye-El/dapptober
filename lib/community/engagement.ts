export type PromptEngagementTarget = {
  kind: "prompt"
  dappDay: number
}

export type SubmissionEngagementTarget = {
  kind: "submission"
  submissionId: string
  dappDay: number
}

export type EntryEngagementTarget = {
  kind: "entry"
  entryId: string
}

export type EngagementTarget = PromptEngagementTarget | SubmissionEngagementTarget | EntryEngagementTarget

export function isPromptTarget(target: EngagementTarget): target is PromptEngagementTarget {
  return target.kind === "prompt"
}

export function commentRealtime(target: EngagementTarget): { channelName: string; filter: string } {
  switch (target.kind) {
    case "prompt":
      return {
        channelName: `comments:prompt:${target.dappDay}`,
        filter: `dapp_day=eq.${target.dappDay}`,
      }
    case "submission":
      return {
        channelName: `comments:submission:${target.submissionId}`,
        filter: `submission_id=eq.${target.submissionId}`,
      }
    case "entry":
      return {
        channelName: `comments:entry:${target.entryId}`,
        filter: `entry_id=eq.${target.entryId}`,
      }
    default: {
      const unreachable: never = target
      return unreachable
    }
  }
}
