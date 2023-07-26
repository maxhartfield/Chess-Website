var chessGrid = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
]
var possibleMoves = new Map()
var from = ''
var turn = 'b'
const B_MOVES = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
const R_MOVES = [[1, 0], [0, 1], [-1, 0], [0, -1]]
const N_MOVES = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
const K_MOVES = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]
var whiteKingI = 7
var whiteKingJ = 4
var blackKingI = 0
var blackKingJ = 4
var green = []
var greenBorder = []
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
function ready() {
    var buttons = document.getElementsByTagName('button')
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', movePiece)
    }
    newTurn()
}

function movePiece(event){
    var coordinates = event.target.id
    for (var to of green) {
        document.getElementById(to).classList.remove('green')
    }
    for (var to of greenBorder) {
        document.getElementById(to).classList.remove('green-border')
    }
    green = []
    greenBorder = []
    if(from.length == 0) {
        if(possibleMoves.has(coordinates) && possibleMoves.get(coordinates).length != 0) {
            from = coordinates
            for(var to of possibleMoves.get(from)) {
                if(chessGrid[getIndices(to)[0]][getIndices(to)[1]].length == 0) {
                    green.push(to)
                    document.getElementById(to).classList.add('green')
                } else {
                    greenBorder.push(to)
                    document.getElementById(to).classList.add('green-border')
                }
                
            }
        }
    } else if(possibleMoves.get(from).has(coordinates)) {
        event.target.textContent = document.getElementById(from).textContent
        document.getElementById(from).innerHTML = '&#160'
        if(chessGrid[getIndices(from)[0]][getIndices(from)[1]].charAt(1) == 'k') {
            if(turn == 'w') {
                whiteKingI = getIndices(coordinates)[0]
                whiteKingJ = getIndices(coordinates)[1]
            } else {
                blackKingI = getIndices(coordinates)[0]
                blackKingJ = getIndices(coordinates)[1]
            }
        }
        chessGrid[getIndices(coordinates)[0]][getIndices(coordinates)[1]] = chessGrid[getIndices(from)[0]][getIndices(from)[1]]
        chessGrid[getIndices(from)[0]][getIndices(from)[1]] = ''
        newTurn()
    } else {
        if (from !== coordinates) {
            from = ''
            movePiece(event)
        } else {
            from = ''
        }
        
    }
}
function newTurn() {
    turn = turn == 'w' ? 'b' : 'w'
    from = ''
    possibleMoves = new Map()
    for(var i = 0; i < chessGrid.length; i++) {
        for(var j = 0; j < chessGrid[i].length; j++) {
            if(chessGrid[i][j].length != 0 && chessGrid[i][j].charAt(0) == turn) {
                getPossibleMoves(i, j, chessGrid[i][j].charAt(1))
            }
        }
    }
}

function getIndices(coordinates) {
    return [Number(coordinates.charAt(1)) * -1 + 8, coordinates.charCodeAt(0) - 97]
}

function getCoordinates(i, j) {
    return String.fromCharCode(97 + j) + (i * -1 + 8).toString()
}

