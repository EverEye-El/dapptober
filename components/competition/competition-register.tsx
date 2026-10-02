"use client"

import { useState, type FormEvent } from "react"
import { prepareContractCall, readContract, sendAndConfirmTransaction } from "thirdweb"
import { useActiveAccount } from "thirdweb/react"
import { isCompetitionHost } from "@/lib/competition/access"
import { competitionAddressEnvKey, competitionChain, competitionContracts } from "@/lib/competition/chain"
import { uploadSubmissionImage } from "@/app/actions/submissions"
import { recordCompetitionEntry, uploadCompetitionMetadata } from "@/app/actions/competition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConnectModal } from "@/components/web3/connect-modal"
import { getUnlockedSubmitDays, submitDayValidationError } from "@/lib/community/dapptober-calendar"

const ENTRY_FEE = BigInt(5_000_000)
const BASE_MAINNET_ID = 8453

export function CompetitionRegister() {
  const account = useActiveAccount()
  const [showConnect, setShowConnect] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hostEntersFree = Boolean(account && competitionChain().id === BASE_MAINNET_ID && isCompetitionHost(account.address))
  const unlockedDays = getUnlockedSubmitDays()
  const [day, setDay] = useState(unlockedDays[0] ?? 1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!account) {
      setShowConnect(true)
      return
    }
    const dayError = submitDayValidationError(day)
    if (dayError) {
      setError(dayError)
      return
    }
    const config = competitionContracts()
    if (!config) {
      setError(`Competition contract is not deployed yet. Set ${competitionAddressEnvKey()}.`)
      return
    }

    setPending(true)
    try {
      let imageUrl: string | null = null
      if (imageFile) {
        const body = new FormData()
        body.set("file", imageFile)
        const uploaded = await uploadSubmissionImage(body)
        if (!uploaded.success) throw new Error(uploaded.error)
        imageUrl = uploaded.url
      }

      const meta = await uploadCompetitionMetadata({
        name,
        description,
        demoUrl,
        imageUrl,
        owner: account.address,
        day,
      })
      if (!meta.success) throw new Error(meta.error)

      const entryId = await readContract({
        contract: config.competition,
        method: "function nextEntryId() view returns (uint256)",
        params: [],
      })

      if (!hostEntersFree) {
        await sendAndConfirmTransaction({
          account,
          transaction: prepareContractCall({
            contract: config.usdc,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [config.competition.address, ENTRY_FEE],
          }),
        })
      }

      const receipt = await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: config.competition,
          method: "function register(string metadataUri) returns (uint256)",
          params: [meta.url],
        }),
      })

      const saved = await recordCompetitionEntry({
        onchainEntryId: Number(entryId),
        walletAddress: account.address,
        name,
        description,
        demoUrl,
        imageUrl,
        metadataUri: meta.url,
        txHash: receipt.transactionHash,
        day,
      })
      if (!saved.success) throw new Error(saved.error)
      setName("")
      setDescription("")
      setDemoUrl("")
      setImageFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <ConnectModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-day" className="text-white">Prompt day</Label>
          <select
            id="agent-day"
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
            required
            className="w-full h-10 bg-slate-900/90 border border-primary/50 text-white px-3"
          >
            {unlockedDays.map((option) => (
              <option key={option} value={option}>
                Day {String(option).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-name" className="text-white">Agent name</Label>
          <Input id="agent-name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-slate-900/90 border-primary/50 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-description" className="text-white">Description</Label>
          <Textarea id="agent-description" value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-slate-900/90 border-primary/50 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-demo" className="text-white">Demo URL</Label>
          <Input id="agent-demo" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} required className="bg-slate-900/90 border-primary/50 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-image" className="text-white">Cover image</Label>
          <Input id="agent-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="bg-slate-900/90 border-primary/50 text-white" />
        </div>
        {error ? <p className="text-sm text-orange-400">{error}</p> : null}
        <Button type="submit" disabled={pending} className="term-btn h-10">
          {pending ? "Registering…" : hostEntersFree ? "Enter" : "Pay 5 USDC and enter"}
        </Button>
        <p className="text-xs text-copper-dim">
          {hostEntersFree
            ? "Your host wallet enters without the USDC fee. This is not a like."
            : "$1 goes to the creator wallet now. $4 stays in escrow for the winner. This is not a like."}
        </p>
      </form>
    </>
  )
}
