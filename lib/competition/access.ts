function asAddress(value: string | undefined): `0x${string}` | null {
  const trimmed = value?.trim().toLowerCase()
  if (!trimmed?.startsWith("0x") || trimmed.length !== 42) return null
  return trimmed as `0x${string}`
}

/** Browser wallet that can open the Owner controls. Same powers as the server wallet. */
export function competitionAdminAddress() {
  return asAddress(process.env.NEXT_PUBLIC_COMPETITION_ADMIN)
}

/** Server wallet. Same powers on the contract as the browser wallet. */
export function competitionOwnerAddress() {
  return asAddress(process.env.NEXT_PUBLIC_COMPETITION_OWNER)
}

export function isCompetitionOperator(address: string) {
  const normalized = address.toLowerCase()
  return normalized === competitionAdminAddress() || normalized === competitionOwnerAddress()
}

/** EverEyeDevz. The mainnet contract lets this wallet register without the USDC fee. */
export function isCompetitionHost(address: string) {
  return address.toLowerCase() === competitionAdminAddress()
}
