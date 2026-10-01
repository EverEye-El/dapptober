"use client"

import { useState } from "react"
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb"
import { useActiveAccount } from "thirdweb/react"
import { competitionContracts } from "@/lib/competition/chain"
import { recordCompetitionVote } from "@/app/actions/competition"
import { competitionPhase, VOTE_WINDOW_LABEL, WINNER_ANNOUNCEMENT_LABEL } from "@/lib/competition/window"
import { Button } from "@/components/ui/button"
import { ConnectModal } from "@/components/web3/connect-modal"

interface VoteButtonProps {
  entryId: string
  onchainEntryId: number
  voteCount: number
}

export function VoteButton({ entryId, onchainEntryId, voteCount }: VoteButtonProps) {
  const account = useActiveAccount()
  const [showConnect, setShowConnect] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(voteCount)
  const phase = competitionPhase()

  const onVote = async () => {
    setError(null)
    if (!account) {
      setShowConnect(true)
      return
    }
    const config = competitionContracts()
    if (!config) {
      setError("Competition contract is not deployed yet.")
      return
    }
    setPending(true)
    try {
      const receipt = await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: config.competition,
          method: "function vote(uint256 entryId)",
          params: [BigInt(onchainEntryId)],
        }),
      })
      const saved = await recordCompetitionVote({
        entryId,
        walletAddress: account.address,
        txHash: receipt.transactionHash,
      })
      if (!saved.success) throw new Error(saved.error)
      setCount((value) => value + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <ConnectModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
      <Button type="button" onClick={onVote} disabled={pending || phase !== "voting"} className="term-btn h-10">
        {pending ? "Voting…" : `Vote ${count}`}
      </Button>
      <p className="text-xs text-copper-dim">
        Voting is open {VOTE_WINDOW_LABEL}. Winner announced by {WINNER_ANNOUNCEMENT_LABEL}.
      </p>
      {error ? <p className="text-sm text-orange-400">{error}</p> : null}
    </>
  )
}
