"use client"

import { useEffect, useState } from "react"
import { prepareContractCall, readContract, sendAndConfirmTransaction } from "thirdweb"
import { useActiveAccount } from "thirdweb/react"
import { isCompetitionOperator } from "@/lib/competition/access"
import { competitionAddressEnvKey, competitionContracts } from "@/lib/competition/chain"
import { competitionPhase } from "@/lib/competition/window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FinalizeEntry {
  onchainEntryId: number
  name: string
  votes: number
}

function usdcUnits(value: string) {
  return BigInt(Math.round(Number(value) * 1_000_000))
}

export function FinalizePanel({ entries }: { entries: FinalizeEntry[] }) {
  const account = useActiveAccount()
  const [selected, setSelected] = useState<number[]>([])
  const [deposit, setDeposit] = useState("")
  const [fees, setFees] = useState("")
  const [collected, setCollected] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const allowed = Boolean(account && isCompetitionOperator(account.address))

  useEffect(() => {
    if (!allowed) return
    const config = competitionContracts()
    if (!config) return
    let cancelled = false
    readContract({
      contract: config.competition,
      method: "function creatorFees() view returns (uint256)",
      params: [],
    })
      .then((balance) => {
        if (!cancelled) setCollected((Number(balance) / 1_000_000).toString())
      })
      .catch(() => {
        if (!cancelled) setCollected(null)
      })
    return () => {
      cancelled = true
    }
  }, [allowed, message])

  if (!account || !allowed) return null

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
      setMessage(`Set ${competitionAddressEnvKey()} before finalizing.`)
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
    const amount = usdcUnits(deposit)
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
      setMessage("USDC added to the pot.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Deposit failed")
    } finally {
      setPending(false)
    }
  }

  const onFees = async (mode: "pot" | "withdraw") => {
    const config = competitionContracts()
    const amount = usdcUnits(fees)
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
          contract: config.competition,
          method:
            mode === "pot"
              ? "function addFeesToPot(uint256 amount)"
              : "function withdrawFees(address to, uint256 amount)",
          params: mode === "pot" ? [amount] : [account.address, amount],
        }),
      })
      setFees("")
      setMessage(mode === "pot" ? "Collected fees added to the pot." : "Collected fees sent to this wallet.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Fee transfer failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 pb-8">
      <div className="glass-card border-primary/30 p-4 space-y-4">
        <h2 className="text-lg font-bold text-copper-bright">Owner</h2>
        <p className="text-sm text-copper-dim">
          Each entry puts 4 USDC in the pot and holds 1 USDC aside. Either of your wallets can add those fees to the pot, withdraw them, or pay the winner.
          {collected ? ` Collected fees: ${collected} USDC.` : ""}
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-white space-y-2">
            <span>Collected fees</span>
            <Input
              value={fees}
              onChange={(event) => setFees(event.target.value)}
              inputMode="decimal"
              placeholder="1"
              className="bg-slate-900/90 border-primary/50 text-white"
            />
          </label>
          <Button type="button" className="term-btn h-10" disabled={pending} onClick={() => onFees("pot")}>
            Add to pot
          </Button>
          <Button type="button" className="term-btn h-10" disabled={pending} onClick={() => onFees("withdraw")}>
            Withdraw
          </Button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-white space-y-2">
            <span>Add other USDC to the pot</span>
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
