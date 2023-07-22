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
turn = 'b'
const B_MOVES = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
const R_MOVES = [[1, 0], [0, 1], [-1, 0], [0, -1]]
const N_MOVES = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
const K_MOVES = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]]
var whiteKingI = 7
var whiteKingJ = 4
var blackKingI = 0
var blackKingJ = 4
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
    if(from.length == 0) {
        if(possibleMoves.has(coordinates) && possibleMoves.get(coordinates).length != 0) {
            from = coordinates
            for(var y of possibleMoves.get(from)) {
                console.log(from, getCoordinates(Number(y.charAt(0)), Number(y.charAt(2))))
            }
            //highlight
        }
    } else if(possibleMoves.get(from).has(getIndices(coordinates).toString())) {
        var temp = event.target.textContent
        event.target.textContent = document.getElementById(from).textContent
        document.getElementById(from).textContent = temp
        chessGrid[getIndices(coordinates)[0]][getIndices(coordinates)[1]] = chessGrid[getIndices(from)[0]][getIndices(from)[1]]
        chessGrid[getIndices(from)[0]][getIndices(from)[1]] = ''
        //update if kingmove
        newTurn()
    } else {
        from = ''
        movePiece(event)
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
    for(var x of possibleMoves.keys()) {
        for(var y of possibleMoves.get(x)) {
            console.log(x, y)
        }
    }
}

function getIndices(coordinates) {
    return [coordinates.charCodeAt(0) - 97, Number(coordinates.charAt(1)) * -1 + 8]
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
        for(var x = 0; x < B_MOVES; x++) {
            var tempi = i + B_MOVES[x][0]
            var tempj = j + B_MOVES[x][1]
            while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
                tempi += B_MOVES[x][0]
                tempj += B_MOVES[x][1]
            }
            if(inBounds(tempi, tempj) && chessGrid[tempi][tempj].charAt(0) == oppColor) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
            }
        }
    }
    if(piece == 'r' || piece == 'q') {
        for(var x = 0; x < R_MOVES; x++) {
            var tempi = i + R_MOVES[x][0]
            var tempj = j + R_MOVES[x][1]
            while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
                tempi += R_MOVES[x][0]
                tempj += R_MOVES[x][1]
            }
            if(inBounds(tempi, tempj) && chessGrid[tempi][tempj].charAt(0) == oppColor) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
            }
        }
    }
    if(piece == 'n') {
        for(var x = 0; x < N_MOVES; x++) {
            var tempi = i + N_MOVES[x][0]
            var tempj = j + N_MOVES[x][1]
            if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj].length == 0 || chessGrid[tempi][tempj].charAt(0) == oppColor)) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
            }
        }
    }
    if(piece =='k') {
        for(var x = 0; x < K_MOVES; x++) {
            var tempi = i + K_MOVES[x][0]
            var tempj = j + K_MOVES[x][1]
            if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj].length == 0 || chessGrid[tempi][tempj].charAt(0) == oppColor)) {
                var temp = chessGrid[tempi][tempj]
                chessGrid[tempi][tempj] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([tempi, tempj].toString())
                }
                chessGrid[tempi][tempj] = temp
            }
        }
    }
    if(piece == 'p') {
        if(turn == 'b') {
            if(inBounds(i + 1, j - 1) && chessGrid[i + 1][j - 1].length != 0 && chessGrid[i + 1][j - 1].charAt(0) == oppColor) {
                var temp = chessGrid[i + 1][j - 1]
                chessGrid[i + 1][j - 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i + 1, j - 1].toString())
                }
                chessGrid[i + 1][j - 1] = temp
            }
            if(inBounds(i + 1, j + 1) && chessGrid[i + 1][j + 1].length != 0 && chessGrid[i + 1][j + 1].charAt(0) == oppColor) {
                var temp = chessGrid[i + 1][j - 1]
                chessGrid[i + 1][j + 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i + 1, j + 1].toString())
                }
                chessGrid[i + 1][j + 1] = temp
            }
            if(inBounds(i + 1, j) && chessGrid[i + 1][j].length == 0) {
                var temp = chessGrid[i + 1][j]
                chessGrid[i + 1][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i + 1, j].toString())
                }
                chessGrid[i + 1][j] = temp
            }
            if(inBounds(i + 2, j) && chessGrid[i + 2][j].length == 0 && i == 1) {
                var temp = chessGrid[i + 2][j]
                chessGrid[i + 2][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i + 2, j].toString())
                }
                chessGrid[i + 2][j] = temp
            }
        } else {
            if(inBounds(i - 1, j - 1) && chessGrid[i - 1][j - 1].length != 0 && chessGrid[i - 1][j - 1].charAt(0) == oppColor) {
                var temp = chessGrid[i - 1][j - 1]
                chessGrid[i - 1][j - 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i - 1, j - 1].toString())
                }
                chessGrid[i - 1][j - 1] = temp
            }
            if(inBounds(i - 1, j + 1) && chessGrid[i - 1][j + 1].length != 0 && chessGrid[i - 1][j + 1].charAt(0) == oppColor) {
                var temp = chessGrid[i - 1][j + 1]
                chessGrid[i - 1][j + 1] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i - 1, j + 1].toString())
                }
                chessGrid[i - 1][j + 1] = temp
            }
            if(inBounds(i - 1, j) && chessGrid[i - 1][j].length == 0) {
                var temp = chessGrid[i - 1][j]
                chessGrid[i - 1][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i - 1, j].toString())
                }
                chessGrid[i - 1][j] = temp
            }
            if(inBounds(i - 2, j) && chessGrid[i - 2][j].length == 0 && i == 6) {
                var temp = chessGrid[i - 2][j]
                chessGrid[i - 2][j] = turn + piece
                if(!kingInCheck(kingI, kingJ)) {
                    possibleMoves.get(coordinates).add([i - 2, j].toString())
                }
                chessGrid[i - 2][j] = temp
            }
        }
    }
}

function kingInCheck(i, j) {
    var oppColor = turn == 'w' ? 'b' : 'w'
    for(var x = 0; x < B_MOVES; x++) {
        var tempi = i + B_MOVES[x][0]
        var tempj = j + B_MOVES[x][1]
        while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
            tempi += B_MOVES[x][0]
            tempj += B_MOVES[x][1]
        }
        if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj] == oppColor + 'b' || chessGrid[tempi][tempj] == turn + 'q')) {
            return true
        }
    }
    for(var x = 0; x < R_MOVES; x++) {
        var tempi = i + R_MOVES[x][0]
        var tempj = j + R_MOVES[x][1]
        while(inBounds(tempi, tempj) && chessGrid[tempi][tempj].length == 0) {
            tempi += R_MOVES[x][0]
            tempj += R_MOVES[x][1]
        }
        if(inBounds(tempi, tempj) && (chessGrid[tempi][tempj] == oppColor + 'r' || chessGrid[tempi][tempj] == turn + 'q')) {
            return true
        }
    }
    for(var x = 0; x < N_MOVES; x++) {
        var tempi = i + N_MOVES[x][0]
        var tempj = j + N_MOVES[x][1]
        if(inBounds(tempi, tempj) && chessGrid[tempi][tempj] == oppColor + 'n') {
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

