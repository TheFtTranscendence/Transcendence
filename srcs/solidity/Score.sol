// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Custom errors
error onlyOwnerError();

/**
 * @title Ownable
 * @notice Define the owner (admin) of a contract and restrict access to some functions.
*/
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner)
            revert onlyOwnerError();
        _;
    }
}

/**
 * @title Score
 * @notice This smart contract is used to store the scores of the pong game developed for the 42 transcendence project.
 * @dev It's important to store the instance index in the database for persistence.
*/
contract Score is Ownable {

    // Custom events

    struct Game {
        uint256 timestamp;
        string player1;
        string player2;
        uint256 score1;
        uint256 score2;
        bool tournament;
    }

    /* ========== STATE VARIABLES ========== */
    uint256 public instanceIndex;
    mapping(uint256 => Game[]) public instances;

    /* ========== CONSTRUCTOR ========== */
    constructor() {
        instanceIndex = 0;
    }

    /* ========== SETTER FUNCTIONS ========== */
    function addInstance() public onlyOwner {
        instances[instanceIndex++].push();
    }

    function addGame(
        uint256 _instance,
        string memory _player1,
        string memory _player2,
        uint256 _score1,
        uint256 _score2,
        bool _tournament
    ) public onlyOwner {
        instances[_instance].push(
            Game({
                timestamp: block.timestamp,
                player1: _player1,
                player2: _player2,
                score1: _score1,
                score2: _score2,
                tournament: _tournament
            })
        );
    }

    /* ========== GETTER FUNCTIONS ========== */
    function getGameCount(uint256 _instance) public view returns (uint256) {
        return instances[_instance].length;
    }

    function getGame(uint256 _instance, uint256 _index)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            uint256,
            bool
        )
    {
        Game memory game = instances[_instance][_index];
        return (
            game.timestamp,
            game.player1,
            game.player2,
            game.score1,
            game.score2,
            game.tournament
        );
    }

    function getGames(uint256 _instance) public view returns (Game[] memory) {
        return instances[_instance];
    }
}