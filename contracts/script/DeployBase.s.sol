// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DapptoberCompetition} from "../src/DapptoberCompetition.sol";
import {CompetitionDeploy} from "./CompetitionDeploy.sol";

/// Base mainnet (chain id 8453).
/// Phone signing: ../deploy-base.sh
/// Direct broadcast: forge script script/DeployBase.s.sol --rpc-url base --broadcast --verify
contract DeployBase is Script {
    function run() external {
        vm.startBroadcast();
        DapptoberCompetition competition = new DapptoberCompetition(
            CompetitionDeploy.BASE_USDC,
            CompetitionDeploy.SERVER_WALLET,
            CompetitionDeploy.BROWSER_WALLET,
            CompetitionDeploy.VOTE_OPENS,
            CompetitionDeploy.VOTE_CLOSES
        );
        vm.stopBroadcast();
        console.log("DapptoberCompetition", address(competition));
    }
}
