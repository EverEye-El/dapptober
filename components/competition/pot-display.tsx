"use client"

import { useEffect, useState } from "react"
import { readContract } from "thirdweb"
import { competitionContracts } from "@/lib/competition/chain"
import { displayedPot } from "@/lib/competition/window"

export function PotDisplay() {
  const [label, setLabel] = useState(`$${displayedPot(0)} USDC`)

  useEffect(() => {
    const config = competitionContracts()
    if (!config) return
    let cancelled = false
    readContract({
      contract: config.usdc,
      method: "function balanceOf(address account) view returns (uint256)",
      params: [config.competitionAddress],
    })
      .then((balance) => {
        if (cancelled) return
        const usdc = Number(balance) / 1_000_000
        setLabel(`$${displayedPot(usdc)} USDC`)
      })
      .catch(() => {
        if (!cancelled) setLabel(`$${displayedPot(0)} USDC`)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <span>{label}</span>
}
