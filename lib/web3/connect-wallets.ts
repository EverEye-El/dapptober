import { defineChain } from "thirdweb/chains"
import { createWallet, inAppWallet } from "thirdweb/wallets"

const competitionChain = defineChain(Number(process.env.NEXT_PUBLIC_COMPETITION_CHAIN_ID || "84532"))

export const dapptoberConnectWallets = [
  inAppWallet({
    executionMode: {
      mode: "EIP4337",
      smartAccount: {
        chain: competitionChain,
        sponsorGas: true,
      },
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]
