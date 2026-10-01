import { getContract } from "thirdweb"
import { defineChain } from "thirdweb/chains"
import { client } from "@/lib/web3/thirdweb-client"

function asAddress(value: string | undefined): `0x${string}` | null {
  if (!value?.startsWith("0x") || value.length !== 42) return null
  return value as `0x${string}`
}

export function competitionContracts() {
  const competitionAddress = asAddress(process.env.NEXT_PUBLIC_COMPETITION_ADDRESS)
  const usdcAddress = asAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS)
  if (!competitionAddress || !usdcAddress) return null

  const chain = defineChain(Number(process.env.NEXT_PUBLIC_COMPETITION_CHAIN_ID || "84532"))
  return {
    chain,
    competitionAddress,
    usdcAddress,
    competition: getContract({ client, chain, address: competitionAddress }),
    usdc: getContract({ client, chain, address: usdcAddress }),
  }
}
