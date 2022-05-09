export default function(caseID, doc) {
  let _content = ""; // protected in the closure (not returned in the object). Accessible to the public only through setter and getter (APIs).
  //It's unique to each instance of the "boardCase" factory. Because each instanciation create a new closure.

  function _writeToDOM(caseID, contentToWrite) {
    doc.querySelector(`#${caseID}`).innerHTML = contentToWrite;
  }

  function isAvailable() {
    return _content === ""; //return true if content's value is "" (aka if the boardcase is empty)
  }

  const proto = {
    set caseContent(playerPawn) {
      //We don't use "this" otherwise we'd set a new property on the object.
      _content = playerPawn; // Here we assign a new value to the content variable wich is directly accessible because in the same scope.
      _writeToDOM(caseID, playerPawn); //By using the setter we both change the "content" property of the boardcase object & write into the html div the player's pawn shape
    },
    get caseContent() {
      return _content;
    },
    isAvailable
  };
  const self = Object.assign(Object.create(proto), { id: caseID }); //caseID is a local variable got through the function parametre. We make it available to the public with the "id" property
  return self;
}
