import { createWallet, inAppWallet } from "thirdweb/wallets"
import { competitionChain } from "@/lib/competition/chain"

const chain = competitionChain()

export const dapptoberConnectWallets = [
  inAppWallet({
    executionMode: {
      mode: "EIP4337",
      smartAccount: {
        chain,
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
