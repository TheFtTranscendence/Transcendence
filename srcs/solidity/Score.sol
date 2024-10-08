// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Custom errors
error onlyOwnerError();
error onlyPongyFightyError();
error wrongInstanceIndex();
error wrongNumberOfPlayers();
error wrongTournamentIndex();
error ongoingTournament();
error noCurrentTournament();
error wrongPlayers();

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
    * @dev It's important to store the instance index in the database alongside users credentials for persistence.
*/
contract Score is Ownable {

    // Custom events
    event InstanceAdded(uint256 indexed instanceIndex);
    event GameAdded(uint256 indexed instanceIndex, string gameType, uint256 timestamp, string player1, string player2, uint8 score1, uint8 score2, int256 tournamentIndex);
    event TournamentAdded(uint256 indexed instanceIndex, string gameType, uint8 numberOfPlayers, string[] players);

    struct Game {
        uint256 timestamp;
        string player1;
        string player2;
        uint8 score1;
        uint8 score2;
        int256 tournamentIndex;    // -1: not a tournament, then the index of the tournament
    }

    struct Tournament {
        uint8 numberOfPlayers;
        string[] players;
        uint8 numberOfGames;
        string[] reversedRanking;       // index 0 is the looser, last index is the winner
        Game[] games;
        bool finished;
    }

    enum GameType { PONGY, FIGHTY }

    /* ========== STATE VARIABLES ========== */
    uint256 private instanceIndex;
    mapping(string => mapping(uint256 => Game[])) private instancesGame;
    mapping(string => mapping(uint256 => Tournament[])) private instancesTournament;

    /* ========== CONSTRUCTOR ========== */
    constructor() {
        instanceIndex = 0;
    }

    /* ========== MODIFIERS ========== */
    modifier onlyPongyFighty(string calldata _gameType) {
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        _;
    }

    /* ========== SETTER FUNCTIONS ========== */
    /**
        * @notice Add a new instance to the database.
    **/
    function addInstance() public onlyOwner {
        emit InstanceAdded(instanceIndex);
        instanceIndex++;
    }

    /**
        * @notice Add a new game to the database.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @param _player1 The name of the first player.
        * @param _player2 The name of the second player.
        * @param _score1 The score of the first player.
        * @param _score2 The score of the second player.
        * @dev The tournament index is -1 if it's not a tournament, otherwise it's the index of the tournament.
    **/
    function addGame(uint256 _instanceIndex, string calldata _gameType, string memory _player1, string memory _player2, uint8 _score1, uint8 _score2) public onlyOwner onlyPongyFighty(_gameType) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        instancesGame[_gameType][_instanceIndex].push(Game(block.timestamp, _player1, _player2, _score1, _score2, -1));

        emit GameAdded(_instanceIndex, _gameType, block.timestamp, _player1, _player2, _score1, _score2, -1);
    }

    /**
        * @notice Add a new 4 or 8 players tournament to the database.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @param _players The list of players in the tournament. 4 or 8 players only.
        * @dev Only one tournament can be in progress at a time.
    **/
    function addTournament(uint256 _instanceIndex, string calldata _gameType, string[] memory _players) public onlyOwner onlyPongyFighty(_gameType) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        // check if the number of players is correct
        if (_players.length != 4 && _players.length != 8)
            revert wrongNumberOfPlayers();
        // check if a tournament is not already in progress
        if (instancesTournament[_gameType][_instanceIndex].length > 0) {
            if (instancesTournament[_gameType][_instanceIndex][instancesTournament[_gameType][_instanceIndex].length - 1].finished == false)
                revert ongoingTournament();
        }

        Tournament storage newTournament = instancesTournament[_gameType][_instanceIndex].push();
        newTournament.numberOfPlayers = uint8(_players.length);
        newTournament.numberOfGames = uint8(_players.length - 1);
        for (uint256 i = 0; i < _players.length; i++) {
            newTournament.players.push(_players[i]);
        }

        emit TournamentAdded(_instanceIndex, _gameType, uint8(_players.length), _players);
    }

    /**
        * @notice Add a game to the current tournament.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @param _player1 The name of the first player.
        * @param _player2 The name of the second player.
        * @param _score1 The score of the first player.
        * @param _score2 The score of the second player.
        * @dev checks for instance, tournament flag, expected players. Then add the game, handle ranking and check if the tournament is finished.
    **/
    function addTournamentGame(uint256 _instanceIndex, string calldata _gameType, string memory _player1, string memory _player2, uint8 _score1, uint8 _score2) public onlyOwner onlyPongyFighty(_gameType) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
            
        uint256 _tournamentIndex = getCurrentTournamentIndex(_instanceIndex, _gameType);
        
        if (instancesTournament[_gameType][_instanceIndex][_tournamentIndex].finished)
            revert noCurrentTournament();

        // check expected players
        (string memory expectedPlayer1, string memory expectedPlayer2) = getNextTournamentPlayers(_instanceIndex, _gameType);
        if (keccak256(abi.encodePacked(expectedPlayer1)) != keccak256(abi.encodePacked(_player1)) || keccak256(abi.encodePacked(expectedPlayer2)) != keccak256(abi.encodePacked(_player2)))
            revert wrongPlayers();

        instancesTournament[_gameType][_instanceIndex][_tournamentIndex].games.push(Game(block.timestamp, _player1, _player2, _score1, _score2, int256(_tournamentIndex)));
        // also add the game to the general list
        instancesGame[_gameType][_instanceIndex].push(Game(block.timestamp, _player1, _player2, _score1, _score2, int256(_tournamentIndex)));

        emit GameAdded(_instanceIndex, _gameType, block.timestamp, _player1, _player2, _score1, _score2, int256(_tournamentIndex));

        // add the looser to the reversedRanking
        if (_score1 > _score2)
            instancesTournament[_gameType][_instanceIndex][_tournamentIndex].reversedRanking.push(_player2);
        else
            instancesTournament[_gameType][_instanceIndex][_tournamentIndex].reversedRanking.push(_player1);

        // check if the tournament is finished
        if (instancesTournament[_gameType][_instanceIndex][_tournamentIndex].games.length == instancesTournament[_gameType][_instanceIndex][_tournamentIndex].numberOfGames) {
            // add the winner to the reversedRanking
            if (_score1 > _score2)
                instancesTournament[_gameType][_instanceIndex][_tournamentIndex].reversedRanking.push(_player1);
            else
                instancesTournament[_gameType][_instanceIndex][_tournamentIndex].reversedRanking.push(_player2);
            instancesTournament[_gameType][_instanceIndex][_tournamentIndex].finished = true;
        }
    }

    /* ========== GETTER FUNCTIONS ========== */

    /**
        * @notice Get all the games of an instance.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The games of the instance.
    **/
    function getGames(uint256 _instanceIndex, string calldata _gameType) public view returns (Game[] memory) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        return instancesGame[_gameType][_instanceIndex];
    }

    /**
        * @notice Get the current tournament status.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The status of the current tournament.
    */
    function getTournamentStatus(uint256 _instanceIndex, string calldata _gameType) public view returns (bool) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        if (instancesTournament[_gameType][_instanceIndex].length == 0)
            return false;
        return !instancesTournament[_gameType][_instanceIndex][instancesTournament[_gameType][_instanceIndex].length - 1].finished;
   }

    /**
        * @notice Get the current tournament players list.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The names of the players.
    */
    function getCurrentTournamentPlayersList(uint256 _instanceIndex, string calldata _gameType) public view returns (string[] memory) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        uint256 _tournamentIndex = getCurrentTournamentIndex(_instanceIndex, _gameType);
        if (instancesTournament[_gameType][_instanceIndex][_tournamentIndex].finished)
            revert noCurrentTournament();

        return instancesTournament[_gameType][_instanceIndex][_tournamentIndex].players;
    }

    /**
        * @notice Get the next players of a tournament.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The names of the next players.
    */
    function getNextTournamentPlayers(uint256 _instanceIndex, string calldata _gameType) public view returns (string memory, string memory) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();

        Tournament memory currentTournament = instancesTournament[_gameType][_instanceIndex][getCurrentTournamentIndex(_instanceIndex, _gameType)];

        if (currentTournament.games.length >= currentTournament.numberOfGames)
            revert noCurrentTournament();

        // 4 players tournament
        if (currentTournament.numberOfPlayers == 4) {
            if (currentTournament.games.length == 0)
                return (currentTournament.players[0], currentTournament.players[1]);
            else if (currentTournament.games.length == 1)
                return (currentTournament.players[2], currentTournament.players[3]);
            else if (currentTournament.games.length == 2)
                return (getWinner(currentTournament.games[0]), getWinner(currentTournament.games[1]));
        }
        // 8 players tournament
        else if (currentTournament.numberOfPlayers == 8) {
            if (currentTournament.games.length == 0)
                return (currentTournament.players[0], currentTournament.players[1]);
            else if (currentTournament.games.length == 1)
                return (currentTournament.players[2], currentTournament.players[3]);
            else if (currentTournament.games.length == 2)
                return (currentTournament.players[4], currentTournament.players[5]);
            else if (currentTournament.games.length == 3)
                return (currentTournament.players[6], currentTournament.players[7]);
            else if (currentTournament.games.length == 4)
                return (getWinner(currentTournament.games[0]), getWinner(currentTournament.games[1]));
            else if (currentTournament.games.length == 5)
                return (getWinner(currentTournament.games[2]), getWinner(currentTournament.games[3]));
            else if (currentTournament.games.length == 6)
                return (getWinner(currentTournament.games[4]), getWinner(currentTournament.games[5]));
        }
        revert noCurrentTournament();
    }

    /**
        * @notice Get the ranking of all the tournaments of an instance.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The ranking of all the tournaments.
    */
    function getAllTournamentsRankings(uint256 _instanceIndex, string calldata _gameType) public view returns (string[][] memory) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        if (instancesTournament[_gameType][_instanceIndex].length == 0)
            revert noCurrentTournament();
        string[][] memory rankings = new string[][](instancesTournament[_gameType][_instanceIndex].length);
        for (uint256 i = 0; i < instancesTournament[_gameType][_instanceIndex].length; i++) {
            rankings[i] = instancesTournament[_gameType][_instanceIndex][i].reversedRanking;
        }
        return rankings;
    }

    /**
        * @notice Get the last tournament ranking of an instance.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameType The type of the game (Pongy or Fighty).
        * @return returns The last tournament ranking.
    */
    function getLastTournamentRanking(uint256 _instanceIndex, string calldata _gameType) public view returns (string[] memory) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        if (instancesTournament[_gameType][_instanceIndex].length == 0)
            revert noCurrentTournament();
        uint256 _tournamentIndex = getCurrentTournamentIndex(_instanceIndex, _gameType);
        return instancesTournament[_gameType][_instanceIndex][_tournamentIndex].reversedRanking;
    }


    /* ========== INTERNAL FUNCTIONS ========== */

    /**
        * @notice Get the current tournament index.
    */
    function getCurrentTournamentIndex(uint256 _instanceIndex, string calldata _gameType) internal view returns (uint256) {
        if (_instanceIndex < 0 || _instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        if (keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Pongy")) && keccak256(abi.encodePacked(_gameType)) != keccak256(abi.encodePacked("Fighty")))
            revert onlyPongyFightyError();
        if (instancesTournament[_gameType][_instanceIndex].length == 0)
            revert noCurrentTournament();
        return instancesTournament[_gameType][_instanceIndex].length - 1;
    }

    /**
        * @notice Get the winner of a tournament.
    */
    function getWinner(Game memory game) internal pure returns (string memory) {
        if (game.score1 > game.score2)
            return game.player1;
        return game.player2;
    }
}