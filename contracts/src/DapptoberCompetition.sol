// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// Paid Dapptober agent competition. Likes are not stored here.
/// Either operator can finalize, move collected fees into the pot, or withdraw those fees.
contract DapptoberCompetition {
    IERC20 public immutable usdc;
    uint64 public immutable voteOpens;
    uint64 public immutable voteCloses;

    uint256 public constant ENTRY_FEE = 5_000_000;
    uint256 public constant CREATOR_FEE = 1_000_000;
    uint256 public constant POT_SHARE = 4_000_000;

    /// Host wallet. Can register without paying the entry fee.
    address public constant HOST = 0x97EAc0FB351c405FBCb2bB9d94C14c15c5Acaabc;

    struct Entry {
        address owner;
        string metadataUri;
        uint256 votes;
        bool exists;
    }

    uint256 public nextEntryId;
    uint256 public pot;
    uint256 public creatorFees;
    mapping(address => bool) public isOperator;
    mapping(uint256 => Entry) public entries;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event Registered(uint256 indexed entryId, address indexed owner, string metadataUri);
    event Voted(uint256 indexed entryId, address indexed voter);
    event Finalized(uint256[] entryIds, uint256 share);
    event FeesAddedToPot(address indexed operator, uint256 amount);
    event FeesWithdrawn(address indexed operator, address indexed to, uint256 amount);

    constructor(address usdc_, address operatorA, address operatorB, uint64 opens_, uint64 closes_) {
        require(operatorA != address(0) && operatorB != address(0), "operator");
        require(closes_ > opens_, "window");
        usdc = IERC20(usdc_);
        voteOpens = opens_;
        voteCloses = closes_;
        isOperator[operatorA] = true;
        isOperator[operatorB] = true;
    }

    modifier onlyOperator() {
        require(isOperator[msg.sender], "operator");
        _;
    }

    function entryFeeFor(address account) external pure returns (uint256) {
        return account == HOST ? 0 : ENTRY_FEE;
    }

    function register(string calldata metadataUri) external returns (uint256 id) {
        require(bytes(metadataUri).length > 0, "metadata");
        if (msg.sender != HOST) {
            require(usdc.transferFrom(msg.sender, address(this), ENTRY_FEE), "fee");
            pot += POT_SHARE;
            creatorFees += CREATOR_FEE;
        }
        id = nextEntryId;
        nextEntryId = id + 1;
        entries[id] = Entry({ owner: msg.sender, metadataUri: metadataUri, votes: 0, exists: true });
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

    /// Extra USDC from whichever wallet sends it. Entry fees do not use this.
    function depositPot(uint256 amount) external {
        require(amount > 0, "amount");
        require(usdc.transferFrom(msg.sender, address(this), amount), "deposit");
        pot += amount;
    }

    function addFeesToPot(uint256 amount) external onlyOperator {
        require(amount > 0 && amount <= creatorFees, "fees");
        creatorFees -= amount;
        pot += amount;
        emit FeesAddedToPot(msg.sender, amount);
    }

    function withdrawFees(address to, uint256 amount) external onlyOperator {
        require(to != address(0), "to");
        require(amount > 0 && amount <= creatorFees, "fees");
        creatorFees -= amount;
        require(usdc.transfer(to, amount), "withdraw");
        emit FeesWithdrawn(msg.sender, to, amount);
    }

    /// One winner, or a 2–3 way tie. More than three ids reverts so a runoff can happen first.
    function finalize(uint256[] calldata entryIds) external onlyOperator {
        require(block.timestamp >= voteCloses, "too early");
        require(entryIds.length >= 1 && entryIds.length <= 3, "tie size");

        uint256 top = entries[entryIds[0]].votes;
        require(top > 0, "no votes");
        for (uint256 i = 0; i < entryIds.length; i++) {
            Entry storage entry = entries[entryIds[i]];
            require(entry.exists, "missing");
            require(entry.votes == top, "not tied for first");
        }

        uint256 share = pot / entryIds.length;
        require(share > 0, "empty pot");
        pot -= share * entryIds.length;
        for (uint256 i = 0; i < entryIds.length; i++) {
            require(usdc.transfer(entries[entryIds[i]].owner, share), "payout");
        }
        emit Finalized(entryIds, share);
    }
}
