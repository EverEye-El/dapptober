// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DapptoberCompetition} from "../src/DapptoberCompetition.sol";
import {CompetitionDeploy} from "./CompetitionDeploy.sol";

/// Base Sepolia (chain id 84532).
/// Phone signing: ../deploy-base-sepolia.sh
/// Direct broadcast: forge script script/DeployBaseSepolia.s.sol --rpc-url base_sepolia --broadcast --verify
contract DeployBaseSepolia is Script {
    function run() external {
        vm.startBroadcast();
        DapptoberCompetition competition = new DapptoberCompetition(
            CompetitionDeploy.BASE_SEPOLIA_USDC,
            CompetitionDeploy.SERVER_WALLET,
            CompetitionDeploy.BROWSER_WALLET,
            CompetitionDeploy.VOTE_OPENS,
            CompetitionDeploy.VOTE_CLOSES
        );
        vm.stopBroadcast();
        console.log("DapptoberCompetition", address(competition));
    }
}
