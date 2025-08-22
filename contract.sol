// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DecentralizedEscrow
 * @dev Ultra-optimized escrow contract for Remix deployment
 * Stack depth optimized with minimal local variables
 */
contract DecentralizedEscrow {
    
    address public owner;
    bool public paused;
    uint256 private _status = 1;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }
    
    modifier nonReentrant() {
        require(_status == 1, "Reentrant");
        _status = 2;
        _;
        _status = 1;
    }
    
    struct Escrow {
        address partyA;
        address partyB;
        uint256 amountA;
        uint256 amountB;
        uint256 status; // Packed: bit 0-7 flags, bit 8-63 timestamps
        uint256 depositDeadline; // Deposit deadline timestamp
        string description;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;
    
    uint256 public nextEscrowId = 1;
    uint256 public serviceFeePercent = 25; // 0.25%
    
    // Status bit positions
    uint256 constant PARTY_A_DEPOSITED = 1;
    uint256 constant PARTY_B_DEPOSITED = 2;
    uint256 constant COMPLETED = 4;
    uint256 constant CANCELLED = 8;
    
    event EscrowCreated(uint256 indexed id, address indexed partyA, address indexed partyB);
    event FundsDeposited(uint256 indexed id, address indexed depositor);
    event EscrowCompleted(uint256 indexed id);
    event EscrowCancelled(uint256 indexed id);
    
    constructor() {
        owner = msg.sender;
    }
    
    function createEscrow(
        address _partyB,
        uint256 _amountB,
        string calldata _description
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        require(_partyB != address(0) && _partyB != msg.sender, "Invalid party B");
        require(msg.value > 0 && _amountB > 0, "Invalid amounts");
        
        uint256 id = nextEscrowId++;
        
        escrows[id] = Escrow({
            partyA: msg.sender,
            partyB: _partyB,
            amountA: msg.value,
            amountB: _amountB,
            status: PARTY_A_DEPOSITED | (block.timestamp << 8),
            depositDeadline: block.timestamp + 300, // 5 minutes deadline
            description: _description
        });
        
        userEscrows[msg.sender].push(id);
        userEscrows[_partyB].push(id);
        
        emit EscrowCreated(id, msg.sender, _partyB);
        emit FundsDeposited(id, msg.sender);
        
        return id;
    }
    
    function depositFunds(uint256 _id) external payable whenNotPaused nonReentrant {
        require(msg.sender == escrows[_id].partyB, "Not party B");
        require(!(escrows[_id].status & PARTY_B_DEPOSITED != 0), "Already deposited");
        require(msg.value == escrows[_id].amountB, "Wrong amount");
        require(block.timestamp <= escrows[_id].depositDeadline, "Deadline passed");
        
        escrows[_id].status |= PARTY_B_DEPOSITED;
        
        emit FundsDeposited(_id, msg.sender);
        
        // Automatically complete the escrow after 30 seconds
        _scheduleCompletion(_id);
    }
    
    function _scheduleCompletion(uint256 _id) internal {
        // In a real implementation, you might use a timer or external trigger
        // For now, we'll complete immediately since this is a demo
        _completeEscrow(_id);
    }
    
    function cancelEscrow(uint256 _id) external nonReentrant {
        require(msg.sender == escrows[_id].partyA || msg.sender == escrows[_id].partyB, "Not authorized");
        require(!(escrows[_id].status & (COMPLETED | CANCELLED) != 0), "Already finalized");
        
        bool canCancel = false;
        
        // Party A can cancel if Party B hasn't deposited and deadline passed
        if (!(escrows[_id].status & PARTY_B_DEPOSITED != 0) && 
            block.timestamp > escrows[_id].depositDeadline) {
            canCancel = true;
        }
        
        // Party B can cancel if they haven't deposited and deadline passed
        if (!(escrows[_id].status & PARTY_B_DEPOSITED != 0) && 
            block.timestamp > escrows[_id].depositDeadline) {
            canCancel = true;
        }
        
        require(canCancel, "Cannot cancel");
        
        escrows[_id].status |= CANCELLED;
        
        if (escrows[_id].status & PARTY_A_DEPOSITED != 0) {
            payable(escrows[_id].partyA).transfer(escrows[_id].amountA);
        }
        if (escrows[_id].status & PARTY_B_DEPOSITED != 0) {
            payable(escrows[_id].partyB).transfer(escrows[_id].amountB);
        }
        
        emit EscrowCancelled(_id);
    }
    
    function manualCompleteEscrow(uint256 _id) external whenNotPaused {
        require(msg.sender == escrows[_id].partyA || msg.sender == escrows[_id].partyB, "Not authorized");
        require(escrows[_id].status & PARTY_A_DEPOSITED != 0, "Party A not deposited");
        require(escrows[_id].status & PARTY_B_DEPOSITED != 0, "Party B not deposited");
        require(escrows[_id].status & COMPLETED == 0, "Already completed");
        require(escrows[_id].status & CANCELLED == 0, "Already cancelled");
        
        _completeEscrow(_id);
    }
    
    function _completeEscrow(uint256 _id) internal {
        escrows[_id].status |= COMPLETED;
        
        uint256 feeA = (escrows[_id].amountA * serviceFeePercent) / 10000;
        uint256 feeB = (escrows[_id].amountB * serviceFeePercent) / 10000;
        
        // Calculate amounts to transfer (after fees)
        uint256 amountToPartyA = escrows[_id].amountB - feeB;
        uint256 amountToPartyB = escrows[_id].amountA - feeA;
        
        // Transfer funds to Party A (gets Party B's amount minus fee)
        bool successA = payable(escrows[_id].partyA).send(amountToPartyA);
        require(successA, "Transfer to Party A failed");
        
        // Transfer funds to Party B (gets Party A's amount minus fee)
        bool successB = payable(escrows[_id].partyB).send(amountToPartyB);
        require(successB, "Transfer to Party B failed");
        
        emit EscrowCompleted(_id);
    }
    
    // View functions with minimal stack usage
    function getEscrowParties(uint256 _id) external view returns (address, address) {
        return (escrows[_id].partyA, escrows[_id].partyB);
    }
    
    function getEscrowAmounts(uint256 _id) external view returns (uint256, uint256) {
        return (escrows[_id].amountA, escrows[_id].amountB);
    }
    
    function getEscrowFlags(uint256 _id) external view returns (bool[4] memory flags) {
        uint256 status = escrows[_id].status;
        flags[0] = (status & PARTY_A_DEPOSITED) != 0;
        flags[1] = (status & PARTY_B_DEPOSITED) != 0;
        flags[2] = (status & COMPLETED) != 0;
        flags[3] = (status & CANCELLED) != 0;
    }
    
    function getEscrowTimes(uint256 _id) external view returns (uint256[2] memory times) {
        times[0] = escrows[_id].status >> 8; // creation time
        times[1] = escrows[_id].depositDeadline; // deposit deadline
    }
    
    function getEscrowDescription(uint256 _id) external view returns (string memory) {
        return escrows[_id].description;
    }
    
    function getUserEscrows(address _user) external view returns (uint256[] memory) {
        return userEscrows[_user];
    }
    
    function getContractStats() external view returns (uint256[4] memory stats) {
        stats[0] = nextEscrowId - 1; // total
        
        for (uint256 i = 1; i < nextEscrowId; i++) {
            uint256 status = escrows[i].status;
            if (status & COMPLETED != 0) {
                stats[2]++; // completed
            } else if (status & CANCELLED != 0) {
                stats[3]++; // cancelled
            } else {
                stats[1]++; // active
            }
        }
    }
    
    // Owner functions
    function setServiceFee(uint256 _fee) external onlyOwner {
        require(_fee <= 500, "Fee too high");
        serviceFeePercent = _fee;
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees");
        payable(owner).transfer(balance);
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid owner");
        owner = _newOwner;
    }
}