import { darkTheme } from "thirdweb/react"
import type {
  ConnectButton_connectModalOptions,
  ConnectButton_detailsModalOptions,
  ConnectButtonProps,
} from "thirdweb/react"
import { competitionChain } from "@/lib/competition/chain"
import { dapptoberConnectWallets } from "@/lib/web3/connect-wallets"

/** Copper / ink palette aligned with app/globals.css */
const copper = "oklch(0.78 0.11 62)"
const copperBright = "oklch(0.88 0.075 74)"
const copperDim = "oklch(0.64 0.075 55)"
const ink = "oklch(0.12 0.012 55)"
const panel = "oklch(0.155 0.014 55)"
const panelRaised = "oklch(0.175 0.014 55 / 0.88)"
const panelHover = "oklch(0.2 0.018 55 / 0.92)"
const chipBg = "oklch(0.14 0.012 55 / 0.88)"
const border = "oklch(0.78 0.11 62 / 0.35)"
const borderDim = "oklch(0.78 0.11 62 / 0.22)"

export const dapptoberThirdwebTheme = darkTheme({
  fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
  colors: {
    primaryText: copperBright,
    secondaryText: copperDim,
    accentText: copperBright,
    modalBg: panel,
    modalOverlayBg: "oklch(0 0 0 / 0.82)",
    borderColor: border,
    separatorLine: borderDim,
    tertiaryBg: panelRaised,
    secondaryButtonBg: chipBg,
    secondaryButtonHoverBg: panelHover,
    secondaryButtonText: copperBright,
    primaryButtonBg: copper,
    primaryButtonText: ink,
    accentButtonBg: copper,
    accentButtonText: ink,
    connectedButtonBg: chipBg,
    connectedButtonBgHover: panelHover,
    secondaryIconColor: copperDim,
    secondaryIconHoverBg: panelHover,
    secondaryIconHoverColor: copperBright,
    selectedTextBg: "oklch(0.78 0.11 62 / 0.22)",
    selectedTextColor: copperBright,
    scrollbarBg: chipBg,
    skeletonBg: panelHover,
    tooltipBg: panel,
    tooltipText: copperBright,
    inputAutofillBg: chipBg,
  },
})

export const dapptoberConnectModalOptions: ConnectButton_connectModalOptions = {
  size: "compact",
  title: "Sign in",
  titleIcon: "",
  showThirdwebBranding: false,
}

export const dapptoberDetailsModalOptions: ConnectButton_detailsModalOptions = {}

const termBtnOutline = "term-btn !text-xs"

/** Shared ConnectButton props: connect, wallet details, network switch, SIWE sign-in modals */
export const dapptoberConnectButtonDefaults: Pick<
  ConnectButtonProps,
  "wallets" | "theme" | "connectModal" | "detailsModal" | "switchButton" | "signInButton" | "chain"
> = {
  chain: competitionChain(),
  wallets: dapptoberConnectWallets,
  theme: dapptoberThirdwebTheme,
  connectModal: dapptoberConnectModalOptions,
  detailsModal: dapptoberDetailsModalOptions,
  switchButton: {
    className: `${termBtnOutline} !w-full !min-h-[50px]`,
  },
  signInButton: {
    className: `${termBtnOutline} !w-full !min-h-[50px]`,
  },
}
