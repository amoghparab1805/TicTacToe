import Player from "./player.js";
import Board from "./board.js";

export default (function(doc, player, board) {
  let _overlayDiv; //Declaration of variables that will be in the scope of the whole module
  let _scorePara;
  let _results;
  let _boardCasesDivs;
  let _newRoundBtn;
  let _handler;

  document.addEventListener("DOMContentLoaded", () => {
    //Assign HTML elements to vars once the document is lodaded
    _overlayDiv = doc.querySelector(".starting-overlay");
    _scorePara = doc.querySelector(".score");
    _results = doc.querySelector(".results");
    _boardCasesDivs = Array.from(doc.getElementsByClassName("boardcase"));
    _newRoundBtn = doc.querySelector(".new-round");
  });

  function initializeGame() {
    _initializePlayers();
    _closeOverlay();
    startRound();
  }

  function startRound() {
    if (_results.innerHTML) {
      //Skip if it's not the first round played
      _results.innerHTML = "";
      self.board.toggleHighlightWinningCombination();
      _newRoundBtn.classList.remove("animate-btn");
    }
    _listenToCases(true); //We "turn on" the eventlistener on the board cases
    self.board.clear();
    _displayScore();
  }

  function newGame() {
    //Just put the _overlayDiv back to the screen. The click to its submit button triggers a new game
    _overlayDiv.style.display = "flex";
  }

  //Private Methods

  function _initializePlayers() {
    const nameP1 = doc.querySelector("#name_p1").value; //Retrieve values from the form fields (users inputs)
    const nameP2 = doc.querySelector("#name_p2").value;
    const pawnP1 = doc.querySelector('input[name="pawn_shape"]:checked').value;
    const pawnP2 = pawnP1 == "X" ? "O" : "X";


    self.players = {
      //Set the "players" property on the "Game" module, once we get users inputs to initialize the Players. "player" is part of "Game" API
      player1: player(nameP1, pawnP1, true),
      player2: player(nameP2, pawnP2, false)
    };
  }

  function _listenToCases(boolean) {
    if (boolean) {
      _boardCasesDivs.forEach(boardCase =>
        boardCase.addEventListener("click", _playerMove, true)
      ); //same reference used in both listeners.
    } else {
      _boardCasesDivs.forEach(boardCase =>
        boardCase.removeEventListener("click", _playerMove, true)
      );
    }
  }

  function _playerTurn() {
    //return the player whose turn to play based on players "turn" property value (true/false)
    for (let player in self.players) {
      if (self.players[player].turn == true) return self.players[player];
    }
  }

  function _changePlayersTurn() {
    //Switch players "turn" property value from true to false and vice versa
    for (let player in self.players) {
      if (self.players[player].turn == true) {
        self.players[player].turn = false;
      } else {
        self.players[player].turn = true;
      }
    }
  }

  function _playerMove(e) {
    const playedCase = self.board.findCaseByID(e.target.id); //Maps the HTML "case" element clicked with the "caseboard" object in the Game.board.boardCases property
    _playerTurn().play(playedCase);
    if (self.board.hasAnEndingCondition()) {
      _endRound();
    } else {
      _changePlayersTurn();
    }
  }

  function _endRound() {
    _newRoundBtn.classList.add("animate-btn");
    _listenToCases(false); //remove click listener from HTML cases
    if (self.board.hasWinningCombination()) {
      self.board.toggleHighlightWinningCombination();
      const winner = _playerTurn(); // player who has his turn property to 'true' is the last one who played
      winner.points += 1;
      _displayScore();
      _results.innerHTML = `${winner.name} wins the round !`;
    } else {
      _results.innerHTML = "Tie !";
    }
  }

  function _closeOverlay() {
    _overlayDiv.style.display = "none";
    doc.forms[0].reset(); //Rests the fields of the form for the next Game
  }

  function _displayScore() {
    _scorePara.innerHTML = `Score: ${self.players.player1.name}(${self.players.player1.pawnShape}) ${self.players.player1.points} - ${self.players.player2.points} ${self.players.player2.name}(${self.players.player2.pawnShape})`;
  }

  const self = {
    //"Game" API. Properties and methods accessible to the public
    initializeGame,
    startRound,
    newGame,
    board
  };

  return self;
})(document, Player, Board); //Dependencies injection
