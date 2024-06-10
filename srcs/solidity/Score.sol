// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Custom errors
error onlyOwnerError();
error wrongInstanceIndex();
error wrongNumberOfPlayers();
error wrongTournamentIndex();
error AlreadyInTournament();
error tournamentNotFinished();
error tournamentAlreadyFinished();

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
    event PlayerLost(uint256 indexed instanceIndex, uint256 tournamentIndex, string player);

    struct Game {
        uint256 timestamp;
        string player1;
        string player2;
        uint8 score1;
        uint8 score2;
        int8 tournamentIndex;    // -1: not a tournament, then the index of the tournament
    }

    struct Tournament {
        uint8 numberOfPlayers;
        string[] players;
        uint8 numberOfGames;
        string[] reversedRanking;       // index 0 is the looser, last index is the winner
        Game[] games;
        bool finished;
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
    /**
        * @notice Add a new instance to the database.
        * @dev Returns the index of the new instance. Starting from 0.
    **/
    function addInstance() public onlyOwner returns (uint256){
        emit InstanceAdded(instanceIndex);
        instanceIndex++;
        return instanceIndex - 1;
    }

    /**
        * @notice Add a new game to the database.
        * @param _instanceIndex The index of the instance in the database.
        * @param _player1 The name of the first player.
        * @param _player2 The name of the second player.
        * @param _score1 The score of the first player.
        * @param _score2 The score of the second player.
        * @dev The tournament index is -1 if it's not a tournament, otherwise it's the index of the tournament.
    **/
    function addGame(uint256 _instanceIndex, string memory _player1, string memory _player2, uint8 _score1, uint8 _score2) public onlyOwner {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        instancesGame[_instanceIndex].push(Game(block.timestamp, _player1, _player2, _score1, _score2, -1));

        emit GameAdded(_instanceIndex, block.timestamp, _player1, _player2, _score1, _score2, -1);
    }

    /**
        * @notice Add a new 4 or 8 players tournament to the database.
        * @param _instanceIndex The index of the instance in the database.
        * @param _players The list of players in the tournament. 4 or 8 players only.
        * @dev The number of players must be a power of 2 and in between 2 and 256. So can only launch a tournament with 2, 4, 8, 16, 32, 64, 128 or 256 players.
    **/
    function addTournament(uint256 _instanceIndex, string[] memory _players) public onlyOwner {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        // check if the number of players is correct
        if (_players.length != 4 || _players.length != 8)
            revert wrongNumberOfPlayers();
        // check if a tournament is not already in progress
        if (instancesTournament[_instanceIndex].length > 0) {
            if (instancesTournament[_instanceIndex][instancesTournament[_instanceIndex].length - 1].finished == false)
                revert AlreadyInTournament();
        }

        Tournament storage newTournament = instancesTournament[_instanceIndex].push();
        newTournament.numberOfPlayers = uint8(_players.length);
        newTournament.numberOfGames = uint8(_players.length - 1);
        for (uint256 i = 0; i < _players.length; i++) {
            newTournament.players.push(_players[i]);
        }

        emit TournamentAdded(instanceIndex, uint8(_players.length), _players);
    }

    function addGameToTournament(uint256 _instanceIndex, uint8 _tournamentIndex, string memory _player1, string memory _player2, uint8 _score1, uint8 _score2) public onlyOwner {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (_tournamentIndex < 0 || _tournamentIndex >= instancesTournament[_instanceIndex].length)
            revert wrongTournamentIndex();
        if (instancesTournament[_instanceIndex][_tournamentIndex].finished)
            revert tournamentAlreadyFinished();

        instancesTournament[_instanceIndex][_tournamentIndex].games.push(Game(block.timestamp, _player1, _player2, _score1, _score2, int8(_tournamentIndex)));
        // also add the game to the general list
        instancesGame[_instanceIndex].push(Game(block.timestamp, _player1, _player2, _score1, _score2, int8(_tournamentIndex)));

        emit GameAdded(_instanceIndex, block.timestamp, _player1, _player2, _score1, _score2, int8(_tournamentIndex));

        // add the looser to the reversedRanking
        if (_score1 > _score2)
            instancesTournament[_instanceIndex][_tournamentIndex].reversedRanking.push(_player2);
        else
            instancesTournament[_instanceIndex][_tournamentIndex].reversedRanking.push(_player1);

        emit PlayerLost(_instanceIndex, _tournamentIndex, _score1 > _score2 ? _player2 : _player1);

        // check if the tournament is finished
        if (instancesTournament[_instanceIndex][_tournamentIndex].games.length == instancesTournament[_instanceIndex][_tournamentIndex].numberOfGames) {
            instancesTournament[_instanceIndex][_tournamentIndex].finished = true;
        }
    }

    /* ========== GETTER FUNCTIONS ========== */

    // fetching games and tournaments
    function getNumberOfGames(uint256 _instanceIndex) public view returns (uint256) {
        return instancesGame[_instanceIndex].length;
    }

    function getNumberOfTournaments(uint256 _instanceIndex) public view returns (uint256) {
        return instancesTournament[_instanceIndex].length;
    }

    /**
        * @notice Get all the games of an instance.
    **/
    function getGames(uint256 _instanceIndex) public view returns (Game[] memory) {
        return instancesGame[_instanceIndex];
    }

    function getTournament(uint256 _instanceIndex, uint256 _tournamentIndex) public view returns (Tournament memory) {
        return instancesTournament[_instanceIndex][_tournamentIndex];
    }

    function getTournaments(uint256 _instanceIndex) public view returns (Tournament[] memory) {
        return instancesTournament[_instanceIndex];
    }

    function getTournamentGame(uint256 _instanceIndex, uint256 _tournamentIndex, uint256 _gameIndex) public view returns (Game memory) {
        return instancesTournament[_instanceIndex][_tournamentIndex].games[_gameIndex];
    }

    function getTournamentGames(uint256 _instanceIndex, uint256 _tournamentIndex) public view returns (Game[] memory) {
        return instancesTournament[_instanceIndex][_tournamentIndex].games;
    }

    // fetching next game to play
    function getNextPlayersTournament(uint256 _instanceIndex, uint256 _tournamentIndex) public view returns (string memory, string memory) {
        if (_tournamentIndex < 0 || _tournamentIndex >= instancesTournament[_instanceIndex].length)
            revert wrongTournamentIndex();
        if (instancesTournament[_instanceIndex][_tournamentIndex].games.length >= instancesTournament[_instanceIndex][_tournamentIndex].numberOfGames)
            revert tournamentAlreadyFinished();

        // need to write the logic to get the next players to play
        return (instancesTournament[_instanceIndex][_tournamentIndex].players[0], instancesTournament[_instanceIndex][_tournamentIndex].players[1]);
    }

    // fetching the ranking of a tournament
    function getRankingTournament(uint256 _instanceIndex, uint256 _tournamentIndex) public view returns (string[] memory) {
        if (_tournamentIndex < 0 || _tournamentIndex >= instancesTournament[_instanceIndex].length)
            revert wrongTournamentIndex();
        if (instancesTournament[_instanceIndex][_tournamentIndex].games.length < instancesTournament[_instanceIndex][_tournamentIndex].numberOfGames)
            revert tournamentNotFinished();

        return instancesTournament[_instanceIndex][_tournamentIndex].reversedRanking;
    }

}