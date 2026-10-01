"use client"

import { useState } from "react"
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb"
import { useActiveAccount } from "thirdweb/react"
import { competitionContracts } from "@/lib/competition/chain"
import { competitionPhase } from "@/lib/competition/window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FinalizeEntry {
  onchainEntryId: number
  name: string
  votes: number
}

export function FinalizePanel({ entries }: { entries: FinalizeEntry[] }) {
  const account = useActiveAccount()
  const owner = (process.env.NEXT_PUBLIC_COMPETITION_OWNER || "").toLowerCase()
  const [selected, setSelected] = useState<number[]>([])
  const [deposit, setDeposit] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!account || !owner || account.address.toLowerCase() !== owner) return null

  const phase = competitionPhase()
  const top = entries.reduce((max, entry) => Math.max(max, entry.votes), 0)
  const tied = entries.filter((entry) => entry.votes === top && top > 0)

  const toggle = (id: number) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      if (current.length >= 3) return current
      return [...current, id]
    })
  }

  const onFinalize = async () => {
    const config = competitionContracts()
    if (!config) {
      setMessage("Set NEXT_PUBLIC_COMPETITION_ADDRESS before finalizing.")
      return
    }
    setPending(true)
    setMessage(null)
    try {
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: config.competition,
          method: "function finalize(uint256[] entryIds)",
          params: [selected.map((id) => BigInt(id))],
        }),
      })
      setMessage("Pot paid to the selected registrant wallets.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Finalize failed")
    } finally {
      setPending(false)
    }
  }

  const onDeposit = async () => {
    const config = competitionContracts()
    const amount = BigInt(Math.round(Number(deposit) * 1_000_000))
    if (!config || amount <= BigInt(0)) {
      setMessage("Enter a USDC amount and deploy the contract first.")
      return
    }
    setPending(true)
    setMessage(null)
    try {
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: config.usdc,
          method: "function approve(address spender, uint256 amount) returns (bool)",
          params: [config.competitionAddress, amount],
        }),
      })
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: config.competition,
          method: "function depositPot(uint256 amount)",
          params: [amount],
        }),
      })
      setDeposit("")
      setMessage("USDC deposited into escrow.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Deposit failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 pb-8">
      <div className="glass-card border-primary/30 p-4 space-y-4">
        <h2 className="text-lg font-bold text-copper-bright">Owner</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-white space-y-2">
            <span>Add USDC to the pot</span>
            <Input
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
              inputMode="decimal"
              placeholder="100"
              className="bg-slate-900/90 border-primary/50 text-white"
            />
          </label>
          <Button type="button" className="term-btn h-10" disabled={pending} onClick={onDeposit}>
            Deposit
          </Button>
        </div>
        {phase === "closed" ? (
          <div className="space-y-3">
            <p className="text-sm text-copper-dim">
              {tied.length > 3
                ? "More than three entries share the top vote count. Run a runoff, then finalize one to three of them."
                : "Select the one to three entries tied for first. The contract splits the escrow among them."}
            </p>
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li key={entry.onchainEntryId} className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={selected.includes(entry.onchainEntryId)}
                    onChange={() => toggle(entry.onchainEntryId)}
                  />
                  <span>
                    {entry.name} — {entry.votes} votes
                  </span>
                </li>
              ))}
            </ul>
            <Button type="button" className="term-btn h-10" disabled={pending || selected.length === 0} onClick={onFinalize}>
              Finalize
            </Button>
          </div>
        ) : (
          <p className="text-sm text-copper-dim">
            Finalize unlocks after November 5, US Eastern. Announce the winner by November 10.
          </p>
        )}
        {message ? <p className="text-sm text-orange-400">{message}</p> : null}
      </div>
    </section>
  )
}
