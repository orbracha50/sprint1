'use strict'
//todos 
//1. reveal all number negs
//2.  Manually positioned mines 
//3. “UNDO” button
//4.  Dark-Mode
//5. MEGA HINT
//6. MINE EXTERMINATOR
var gBoard
var isfirstClick = true
var gLives = 3
const MINE = '💣'
const LIFE = ['😀', '😎', '🤬']
const FLAG = '🚩'
var hintMode
var gElHint
var gElSafeCell
var userName = prompt('enter your name:')
var gSafeClick = 3
var ghitCellIdx = {
    i: 0,
    j: 0
}
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
    resetTimer()

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
            strHTML += `<td class="${className}"onclick="onCellClicked(this,${i},${j})" oncontextmenu ="onRightClick(this)"></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
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
function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    console.log(gBoard)
    if (hintMode) {
        ghitCellIdx = {
            i: i,
            j: j
        }
        revealedHintNegs(i, j)

        return
    }
    if (elCell.classList.contains('revealed')) return
    if (elCell.innerText === FLAG) return
    if (isfirstClick === true) {
        firstClick(elCell, i, j)
        isfirstClick = false
        setRandMines(gLevel.MINES)
        setMinesNegsCount(gBoard)
        startTimer()
        return
    }
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        onCellMarked(elCell, i, j)
        gLives--
        renderLives()

        if (gLives === 0) {
            var elBtn = document.querySelector('.emojiBtn')
            elBtn.innerText = LIFE[2]
            userLose()
        }
    }
    else {
        if (gBoard[i][j].minesAroundCount > 0) {
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('revealed')
            gBoard[i][j].isShown = true
            elCell.innerText = gBoard[i][j].minesAroundCount
            colorNum(elCell)
        }

        if (gBoard[i][j].minesAroundCount === 0) {
            var cellsReveal = revealednegs(i, j)
            try1(cellsReveal)
        }
        checkWin()
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
    gLives = 3
    showHintBack()
    renderLives()
    onInit()
}
function hardBtn() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    isfirstClick = true
    gLives = 3
    showHintBack()
    renderLives()
    onInit()
}
function expertBtn() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    isfirstClick = true
    gLives = 3
    showHintBack()
    renderLives()
    onInit()
}
function playAgainBtn() {
    gLives = 3
    var modal = document.querySelector('.modal')
    modal.style.display = 'none'
    isfirstClick = true
    var elBtn = document.querySelector('.emojiBtn')
    elBtn.innerText = LIFE[0]
    showHintBack()
    renderLives()
    onInit()
}
function emojiBtn(elBtn) {
    if (elBtn.innerText === LIFE[0]) {
        isfirstClick = true
        gLives = 3
        showHintBack()
        renderLives()
        onInit()
    }
}
function revealednegs(cellI, cellJ) {
    var cellsToReavel = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (!gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('revealed')
                gBoard[i][j].isShown = true
                if (gBoard[i][j].minesAroundCount === 0) {
                    var cell = {
                        i: i,
                        j: j
                    }
                    cellsToReavel.push(cell)
                    elCell.innerText = ''
                }
                else {
                    elCell.innerText = gBoard[i][j].minesAroundCount
                    colorNum(elCell)
                }
            }
        }
    }
    return cellsToReavel

}
function try1(arrcells) {
    var cellsToReavel = arrcells
        for (var i = 0; i < cellsToReavel.length; i++) {
             var newcells = revealednegs(cellsToReavel[i].i, cellsToReavel[i].j)
        }
        
}
function onRightClick(elcell) {
    if (elcell.classList.contains('revealed')) return
    if (elcell.innerText === FLAG) {
        elcell.innerText = ""
    } else {
        elcell.innerText = FLAG
    }
}
function checkWin() {
    var countCellsSHOW = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown || gBoard[i][j].isMine) {
                countCellsSHOW++
            }
        }
    }
    console.log(countCellsSHOW)
    if (gLevel.SIZE ** 2 === countCellsSHOW) {
        var modal = document.querySelector('.modal')
        var msg = document.querySelector('.msg')
        var elBtn = document.querySelector('.emojiBtn')
        elBtn.innerText = LIFE[1]
        resetTimer()
        msg.innerText = 'YOU WIN'
        modal.style.display = 'block'
        localStorage.setItem('name', userName)
        localStorage.setItem('timer', gtimer)
        document.getElementById("result").innerHTML += localStorage.getItem("name");
        document.getElementById("result").innerHTML += localStorage.getItem("timer");
    }
}
function userLose() {
    showAllmines()
    var modal = document.querySelector('.modal')
    var msg = document.querySelector('.msg')
    resetTimer()
    msg.innerText = 'YOU LOSE'
    modal.style.display = 'block'
}
function colorNum(elCell) {
    if (elCell.innerText === '1') {
        elCell.style.color = 'darkblue'
    }
    if (elCell.innerText === '2') {
        elCell.style.color = 'darkgreen'
    }
    if (elCell.innerText === '3') {
        elCell.style.color = 'darkred'
    }
    if (elCell.innerText === '4') {
        elCell.style.color = 'darkyellow'
    }
}
function showAllmines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerText = MINE
            }
        }
    }
}
function hint(elHint) {
    hintMode = true
    gElHint = elHint
    elHint.classList.add('used')
}
function revealedHintNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('revealed')
            if (gBoard[i][j].minesAroundCount === 0) {
                elCell.innerText = ''
            }
            if (gBoard[i][j].minesAroundCount > 0) {
                elCell.innerText = gBoard[i][j].minesAroundCount
                colorNum(elCell)
            }
            if (gBoard[i][j].isMine) {
                elCell.innerText = MINE
            }
        }
    }
    setTimeout(closeHintNegs, 1000)
    setTimeout(closeHint, 1000)
}
function closeHintNegs() {
    for (var i = ghitCellIdx.i - 1; i <= ghitCellIdx.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = ghitCellIdx.j - 1; j <= ghitCellIdx.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.remove('revealed')
            elCell.innerText = ''
        }
    }
    hintMode = false
}
function closeHint() {
    gElHint.style.display = 'none'
}
function showHintBack() {
    var elHint1 = document.querySelector('.hint1')
    elHint1.style.display = 'inline'
    elHint1.classList.remove('used')
    var elHint2 = document.querySelector('.hint2')
    elHint2.style.display = 'inline'
    elHint2.classList.remove('used')
    var elHint3 = document.querySelector('.hint3')
    elHint3.style.display = 'inline'
    elHint3.classList.remove('used')
}
function omSafeClick() {
    if (gSafeClick === 0) {
        return
    }
    gSafeClick--
    if (gSafeClick === 0) {
        var elBtn = document.querySelector(`.safeclick`)
        elBtn.style.backgroundColor = 'red'
    }
    var elBtn = document.querySelector(`.leftSafeClick`)
    elBtn.innerText = gSafeClick + ' left'
    var isnum = false
    while (!isnum) {
        var i = getRandomInt(0, gBoard.length)
        var j = getRandomInt(0, gBoard[0].length)
        var cell = gBoard[i][j]
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        if (!cell.isMine && !elCell.classList.contains('revealed')) {
            elCell.classList.add('revealed')
            if (gBoard[i][j].minesAroundCount === 0) {
                gElSafeCell = elCell
                setTimeout(closeSafeCell, 1000)
                return
            }
            elCell.innerText = gBoard[i][j].minesAroundCount
            colorNum(elCell)
            isnum = true
            gElSafeCell = elCell
            setTimeout(closeSafeCell, 1000)
        }
    }
}
function closeSafeCell() {
    console.log('hi')
    gElSafeCell.classList.remove('revealed')
    gElSafeCell.innerText = ''
}
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

