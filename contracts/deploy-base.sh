#!/usr/bin/env bash
# Deploy DapptoberCompetition to Base mainnet through thirdweb.
# https://portal.thirdweb.com/tokens/deploy/deploy-contract
# The CLI authenticates with THIRDWEB_SECRET_KEY. The deploy transaction is signed
# by the wallet you connect in the browser (EverEyeDevz on the phone).
set -euo pipefail
cd "$(dirname "$0")"
export npm_config_cache="${NPM_CONFIG_CACHE:-$HOME/.cache/dapptober-npm}"
mkdir -p "$npm_config_cache"

if [[ -z "${THIRDWEB_SECRET_KEY:-}" ]]; then
  echo "Set THIRDWEB_SECRET_KEY from the thirdweb dashboard. Do not commit it."
  exit 1
fi

cat <<'EOF'
Base (8453). In the thirdweb form, use:

  usdc_       0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  operatorA   0x97c87d662b7d851eCF57BB894AF7BDa1965F7025
  operatorB   0x97EAc0FB351c405FBCb2bB9d94C14c15c5Acaabc
  opens_      1790827200
  closes_     1793941200

Select Base, then Deploy Now. Confirm the signature on the phone.
EOF

exec npx --yes thirdweb@latest deploy -k "$THIRDWEB_SECRET_KEY" --contract -cn DapptoberCompetition
