// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Custom errors
error onlyOwnerError();
error onlyPongyFightyError();
error wrongInstanceIndex();
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
    * @dev It's important to store the instance index in the database alongside users credentials for persistence.
*/
contract Score is Ownable {

    // Custom events
    event InstanceAdded(uint256 indexed instanceIndex);
    event GameAdded(uint256 indexed instanceIndex, string gameName, uint256 timestamp, string[2] players, uint8[2] scores);
    event TournamentAdded(uint256 indexed instanceIndex, string gameName, uint256 tournamentId, string[] players);

    struct Game {
        string gameName;
        uint256 timestamp;
        string[2] players;
        uint8[2] scores;
    }

    struct Tournament {
        string gameName;
        uint256 tournamentId;
        string[] players;
        Game[] games;
    }

    bytes32 constant PONGY_HASH = keccak256(abi.encodePacked("Pongy"));
    bytes32 constant FIGHTY_HASH = keccak256(abi.encodePacked("Fighty"));

    /* ========== STATE VARIABLES ========== */
    uint256 private instanceIndex;
    mapping(uint256 => Game[]) private instancesGamePongy;
    mapping(uint256 => Game[]) private instancesGameFighty;
    mapping(uint256 => Tournament[]) private instancesTournamentPongy;
    mapping(uint256 => Tournament[]) private instancesTournamentFighty;

    /* ========== CONSTRUCTOR ========== */
    constructor() {
        instanceIndex = 0;
    }

    /* ========== MODIFIERS ========== */
    modifier onlyPongyFighty(string calldata _gameName) {
        if (keccak256(abi.encodePacked(_gameName)) != PONGY_HASH && keccak256(abi.encodePacked(_gameName)) != FIGHTY_HASH)
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
        * @param _gameName The type of the game (Pongy or Fighty).
        * @param _players The names of the players.
        * @param _scores The scores of the players.
    **/
    function addGame(
        uint256 _instanceIndex,
        string calldata _gameName,
        string[2] memory _players,
        uint8[2] memory _scores
    ) public onlyOwner onlyPongyFighty(_gameName) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();

        if (keccak256(abi.encodePacked(_gameName)) == PONGY_HASH)
            instancesGamePongy[_instanceIndex].push(Game(
                _gameName,
                block.timestamp,
                [_players[0], _players[1]],
                [_scores[0], _scores[1]]
            ));
        else
            instancesGameFighty[_instanceIndex].push(Game(
                _gameName,
                block.timestamp,
                [_players[0], _players[1]],
                [_scores[0], _scores[1]]
            ));
        emit GameAdded(_instanceIndex, _gameName, block.timestamp, [_players[0], _players[1]], [_scores[0], _scores[1]]);
    }

    /**
        * @notice Add a new 4 or 8 players tournament to the database.
        * @param _instanceIndex The index of the instance in the database.
        * @param _gameName The type of the game (Pongy or Fighty).
        * @param _tournamentId The id of the tournament.
        * @param _players The list of players in the tournament. 4 or 8 players only.
        * @param _games The list of games in the tournament.
    **/
    function addTournament(
        uint256 _instanceIndex,
        string calldata _gameName,
        uint256 _tournamentId,
        string[] memory _players,
        Game[] memory _games
    ) public onlyOwner onlyPongyFighty(_gameName) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        // check if the number of players is correct
        if (_players.length != 4 && _players.length != 8)
            revert wrongNumberOfPlayers();

        Tournament storage newTournament;

        if (keccak256(abi.encodePacked(_gameName)) == PONGY_HASH) {
            instancesTournamentPongy[_instanceIndex].push();
            newTournament = instancesTournamentPongy[_instanceIndex][instancesTournamentPongy[_instanceIndex].length - 1];
        } else {
            instancesTournamentFighty[_instanceIndex].push();
            newTournament = instancesTournamentFighty[_instanceIndex][instancesTournamentFighty[_instanceIndex].length - 1];
        }

        newTournament.gameName = _gameName;
        newTournament.tournamentId = _tournamentId;
        newTournament.players = _players;

        for (uint256 i = 0; i < _games.length; i++) {
            newTournament.games.push(_games[i]);
        }

        emit TournamentAdded(_instanceIndex, _gameName, _tournamentId, _players);
    }

    /* ========== GETTER FUNCTIONS ========== */

    function getPongyGames(uint256 _instanceIndex) public view returns (Game[] memory) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        return instancesGamePongy[_instanceIndex];
    }

    function getFightyGames(uint256 _instanceIndex) public view returns (Game[] memory) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        return instancesGameFighty[_instanceIndex];
    }

    function getPongyTournaments(uint256 _instanceIndex) public view returns (Tournament[] memory) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        return instancesTournamentPongy[_instanceIndex];
    }

    function getFightyTournaments(uint256 _instanceIndex) public view returns (Tournament[] memory) {
        if (_instanceIndex >= instanceIndex)
            revert wrongInstanceIndex();
        return instancesTournamentFighty[_instanceIndex];
    }
}