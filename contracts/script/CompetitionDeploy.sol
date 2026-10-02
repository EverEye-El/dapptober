// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// Shared constructor arguments. Chain scripts only swap the USDC address.
library CompetitionDeploy {
    address internal constant SERVER_WALLET = 0x97c87d662b7d851eCF57BB894AF7BDa1965F7025;
    address internal constant BROWSER_WALLET = 0x97EAc0FB351c405FBCb2bB9d94C14c15c5Acaabc;

    /// Oct 1 2026 00:00 US Eastern.
    uint64 internal constant VOTE_OPENS = 1790827200;
    /// Nov 6 2026 00:00 US Eastern. Voting includes all of November 5.
    uint64 internal constant VOTE_CLOSES = 1793941200;

    address internal constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    address internal constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
}
