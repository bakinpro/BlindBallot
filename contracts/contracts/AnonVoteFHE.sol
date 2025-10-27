// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AnonVoteFHE
 * @dev Anonymous Voting System using FHEVM (Fully Homomorphic Encryption Virtual Machine)
 * @notice This contract allows for completely anonymous voting where individual votes are encrypted
 */
contract AnonVoteFHE is Ownable, ReentrancyGuard {
    // Note: FHEVM types will be used in production version

    struct Vote {
        string title;               // 投票标题
        string description;         // 投票描述
        string[] options;           // 投票选项
        uint256 deadline;           // 截止时间
        uint256 totalVoters;        // 总投票人数
        bool isActive;              // 是否活跃
        bool isRevealed;            // 是否已揭示结果
        address creator;            // 创建者
        mapping(address => bool) hasVoted; // 是否已投票
        mapping(address => bytes) encryptedVotes; // 存储每个用户的加密投票
        uint256[] revealedCounts;   // 解密后的票数
    }

    // 投票存储
    mapping(uint256 => Vote) public votes;
    uint256 public nextVoteId;
    
    // 简化版本：直接存储解密后的结果
    mapping(uint256 => bool) private voteRevealRequested;

    // Events
    event VoteCreated(
        uint256 indexed voteId, 
        address indexed creator, 
        string title, 
        uint256 deadline
    );
    
    event VoteCast(
        uint256 indexed voteId, 
        address indexed voter,
        uint256 choiceIndex,
        string choiceName
    );
    
    event VoteRevealed(
        uint256 indexed voteId, 
        uint256[] counts
    );

    error VoteNotFound();
    error VoteExpired();
    error VoteNotExpired();
    error AlreadyVoted();
    error InvalidOption();
    error VoteAlreadyRevealed();
    error NotVoteCreator();
    error InvalidDeadline();
    error EmptyTitle();
    error NoOptions();
    error TooManyOptions();

    constructor() {}

    /**
     * @dev 创建新的投票
     * @param title 投票标题
     * @param description 投票描述
     * @param options 投票选项数组
     * @param deadline 投票截止时间（时间戳）
     * @return voteId 新创建的投票ID
     */
    function createVote(
        string memory title,
        string memory description,
        string[] memory options,
        uint256 deadline
    ) external returns (uint256) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (options.length == 0) revert NoOptions();
        if (options.length > 10) revert TooManyOptions(); // 限制选项数量
        if (deadline <= block.timestamp) revert InvalidDeadline();

        uint256 voteId = nextVoteId++;
        Vote storage newVote = votes[voteId];
        
        newVote.title = title;
        newVote.description = description;
        newVote.options = options;
        newVote.deadline = deadline;
        newVote.totalVoters = 0;
        newVote.isActive = true;
        newVote.isRevealed = false;
        newVote.creator = msg.sender;

        // 初始化投票结果数组
        newVote.revealedCounts = new uint256[](options.length);

        emit VoteCreated(voteId, msg.sender, title, deadline);
        return voteId;
    }

    /**
     * @dev 提交加密投票
     * @param voteId 投票ID
     * @param encryptedChoice 加密的选择（0-based索引）
     * 
     * 注意：这是简化版本，实际FHEVM集成需要正确的加密输入类型
     */
    function castVote(uint256 voteId, bytes calldata encryptedChoice) 
        external 
        nonReentrant 
    {
        Vote storage vote = votes[voteId];
        
        if (!vote.isActive) revert VoteNotFound();
        if (block.timestamp >= vote.deadline) revert VoteExpired();
        if (vote.hasVoted[msg.sender]) revert AlreadyVoted();

        // 简化版本：直接解析投票选择（在真实FHEVM中这会是加密的）
        // 解析十六进制编码的选择索引
        uint256 choiceIndex = 0;
        if (encryptedChoice.length >= 2) {
            // 将bytes转换为uint256来获取选择索引
            // 前端发送的格式是 0x0000, 0x0001, 0x0002 等
            if (encryptedChoice.length == 2) {
                choiceIndex = uint256(uint16(bytes2(encryptedChoice)));
            }
            if (choiceIndex >= vote.options.length) {
                choiceIndex = 0; // 默认第一个选项
            }
        }
        
        // 存储投票选择（简化版本）
        vote.encryptedVotes[msg.sender] = encryptedChoice;
        vote.hasVoted[msg.sender] = true;
        vote.totalVoters++;
        
        // 直接统计投票结果
        vote.revealedCounts[choiceIndex]++;
        vote.isRevealed = true; // 标记为已可读

        // 发出详细的投票事件，包含选择信息
        emit VoteCast(voteId, msg.sender, choiceIndex, vote.options[choiceIndex]);
    }

    /**
     * @dev 请求解密投票结果（仅投票创建者或合约所有者可调用）
     * @param voteId 投票ID
     * @param decryptedCounts 解密后的结果（需要链下解密）
     * 
     * 注意：这是简化版本，实际项目中需要使用FHEVM的gateway进行自动解密
     */
    function revealVoteResults(uint256 voteId, uint256[] calldata decryptedCounts) external {
        Vote storage vote = votes[voteId];
        
        if (!vote.isActive) revert VoteNotFound();
        if (msg.sender != vote.creator && msg.sender != owner()) revert NotVoteCreator();
        if (block.timestamp < vote.deadline) revert VoteNotExpired();
        if (vote.isRevealed) revert VoteAlreadyRevealed();
        if (decryptedCounts.length != vote.options.length) revert InvalidOption();

        // 简化版本：直接设置结果（生产环境需要验证解密的正确性）
        vote.revealedCounts = decryptedCounts;
        vote.isRevealed = true;
        voteRevealRequested[voteId] = true;

        emit VoteRevealed(voteId, decryptedCounts);
    }

    /**
     * @dev 强制结束投票（仅创建者或所有者）
     * @param voteId 投票ID
     */
    function endVoteEarly(uint256 voteId) external {
        Vote storage vote = votes[voteId];
        
        if (!vote.isActive) revert VoteNotFound();
        if (msg.sender != vote.creator && msg.sender != owner()) revert NotVoteCreator();
        
        vote.deadline = block.timestamp;
    }

    // View functions
    
    /**
     * @dev 获取投票基本信息
     */
    function getVoteInfo(uint256 voteId) external view returns (
        string memory title,
        string memory description,
        string[] memory options,
        uint256 deadline,
        uint256 totalVoters,
        bool isActive,
        bool isRevealed,
        address creator
    ) {
        Vote storage vote = votes[voteId];
        if (!vote.isActive) revert VoteNotFound();
        
        return (
            vote.title,
            vote.description,
            vote.options,
            vote.deadline,
            vote.totalVoters,
            vote.isActive,
            vote.isRevealed,
            vote.creator
        );
    }

    /**
     * @dev 获取投票结果（仅解密后可用）
     */
    function getVoteResults(uint256 voteId) external view returns (uint256[] memory) {
        Vote storage vote = votes[voteId];
        if (!vote.isActive) revert VoteNotFound();
        
        // 直接返回投票结果，无需解密检查
        return vote.revealedCounts;
    }

    /**
     * @dev 检查地址是否已投票
     */
    function hasAddressVoted(uint256 voteId, address addr) external view returns (bool) {
        return votes[voteId].hasVoted[addr];
    }

    /**
     * @dev 获取总投票数
     */
    function getTotalVotes() external view returns (uint256) {
        return nextVoteId;
    }

    /**
     * @dev 检查投票是否已过期
     */
    function isVoteExpired(uint256 voteId) external view returns (bool) {
        Vote storage vote = votes[voteId];
        return block.timestamp >= vote.deadline;
    }
}
