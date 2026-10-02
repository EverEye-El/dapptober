import { getContract } from "thirdweb"
import { base, baseSepolia, defineChain, type Chain } from "thirdweb/chains"
import { client } from "@/lib/web3/thirdweb-client"

const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

function asAddress(value: string | undefined): `0x${string}` | null {
  if (!value?.startsWith("0x") || value.length !== 42) return null
  return value as `0x${string}`
}

/** Base Sepolia until NEXT_PUBLIC_COMPETITION_CHAIN_ID is set to Base mainnet (8453). */
export function competitionChain(): Chain {
  const chainId = Number(process.env.NEXT_PUBLIC_COMPETITION_CHAIN_ID || String(baseSepolia.id))
  if (chainId === baseSepolia.id) return baseSepolia
  if (chainId === base.id) return base
  return defineChain(chainId)
}

/** Env key for the competition contract on the active chain. */
export function competitionAddressEnvKey(chain: Chain = competitionChain()): string {
  if (chain.id === base.id) return "NEXT_PUBLIC_BASE_COMPETITION_ADDRESS"
  return "NEXT_PUBLIC_BASE_SEPOLIA_COMPETITION_ADDRESS"
}

function competitionAddressFor(chain: Chain): `0x${string}` | null {
  if (chain.id === base.id) return asAddress(process.env.NEXT_PUBLIC_BASE_COMPETITION_ADDRESS)
  if (chain.id === baseSepolia.id) return asAddress(process.env.NEXT_PUBLIC_BASE_SEPOLIA_COMPETITION_ADDRESS)
  return null
}

function usdcAddressFor(chain: Chain): `0x${string}` | null {
  if (chain.id === base.id) {
    return asAddress(process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS) ?? BASE_USDC
  }
  if (chain.id === baseSepolia.id) {
    return asAddress(process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC_ADDRESS) ?? BASE_SEPOLIA_USDC
  }
  return null
}

export function competitionContracts() {
  const chain = competitionChain()
  const competitionAddress = competitionAddressFor(chain)
  const usdcAddress = usdcAddressFor(chain)
  if (!competitionAddress || !usdcAddress) return null

  return {
    chain,
    competitionAddress,
    usdcAddress,
    competition: getContract({ client, chain, address: competitionAddress }),
    usdc: getContract({ client, chain, address: usdcAddress }),
  }
}