function getPossibleMoves(i, j, piece) {
    var coordinates = getCoordinates(i, j)
    var oppColor = turn == 'w' ? 'b' : 'w'
    if(!possibleMoves.has(coordinates)) {
        possibleMoves.set(coordinates, new Set())
    }
    var kingI = turn == 'w' ? whiteKingI : blackKingI
    var kingJ = turn == 'w' ? whiteKingJ : blackKingJ
    if(piece == 'b' || piece == 'q') {
        for(var x = 0; x < B_MOVES.length; x++) {
            var tempi = i + B_MOVES[x][0]
            var tempj = j + B_MOVES[x][1]
            while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
                tempi += B_MOVES[x][0]
                tempj += B_MOVES[x][1]
            }
            if(inBounds(tempi, tempj) && chessGrid[tempi][tempj].charAt(0) == oppColor) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
            }
        }
    }
    if(piece == 'r' || piece == 'q') {
        for(var x = 0; x < R_MOVES.length; x++) {
            var tempi = i + R_MOVES[x][0]
            var tempj = j + R_MOVES[x][1]
            while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
                tempi += R_MOVES[x][0]
                tempj += R_MOVES[x][1]
            }
            if(inBounds(tempi, tempj) && chessGrid[tempi][tempj].charAt(0) == oppColor) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
            }
        }
    }
    if(piece == 'n') {
        for(var x = 0; x < N_MOVES.length; x++) {
            var tempi = i + N_MOVES[x][0]
            var tempj = j + N_MOVES[x][1]
            if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj].length == 0 || chessGrid[tempi][tempj].charAt(0) == oppColor)) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
            }
        }
    }
    if(piece =='k') {
        for(var x = 0; x < K_MOVES.length; x++) {
            var tempi = i + K_MOVES[x][0]
            var tempj = j + K_MOVES[x][1]
            if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj].length == 0 || chessGrid[tempi][tempj].charAt(0) == oppColor)) {
                var temp = chessGrid[tempi][tempj]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[tempi][tempj] = turn + piece
                kingI += K_MOVES[x][0]
                kingJ += K_MOVES[x][1]
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj))
                }
                kingI -= K_MOVES[x][0]
                kingJ -= K_MOVES[x][1]
                chessGrid[tempi][tempj] = temp
                chessGrid[i][j] = temp2
            }
        }
    }
    if(piece == 'p') {
        if(turn == 'b') {
            if(inBounds(i + 1, j - 1) && chessGrid[i + 1][j - 1].length != 0 && chessGrid[i + 1][j - 1].charAt(0) == oppColor) {
                var temp = chessGrid[i + 1][j - 1]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i + 1][j - 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i + 1, j - 1))
                }
                chessGrid[i + 1][j - 1] = temp
                chessGrid[i][j] = temp2
            }
            if(inBounds(i + 1, j + 1) && chessGrid[i + 1][j + 1].length != 0 && chessGrid[i + 1][j + 1].charAt(0) == oppColor) {
                var temp = chessGrid[i + 1][j + 1]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i + 1][j + 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i + 1, j + 1))
                }
                chessGrid[i + 1][j + 1] = temp
                chessGrid[i][j] = temp2
            }
            if(inBounds(i + 1, j) && chessGrid[i + 1][j].length == 0) {
                var temp = chessGrid[i + 1][j]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i + 1][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i + 1, j))
                }
                chessGrid[i + 1][j] = temp
                chessGrid[i][j] = temp2
                if(inBounds(i + 2, j) && chessGrid[i + 2][j].length == 0 && i == 1) {
                    temp = chessGrid[i + 2][j]
                    temp2 = chessGrid[i][j]
                    chessGrid[i][j] = ''
                    chessGrid[i + 2][j] = turn + piece
                    if(!kingInCheck(kingI, kingJ)) {
                        possibleMoves.get(coordinates).add(getCoordinates(i + 2, j))
                    }
                    chessGrid[i + 2][j] = temp
                    chessGrid[i][j] = temp2
                }
            }
        } else {
            if(inBounds(i - 1, j - 1) && chessGrid[i - 1][j - 1].length != 0 && chessGrid[i - 1][j - 1].charAt(0) == oppColor) {
                var temp = chessGrid[i - 1][j - 1]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i - 1][j - 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i - 1, j - 1))
                }
                chessGrid[i - 1][j - 1] = temp
                chessGrid[i][j] = temp2
            }
            if(inBounds(i - 1, j + 1) && chessGrid[i - 1][j + 1].length != 0 && chessGrid[i - 1][j + 1].charAt(0) == oppColor) {
                var temp = chessGrid[i - 1][j + 1]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i - 1][j + 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i - 1, j + 1))
                }
                chessGrid[i - 1][j + 1] = temp
                chessGrid[i][j] = temp2
            }
            if(inBounds(i - 1, j) && chessGrid[i - 1][j].length == 0) {
                var temp = chessGrid[i - 1][j]
                var temp2 = chessGrid[i][j]
                chessGrid[i][j] = ''
                chessGrid[i - 1][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add(getCoordinates(i - 1, j))
                }
                chessGrid[i - 1][j] = temp
                chessGrid[i][j] = temp2
                if(inBounds(i - 2, j) && chessGrid[i - 2][j].length == 0 && i == 6) {
                    temp = chessGrid[i - 2][j]
                    temp2 = chessGrid[i][j]
                    chessGrid[i][j] = ''
                    chessGrid[i - 2][j] = turn + piece
                    if(!kingInCheck(kingI, kingJ)) {
                        possibleMoves.get(coordinates).add(getCoordinates(i - 2, j))
                    }
                    chessGrid[i - 2][j] = temp
                    chessGrid[i][j] = temp2
                }
            }
            
        }
    }
}

function kingInCheck(i, j) {
    var oppColor = turn == 'w' ? 'b' : 'w'
    for(var x = 0; x < B_MOVES.length; x++) {
        var tempi = i + B_MOVES[x][0]
        var tempj = j + B_MOVES[x][1]
        while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
            tempi += B_MOVES[x][0]
            tempj += B_MOVES[x][1]
        }
        if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj] == oppColor + 'b' || chessGrid[tempi][tempj] == oppColor + 'q')) {
            return true
        }
    }
    for(var x = 0; x < R_MOVES.length; x++) {
        var tempi = i + R_MOVES[x][0]
        var tempj = j + R_MOVES[x][1]
        while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
            tempi += R_MOVES[x][0]
            tempj += R_MOVES[x][1]
        }
        if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj] == oppColor + 'r' || chessGrid[tempi][tempj] == oppColor + 'q')) {
            return true
        }
    }
    for(var x = 0; x < N_MOVES.length; x++) {
        var tempi = i + N_MOVES[x][0]
        var tempj = j + N_MOVES[x][1]
        if(inBounds(tempi, tempj) && chessGrid[tempi][tempj] == oppColor + 'n') {
            return true
        }
    }
    for(var x = 0; x < K_MOVES.length; x++) {
        var tempi = i + K_MOVES[x][0]
        var tempj = j + K_MOVES[x][1]
        if(inBounds(tempi, tempj) && chessGrid[tempi][tempj] == oppColor + 'k') {
            return true
        }
    }
    if(oppColor == 'w' && (inBounds(i + 1, j - 1) && chessGrid[i + 1][j - 1] == oppColor + 'p') || (inBounds(i + 1, j + 1) && chessGrid[i + 1][j + 1] == oppColor + 'p')) {
        return true
    } else if(oppColor == 'b' && (inBounds(i - 1, j - 1) && chessGrid[i - 1][j - 1] == oppColor + 'p') || (inBounds(i - 1, j + 1) && chessGrid[i - 1][j + 1] == oppColor + 'p')) {
        return true
    }
    return false
}

function inBounds(i, j) {
    return i >= 0 && j >= 0 && i < chessGrid.length && j < chessGrid.length
}

