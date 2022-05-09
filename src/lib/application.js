import Game from './game.js'

export default function (doc) {
  document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = doc.querySelector('.submit')
    const newRoundBtn = doc.querySelector('.new-round')
    const newGameBtn = doc.querySelector('.new-game')

    submitBtn.addEventListener('click', Game.initializeGame.bind(Game))
    newRoundBtn.addEventListener('click', Game.startRound.bind(Game))
    newGameBtn.addEventListener('click', Game.newGame)
  })
}
