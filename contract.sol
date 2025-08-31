// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureSwap is ReentrancyGuard, Pausable, Ownable {
    uint256 private constant PARTY_A_DEPOSITED = 1;
    uint256 private constant PARTY_B_DEPOSITED = 2;
    uint256 private constant COMPLETED = 4;
    uint256 private constant CANCELLED = 8;
    
    struct Escrow {
        address partyA;
        address partyB;
        uint256 amountA;
        uint256 amountB;
        uint256 status;
        uint256 depositDeadline;
        uint256 creationTime;  // FIXED: Separate field for creation time
        string description;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;
    uint256 public nextEscrowId = 1;
    uint256 public serviceFeePercent = 100; // 1%
    
    event EscrowCreated(uint256 indexed escrowId, address indexed partyA, address indexed partyB);
    event FundsDeposited(uint256 indexed escrowId, address indexed depositor);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);
    
    constructor() Ownable(msg.sender) {}
    
    function createEscrow(
        address _partyB,
        uint256 _amountB,
        string memory _description
    ) external payable whenNotPaused nonReentrant {
        require(_partyB != address(0), "Invalid party B");
        require(_partyB != msg.sender, "Cannot escrow with yourself");
        require(msg.value > 0, "Must send funds");
        require(_amountB > 0, "Amount B must be positive");
        
        uint256 escrowId = nextEscrowId++;
        
        escrows[escrowId] = Escrow({
            partyA: msg.sender,
            partyB: _partyB,
            amountA: msg.value,
            amountB: _amountB,
            status: PARTY_A_DEPOSITED,
            depositDeadline: block.timestamp + 1 hours,
            creationTime: block.timestamp,  // FIXED: Store creation time separately
            description: _description
        });
        
        userEscrows[msg.sender].push(escrowId);
        userEscrows[_partyB].push(escrowId);
        
        emit EscrowCreated(escrowId, msg.sender, _partyB);
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
    
    // FIXED: Updated view functions to use separate creationTime field
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
        times[0] = escrows[_id].creationTime;     // FIXED: Use separate field
        times[1] = escrows[_id].depositDeadline;  // deposit deadline
    }
    
    function getEscrowDescription(uint256 _id) external view returns (string memory) {
        return escrows[_id].description;
    }
    
    function getUserEscrows(address _user) external view returns (uint256[] memory) {
        return userEscrows[_user];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function setServiceFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1000, "Fee too high"); // Max 10%
        serviceFeePercent = _feePercent;
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}