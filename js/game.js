'use strict'
var gBoard
var isfirstClick = true
var gLives = 3
const MINE = '💥'
const life = ['😀', '😎', '🤬']
var gLevel = {
    SIZE: 8,
    MINES: 14
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
function onInit() {
    gBoard = buildBoard(gLevel)
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)

}
function buildBoard(level) {
    const board = []
    for (var i = 0; i < level.SIZE; i++) {
        board.push([])
        for (var j = 0; j < level.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cellText = ''
            if (board[i][j].isMine) {
                cellText = MINE
            }
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}"onclick="onCellClicked(event,this,${i},${j})"></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
    console.log(strHTML)
}
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCellIdx = { i: i, j: j }
            board[i][j].minesAroundCount = cellMinesNegs(gBoard, currCellIdx.i, currCellIdx.j)
        }
    }
}
function cellMinesNegs(board, cellI, cellJ) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) negsCount++
        }
    }
    return negsCount
}
function firstClick(elCell, i, j) {
    if (isfirstClick)
        onCellMarked(elCell, i, j)
}
function onCellClicked(event, elCell, i, j) {
    if (event.button === 2) console.log('hi')


    if (isfirstClick === true) {
        firstClick(elCell, i, j)
        isfirstClick = false
        setRandMines(gLevel.MINES)
        setMinesNegsCount(gBoard)
        console.log(gBoard)
        return
    }
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        onCellMarked(elCell, i, j)
        gLives--
        renderLives()
        if (gLives === 0) {
            var elBtn = document.querySelector('.emojiBtn')
            elBtn.innerText = life[2]
        }
    }
    else {
        if (elCell.innerText === '') {
            revealednegs(i, j)
        }
        onCellMarked(elCell, i, j)
    }

}
function onCellMarked(elCell, i, j) {
    if (elCell.innerText === MINE) {
        elCell.classList.add('mine')
    }
    else {
        elCell.classList.add('revealed')
        if (gBoard[i][j].minesAroundCount === 0) return
        elCell.innerText = gBoard[i][j].minesAroundCount
    }

}
function renderLives() {
    var elLives = document.querySelector('.lives')
    elLives.innerText = 'Lives: ' + gLives
}
function setRandMines(numMines) {
    for (var i = 0; i < numMines; i++) {
        var currCell = gBoard[getRandomInt(0, gBoard.length)][getRandomInt(0, gBoard[0].length)]
        currCell.isMine = true
    }
}
function easyBtn() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    isfirstClick = true
    onInit()
}
function hardBtn() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    isfirstClick = true
    onInit()
}
function expertBtn() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    isfirstClick = true

    onInit()
}
function emojiBtn(elBtn) {
    if (elBtn.innerText === life[0]) {
        isfirstClick = true
        gLives = 3
        onInit()
    }
}
function revealednegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (!gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                console.log(elCell)
                elCell.classList.add('revealed')
                if (gBoard[i][j].minesAroundCount > 0) {
                    elCell.innerText = gBoard[i][j].minesAroundCount
                }
            }
        }
    }
}
//סמיילי מתחלף
//מודל ניצחון/הפסד
