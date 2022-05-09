import BoardCase from "./boardCase.js";

export default (function (doc) {
  const boardCases = (function (gridSize) {
    // Instanciation of the boardcases. "boardCases" variable is assigned the return of the IIFE invokation
    const boardCasesIDs = _generateBoardCasesIDsArray(gridSize);
    return boardCasesIDs.map((caseID) => BoardCase(caseID, doc));
  })(3); // Here we select a 3x3 grid size

  const _winningCombinationsIDs = [
    // work only for 3x3 grid
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"],
  ];

  //  Private methods

  function _generateBoardCasesIDsArray(gridSize) {
    // Method that generate cases ID's names depending on the desired gridsize
    const arrayOfCases = [];
    const gridColumnID = Array.from({ length: gridSize }, (_, i) =>
      String.fromCharCode("a".charCodeAt(0) + i)
    ); // ["a", "b", "c"...]
    const gridRowsID = [...Array(gridSize + 1).keys()].slice(1); // ["1", "2", "3"...]

    gridColumnID.forEach((columnID) => {
      gridRowsID.forEach((rowID) => {
        arrayOfCases.push(columnID + rowID);
      });
    });

    return arrayOfCases; // ["a1", "a2", "a3", "b1"...]
  }

  function _isFull() {
    return boardCases.every((boardcase) => boardcase.caseContent);
  }

  function _findWinningCombinationArray() {
    //Find the winning combination arrray
    const WinningCombinationArray = _winningCombinationsIDs.find((combinationIDsarray) => {
      return (
        combinationIDsarray.every(
          (caseID) => findCaseByID(caseID).caseContent === "X"
        ) ||
        combinationIDsarray.every(
          (caseID) => findCaseByID(caseID).caseContent === "O"
        )
      );
    });
    return WinningCombinationArray
  }

  //  Public methods

  function toggleHighlightWinningCombination() { //a mettre dans new game et end game
    if (hasWinningCombination()) {
      const winningArray = _findWinningCombinationArray();
      winningArray.forEach((boardID) => {
        doc.getElementById(boardID).classList.toggle("highlight");
      });
    }
  }

  function findCaseByID(boardID) {
    // Maps the HTML id's attribute of the div element with the corresponding boardcase object in the Board.boardCase property
    return boardCases.find((boardCase) => boardCase.id === boardID);
  }

  function hasWinningCombination() {
    return _winningCombinationsIDs.some((combinationIDsarray) => {
      return (
        combinationIDsarray.every(
          (caseID) => findCaseByID(caseID).caseContent === "X"
        ) ||
        combinationIDsarray.every(
          (caseID) => findCaseByID(caseID).caseContent === "O"
        )
      );
    });
  }

  function hasAnEndingCondition() {
    return hasWinningCombination() || _isFull(); // Check for the winning combinations first in case there's both a winning combination & full board on the last move
  }

  function clear() {
    boardCases.forEach((boardcase) => (boardcase.caseContent = ""));
  }

  const self = {
    boardCases,
    hasAnEndingCondition,
    hasWinningCombination,
    toggleHighlightWinningCombination,
    clear,
    findCaseByID,
  };

  return self;
})(document);
