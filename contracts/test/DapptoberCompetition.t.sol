// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DapptoberCompetition} from "../src/DapptoberCompetition.sol";

contract MockUSDC {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract DapptoberCompetitionTest is Test {
    MockUSDC internal usdc;
    DapptoberCompetition internal competition;
    address internal serverWallet = address(0xA11CE);
    address internal browserWallet = address(0xB0B);
    address internal entrant = address(0xE1);
    address internal stranger = address(0xBAD);

    function setUp() public {
        usdc = new MockUSDC();
        competition = new DapptoberCompetition(
            address(usdc),
            serverWallet,
            browserWallet,
            uint64(block.timestamp - 1),
            uint64(block.timestamp + 7 days)
        );
        usdc.mint(entrant, 5_000_000);
        vm.prank(entrant);
        usdc.approve(address(competition), type(uint256).max);
    }

    function testRegisterSplitsPotAndCollectedFees() public {
        vm.prank(entrant);
        uint256 id = competition.register("ipfs://agent");
        assertEq(id, 0);
        assertEq(competition.pot(), 4_000_000);
        assertEq(competition.creatorFees(), 1_000_000);
        assertEq(usdc.balanceOf(address(competition)), 5_000_000);
    }

    function testEitherOperatorCanMoveCollectedFees() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");

        vm.prank(browserWallet);
        competition.addFeesToPot(400_000);
        assertEq(competition.pot(), 4_400_000);
        assertEq(competition.creatorFees(), 600_000);

        vm.prank(serverWallet);
        competition.withdrawFees(serverWallet, 600_000);
        assertEq(competition.creatorFees(), 0);
        assertEq(usdc.balanceOf(serverWallet), 600_000);
        assertEq(competition.pot(), 4_400_000);
    }

    function testStrangerCannotMoveFeesOrFinalize() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        vm.prank(stranger);
        vm.expectRevert(bytes("operator"));
        competition.addFeesToPot(1);
        vm.prank(stranger);
        vm.expectRevert(bytes("operator"));
        competition.withdrawFees(stranger, 1);

        vm.prank(entrant);
        competition.vote(0);
        vm.warp(block.timestamp + 8 days);
        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        vm.prank(stranger);
        vm.expectRevert(bytes("operator"));
        competition.finalize(ids);
    }

    function testEitherOperatorCanFinalizeWithoutPayingCollectedFees() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        vm.prank(stranger);
        competition.vote(0);

        vm.warp(block.timestamp + 8 days);
        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        vm.prank(browserWallet);
        competition.finalize(ids);

        assertEq(usdc.balanceOf(entrant), 4_000_000);
        assertEq(competition.pot(), 0);
        assertEq(competition.creatorFees(), 1_000_000);
        assertEq(usdc.balanceOf(address(competition)), 1_000_000);
    }

    function testServerWalletCanFinalize() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        vm.prank(browserWallet);
        competition.vote(0);
        vm.warp(block.timestamp + 8 days);
        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        vm.prank(serverWallet);
        competition.finalize(ids);
        assertEq(usdc.balanceOf(entrant), 4_000_000);
    }

    function testVoteOnceAndOnlyInsideTheWindow() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        vm.prank(browserWallet);
        competition.vote(0);
        vm.prank(browserWallet);
        vm.expectRevert(bytes("already voted"));
        competition.vote(0);

        vm.warp(block.timestamp + 8 days);
        vm.prank(serverWallet);
        vm.expectRevert(bytes("voting closed"));
        competition.vote(0);
    }

    function testTwoWayTieSplitsPotAndFourWayTieReverts() public {
        _enter(entrant, "ipfs://a");
        address second = address(0xE2);
        _enter(second, "ipfs://b");
        vm.prank(browserWallet);
        competition.vote(0);
        vm.prank(serverWallet);
        competition.vote(1);

        vm.warp(block.timestamp + 8 days);
        uint256[] memory tied = new uint256[](2);
        tied[0] = 0;
        tied[1] = 1;
        vm.prank(browserWallet);
        competition.finalize(tied);
        assertEq(usdc.balanceOf(entrant), 9_000_000);
        assertEq(usdc.balanceOf(second), 4_000_000);
        assertEq(competition.creatorFees(), 2_000_000);

        DapptoberCompetition fresh = new DapptoberCompetition(
            address(usdc),
            serverWallet,
            browserWallet,
            uint64(block.timestamp - 1),
            uint64(block.timestamp + 1 days)
        );
        for (uint256 i = 0; i < 4; i++) {
            address who = address(uint160(0xF0 + i));
            usdc.mint(who, 5_000_000);
            vm.startPrank(who);
            usdc.approve(address(fresh), type(uint256).max);
            fresh.register("ipfs://agent");
            vm.stopPrank();
            vm.prank(address(uint160(0xD0 + i)));
            fresh.vote(i);
        }
        vm.warp(block.timestamp + 2 days);
        uint256[] memory four = new uint256[](4);
        four[0] = 0;
        four[1] = 1;
        four[2] = 2;
        four[3] = 3;
        vm.prank(serverWallet);
        vm.expectRevert(bytes("tie size"));
        fresh.finalize(four);
    }

    function testFinalizeTooEarlyAndEmptyMetadataRevert() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        vm.prank(browserWallet);
        competition.vote(0);
        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        vm.prank(browserWallet);
        vm.expectRevert(bytes("too early"));
        competition.finalize(ids);

        vm.prank(entrant);
        vm.expectRevert(bytes("metadata"));
        competition.register("");
    }

    function testDepositAddsToPotAndFullFeeWithdrawGoesToBrowserWallet() public {
        vm.prank(entrant);
        competition.register("ipfs://agent");
        usdc.mint(browserWallet, 100_000_000);
        vm.startPrank(browserWallet);
        usdc.approve(address(competition), 100_000_000);
        competition.depositPot(100_000_000);
        competition.withdrawFees(browserWallet, 1_000_000);
        vm.stopPrank();
        assertEq(competition.pot(), 104_000_000);
        assertEq(competition.creatorFees(), 0);
        assertEq(usdc.balanceOf(browserWallet), 1_000_000);
    }

    function _enter(address who, string memory uri) internal {
        usdc.mint(who, 5_000_000);
        vm.startPrank(who);
        usdc.approve(address(competition), type(uint256).max);
        competition.register(uri);
        vm.stopPrank();
    }
}
