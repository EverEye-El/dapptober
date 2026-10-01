// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// Paid Dapptober agent competition. Likes are not stored here.
contract DapptoberCompetition {
    IERC20 public immutable usdc;
    address public immutable creatorWallet;
    uint64 public immutable voteOpens;
    uint64 public immutable voteCloses;
    address public owner;

    uint256 public constant ENTRY_FEE = 5_000_000;
    uint256 public constant CREATOR_FEE = 1_000_000;
    uint256 public constant POT_SHARE = 4_000_000;

    struct Entry {
        address owner;
        string metadataUri;
        uint256 votes;
        bool exists;
    }

    uint256 public nextEntryId;
    mapping(uint256 => Entry) public entries;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event Registered(uint256 indexed entryId, address indexed owner, string metadataUri);
    event Voted(uint256 indexed entryId, address indexed voter);
    event Finalized(uint256[] entryIds, uint256 share);

    constructor(address usdc_, address creator_, uint64 opens_, uint64 closes_) {
        require(creator_ != address(0), "creator");
        require(closes_ > opens_, "window");
        usdc = IERC20(usdc_);
        creatorWallet = creator_;
        voteOpens = opens_;
        voteCloses = closes_;
        owner = msg.sender;
    }

    function register(string calldata metadataUri) external returns (uint256 id) {
        require(bytes(metadataUri).length > 0, "metadata");
        require(usdc.transferFrom(msg.sender, creatorWallet, CREATOR_FEE), "creator fee");
        require(usdc.transferFrom(msg.sender, address(this), POT_SHARE), "pot");
        id = nextEntryId;
        nextEntryId = id + 1;
        entries[id] = Entry(msg.sender, metadataUri, 0, true);
        emit Registered(id, msg.sender, metadataUri);
    }

    function vote(uint256 entryId) external {
        require(block.timestamp >= voteOpens && block.timestamp < voteCloses, "voting closed");
        Entry storage entry = entries[entryId];
        require(entry.exists, "missing");
        require(!hasVoted[entryId][msg.sender], "already voted");
        hasVoted[entryId][msg.sender] = true;
        entry.votes += 1;
        emit Voted(entryId, msg.sender);
    }

    function depositPot(uint256 amount) external {
        require(amount > 0, "amount");
        require(usdc.transferFrom(msg.sender, address(this), amount), "deposit");
    }

    /// One winner, or a 2–3 way tie. More than three ids reverts so a runoff can happen first.
    function finalize(uint256[] calldata entryIds) external {
        require(msg.sender == owner, "owner");
        require(block.timestamp >= voteCloses, "too early");
        require(entryIds.length >= 1 && entryIds.length <= 3, "tie size");

        uint256 top = entries[entryIds[0]].votes;
        require(top > 0, "no votes");
        for (uint256 i = 0; i < entryIds.length; i++) {
            Entry storage entry = entries[entryIds[i]];
            require(entry.exists, "missing");
            require(entry.votes == top, "not tied for first");
        }

        uint256 share = usdc.balanceOf(address(this)) / entryIds.length;
        require(share > 0, "empty pot");
        for (uint256 i = 0; i < entryIds.length; i++) {
            require(usdc.transfer(entries[entryIds[i]].owner, share), "payout");
        }
        emit Finalized(entryIds, share);
    }
}
