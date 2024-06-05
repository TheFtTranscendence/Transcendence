// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Custom errors
error onlyOwnerError();
error wrongNumberOfPlayers();

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
    event InstanceAdded(uint256 indexed instanceIndex);
    event GameAdded(uint256 indexed instanceIndex, uint256 timestamp, string player1, string player2, uint8 score1, uint8 score2, int8 tournament);
    event TournamentAdded(uint256 indexed instanceIndex, uint8 numberOfPlayers, string[] players);

    struct Game {
        uint256 timestamp;
        string player1;
        string player2;
        uint8 score1;
        uint8 score2;
        int8 tournament;    // -1: not a tournament, then the index of the tournament
    }

    struct Tournament {
        uint8 numberOfPlayers;
        string[] players;
        Game[] games;
    }

    /* ========== STATE VARIABLES ========== */
    uint256 public instanceIndex;
    mapping(uint256 => Game[]) public instancesGame;
    mapping(uint256 => Tournament[]) public instancesTournament;

    /* ========== CONSTRUCTOR ========== */
    constructor() {
        instanceIndex = 0;
    }

    /* ========== SETTER FUNCTIONS ========== */
    function addInstance() public onlyOwner {
        instancesGame[instanceIndex].push();
        instancesTournament[instanceIndex].push();
        instanceIndex++;
        emit InstanceAdded(instanceIndex);
    }

    function addGame(uint256 _instanceIndex, string memory _player1, string memory _player2, uint8 _score1, uint8 _score2, int8 _tournament) public onlyOwner {
        instancesGame[_instanceIndex].push(Game(block.timestamp, _player1, _player2, _score1, _score2, _tournament));
        emit GameAdded(_instanceIndex, block.timestamp, _player1, _player2, _score1, _score2, _tournament);
    }

    function addTournament(uint256 _instanceIndex, string[] memory _players) public onlyOwner {
        // check if the number of players is a power of 2 and in between 0 and 256
        if (_players.length < 2 || _players.length > 256 || (_players.length & (_players.length - 1)) != 0)
            revert wrongNumberOfPlayers();
        instancesTournament[_instanceIndex].push(Tournament(uint8(_players.length), _players, new Game[](0)));
        emit TournamentAdded(instanceIndex, uint8(_players.length), _players);
    }

    /* ========== GETTER FUNCTIONS ========== */

}