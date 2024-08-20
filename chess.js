var chessGrid = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];
var possibleMoves = new Map();
var from = "";
var turn = "b";
const B_MOVES = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const R_MOVES = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const N_MOVES = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];
const K_MOVES = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];
var whiteKing = [7, 4];
var blackKing = [0, 4];
var greenBorder = [];
var lastMove = ["", ""]; //from, to
whiteCastleStatus = [true, true]; //queen, king
blackCastleStatus = [true, true];
var gameFinished = false;
var boardFreq = new Map();
var moves = [];
var charMap = new Map();
charMap.set("wk", "k");
charMap.set("wq", "q");
charMap.set("wr", "r");
charMap.set("wb", "b");
charMap.set("wn", "n");
charMap.set("wp", "p");
charMap.set("bk", "l");
charMap.set("bq", "w");
charMap.set("br", "t");
charMap.set("bb", "v");
charMap.set("bn", "m");
charMap.set("bp", "o");
charMap.set("", "");
charMap.set("k", "wk");
charMap.set("q", "wq");
charMap.set("r", "wr");
charMap.set("b", "wb");
charMap.set("n", "wn");
charMap.set("p", "wp");
charMap.set("l", "bk");
charMap.set("w", "bq");
charMap.set("t", "br");
charMap.set("v", "bb");
charMap.set("m", "bn");
charMap.set("o", "bp");

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
function ready() {
  from = "";
  var white = document.getElementsByClassName("white");
  var black = document.getElementsByClassName("black");
  for (var i = 0; i < white.length; i++) {
    white[i].addEventListener("click", movePiece);
    black[i].addEventListener("click", movePiece);
  }
  var promotionButtons = document.getElementsByClassName("promotion");
  for (var i = 0; i < promotionButtons.length; i++) {
    promotionButtons[i].addEventListener("click", hide);
  }
  document.getElementById("undo").addEventListener("click", undo);
  document
    .getElementById("board-editor")
    .addEventListener("click", boardEditor);
  var editButtons = document.getElementsByClassName("editor");
  for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", pieceEdit);
  }
  document.getElementById("remove").addEventListener("click", pieceEdit);
  newTurn();
}

function notReady() {
  chessGrid = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      document.getElementById(getCoordinates(i, j)).innerHTML = "";
    }
  }
  boardFreq = new Map();
  moves = [];
  lastMove = ["", ""];
  from = "";
  gameFinished = false;
  possibleMoves = new Map();
  var white = document.getElementsByClassName("white");
  var black = document.getElementsByClassName("black");
  for (var i = 0; i < white.length; i++) {
    white[i].removeEventListener("click", movePiece);
    black[i].removeEventListener("click", movePiece);
  }
  for (var i = 0; i < white.length; i++) {
    white[i].addEventListener("click", edit);
    black[i].addEventListener("click", edit);
  }
}

function pieceEdit(event) {
  removeGreen();
  document.getElementById("text").classList.toggle("show", true);
  event.target.classList.add("highlight");
  from = event.target.id;
}

function edit(event) {
  if (
    from !== "" &&
    document.getElementById(from).classList.contains("board-button") &&
    document.getElementById(from).classList.contains("editor")
  ) {
    document.getElementById(event.target.id).innerHTML =
      document.getElementById(from).innerHTML;
  } else if (from !== "" && document.getElementById(from).id == "remove") {
    document.getElementById(event.target.id).innerHTML = "";
  }
}

function boardEditor(event) {
  document.getElementById("text").classList.toggle("show", true);
  if (lastMove[0] !== "") {
    document.getElementById(lastMove[0]).classList.remove("yellow");
    document.getElementById(lastMove[1]).classList.remove("yellow");
  }
  removeGreen();
  if (event.target.innerHTML == "Board<br>Editor") {
    event.target.innerHTML = "Start<br>Game";
    notReady();
  } else {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (document.getElementById(getCoordinates(i, j)).textContent == "") {
          chessGrid[i][j] = "";
        } else {
          chessGrid[i][j] = charMap.get(
            document.getElementById(getCoordinates(i, j)).textContent
          );
        }
      }
    }
    var king = findKings();
    whiteKing = king[0];
    blackKing = king[1];
    turn = document.getElementById("turn").value;
    if (!isValidBoard()) {
      endGame("Invalid Board. Try Again.");
      notReady();
      return;
    }
    event.target.innerHTML = "Board<br>Editor";
    whiteCastleStatus = [
      document.getElementById("W O-O-O").checked,
      document.getElementById("W O-O").checked,
    ];
    blackCastleStatus = [
      document.getElementById("B O-O-O").checked,
      document.getElementById("B O-O").checked,
    ];
    ready();
  }
  document.getElementById("undo").classList.toggle("show");
  let editButtons = document.getElementsByClassName("editor");
  for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].classList.toggle("show");
  }
  document.getElementById("turn").classList.toggle("show");
  document.getElementsByClassName("castle")[0].classList.toggle("show");
}

function movePiece(event) {
  if (!gameFinished) {
    var coordinates = event.target.id;
    removeGreen();
    if (from == "") {
      if (
        possibleMoves.has(coordinates) &&
        possibleMoves.get(coordinates).size !== 0
      ) {
        from = coordinates;
        addGreen();
      }
    } else if (possibleMoves.get(from).has(coordinates)) {
      addPosition();
      event.target.textContent = document.getElementById(from).textContent;
      document.getElementById(from).innerHTML = "";
      castle(coordinates);
      updateKing(getPiece(from).charAt(1), getIndices(coordinates));
      updateLastMove(coordinates);
      updateCastleStatus();
      checkEnPassant(coordinates);
      setPiece(coordinates, getPiece(from));
      setPiece(from, "");
      if (!checkPromotion(coordinates)) {
        newTurn();
      }
    } else {
      if (from !== coordinates) {
        from = "";
        movePiece(event);
      } else {
        from = "";
      }
    }
  }
}

function addPosition() {
  var arr = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      arr[i][j] = chessGrid[i][j];
    }
  }
  moves.push([
    arr,
    whiteCastleStatus[0],
    whiteCastleStatus[1],
    blackCastleStatus[0],
    blackCastleStatus[1],
    whiteKing[0],
    whiteKing[1],
    blackKing[0],
    blackKing[1],
    lastMove[0],
    lastMove[1],
  ]);
}

function hide(event) {
  var promotion = document.getElementsByClassName("promotionSection");
  for (var i = 0; i < promotion.length; i++) {
    promotion[i].classList.toggle("show");
  }
  setPiece(lastMove[1], getPiece(lastMove[1]).charAt(0) + event.target.name);
  document.getElementById(lastMove[1]).textContent = event.target.textContent;
  turn = turn == "w" ? "b" : "w";
  newTurn();
}

function undo(event) {
  if (moves.length !== 0) {
    document.getElementById(lastMove[0]).classList.remove("yellow");
    document.getElementById(lastMove[1]).classList.remove("yellow");
    boardFreq.set(
      chessGrid.toString(),
      boardFreq.get(chessGrid.toString()) - 1
    );
    var move = moves.pop();
    var arr = move[0];
    whiteCastleStatus[0] = move[1];
    whiteCastleStatus[1] = move[2];
    blackCastleStatus[0] = move[3];
    blackCastleStatus[1] = move[4];
    whiteKing[0] = move[5];
    whiteKing[1] = move[6];
    blackKing[0] = move[7];
    blackKing[1] = move[8];
    lastMove[0] = move[9];
    lastMove[1] = move[10];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        chessGrid[i][j] = arr[i][j];
      }
    }
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        document.getElementById(getCoordinates(i, j)).innerHTML = charMap.get(
          chessGrid[i][j]
        );
      }
    }
    boardFreq.set(
      chessGrid.toString(),
      boardFreq.get(chessGrid.toString()) - 1
    );
    newTurn();
    if (gameFinished) {
      document.getElementById("text").classList.toggle("show");
      gameFinished = false;
    }
    var promotion = document.getElementsByClassName("promotionSection");
    for (var i = 0; i < promotion.length; i++) {
      promotion[i].classList.toggle("show", true);
    }
    removeGreen();
  }
}

function addGreen() {
  for (var to of possibleMoves.get(from)) {
    greenBorder.push(to);
    document.getElementById(to).classList.add("green-border");
  }
  document.getElementById(from).classList.add("highlight");
}
function removeGreen() {
  for (var red of document.getElementsByClassName("red")) {
    red.classList.remove("red");
  }
  for (var to of greenBorder) {
    document.getElementById(to).classList.remove("green-border");
  }
  for (var h of document.getElementsByClassName("highlight")) {
    h.classList.remove("highlight");
  }
  greenBorder = [];
}

function updateLastMove(coordinates) {
  if (lastMove[0] !== "") {
    document.getElementById(lastMove[0]).classList.remove("yellow");
    document.getElementById(lastMove[1]).classList.remove("yellow");
  }
  lastMove[0] = from;
  lastMove[1] = coordinates;
}

function updateKing(piece, indices) {
  if (piece == "k") {
    if (turn == "w") {
      whiteKing = indices;
    } else {
      blackKing = indices;
    }
  }
}

function updateCastleStatus() {
  if (from == "a8" || from == "e8") {
    blackCastleStatus[0] = false;
  }
  if (from == "h8" || from == "e8") {
    blackCastleStatus[1] = false;
  }
  if (from == "a1" || from == "e1") {
    whiteCastleStatus[0] = false;
  }
  if (from == "h1" || from == "e1") {
    whiteCastleStatus[1] = false;
  }
}

function getPiece(coordinates) {
  return chessGrid[getIndices(coordinates)[0]][getIndices(coordinates)[1]];
}

function setPiece(coordinates, piece) {
  chessGrid[getIndices(coordinates)[0]][getIndices(coordinates)[1]] = piece;
}
function checkEnPassant(coordinates) {
  var enPassant = false;
  if (
    getPiece(from) == "wp" &&
    getIndices(coordinates)[0] == getIndices(from)[0] - 1 &&
    getPiece(coordinates) == ""
  ) {
    if (
      getIndices(from)[1] == getIndices(coordinates)[1] - 1 ||
      getIndices(from)[1] == getIndices(coordinates)[1] + 1
    ) {
      enPassant = true;
    }
  } else if (
    getPiece(from) == "bp" &&
    getIndices(coordinates)[0] == getIndices(from)[0] + 1 &&
    getPiece(coordinates) == ""
  ) {
    if (
      getIndices(from)[1] == getIndices(coordinates)[1] - 1 ||
      getIndices(from)[1] == getIndices(coordinates)[1] + 1
    ) {
      enPassant = true;
    }
  }
  if (enPassant) {
    setPiece(
      getCoordinates(getIndices(from)[0], getIndices(coordinates)[1]),
      ""
    );
    document.getElementById(
      getCoordinates(getIndices(from)[0], getIndices(coordinates)[1])
    ).innerHTML = "";
  }
}

function checkCastle(i, j, coordinates) {
  chessGrid[i][j] = "";
  if (turn == "b") {
    if (blackCastleStatus[0]) {
      if (
        coordinates == "e8" &&
        getPiece("a8") == "br" &&
        getPiece("d8") == "" &&
        getPiece("c8") == "" &&
        getPiece("b8") == ""
      ) {
        var valid = true;
        for (var x = 1; x <= 2; x++) {
          chessGrid[i][j - x] = "bk";
          valid &= !kingInCheck(i, j - x);
          chessGrid[i][j - x] = "";
        }
        if (valid) {
          possibleMoves.get(coordinates).add("c8");
        }
      }
    }
    if (blackCastleStatus[1]) {
      if (
        coordinates == "e8" &&
        getPiece("h8") == "br" &&
        getPiece("f8") == "" &&
        getPiece("g8") == ""
      ) {
        var valid = true;
        for (var x = 1; x <= 2; x++) {
          chessGrid[i][j + x] = "bk";
          valid &= !kingInCheck(i, j + x);
          chessGrid[i][j + x] = "";
        }
        if (valid) {
          possibleMoves.get(coordinates).add("g8");
        }
      }
    }
    chessGrid[i][j] = "bk";
  } else {
    if (whiteCastleStatus[0]) {
      if (
        coordinates == "e1" &&
        getPiece("a1") == "wr" &&
        getPiece("d1") == "" &&
        getPiece("c1") == "" &&
        getPiece("b1") == ""
      ) {
        var valid = true;
        for (var x = 1; x <= 2; x++) {
          chessGrid[i][j - x] = "wk";
          valid &= !kingInCheck(i, j - x);
          chessGrid[i][j - x] = "";
        }
        if (valid) {
          possibleMoves.get(coordinates).add("c1");
        }
      }
    }
    if (whiteCastleStatus[1]) {
      if (
        coordinates == "e1" &&
        getPiece("h1") == "wr" &&
        getPiece("f1") == "" &&
        getPiece("g1") == ""
      ) {
        var valid = true;
        for (var x = 1; x <= 2; x++) {
          chessGrid[i][j + x] = "wk";
          valid &= !kingInCheck(i, j + x);
          chessGrid[i][j + x] = "";
        }
        if (valid) {
          possibleMoves.get(coordinates).add("g1");
        }
      }
    }
    chessGrid[i][j] = "wk";
  }
}

function castle(coordinates) {
  if (getPiece(from) == "bk" || getPiece(from) == "wk") {
    if (from == "e8" && coordinates == "c8") {
      setPiece("a8", "");
      setPiece("d8", "br");
      document.getElementById("d8").textContent =
        document.getElementById("a8").textContent;
      document.getElementById("a8").innerHTML = "";
    } else if (from == "e8" && coordinates == "g8") {
      setPiece("h8", "");
      setPiece("f8", "br");
      document.getElementById("f8").textContent =
        document.getElementById("h8").textContent;
      document.getElementById("h8").innerHTML = "";
    } else if (from == "e1" && coordinates == "c1") {
      setPiece("a1", "");
      setPiece("d1", "wr");
      document.getElementById("d1").textContent =
        document.getElementById("a1").textContent;
      document.getElementById("a1").innerHTML = "";
    } else if (from == "e1" && coordinates == "g1") {
      setPiece("h1", "");
      setPiece("f1", "wr");
      document.getElementById("f1").textContent =
        document.getElementById("h1").textContent;
      document.getElementById("h1").innerHTML = "";
    }
  }
}

function newTurn() {
  turn = turn == "w" ? "b" : "w";
  from = "";
  possibleMoves = new Map();
  for (var i = 0; i < chessGrid.length; i++) {
    for (var j = 0; j < chessGrid[i].length; j++) {
      if (chessGrid[i][j] !== "" && chessGrid[i][j].charAt(0) == turn) {
        getPossibleMoves(i, j, chessGrid[i][j].charAt(1));
      }
    }
  }
  if (lastMove[0] !== "") {
    document.getElementById(lastMove[0]).classList.add("yellow");
    document.getElementById(lastMove[1]).classList.add("yellow");
  }
  if (!boardFreq.has(chessGrid.toString())) {
    boardFreq.set(chessGrid.toString(), 0);
  }
  boardFreq.set(chessGrid.toString(), boardFreq.get(chessGrid.toString()) + 1);
  if (turn == "b" && kingInCheck(blackKing[0], blackKing[1])) {
    document
      .getElementById(getCoordinates(blackKing[0], blackKing[1]))
      .classList.add("red");
  } else if (turn == "w" && kingInCheck(whiteKing[0], whiteKing[1])) {
    document
      .getElementById(getCoordinates(whiteKing[0], whiteKing[1]))
      .classList.add("red");
  }
  checkCheckmate();
  checkInsufficientMaterial();
  checkThreeFold();
}

function checkCheckmate() {
  var noMoves = true;
  for (var coordinates of possibleMoves.keys()) {
    if (possibleMoves.get(coordinates).size !== 0) {
      noMoves = false;
    }
  }
  if (noMoves) {
    if (
      (turn == "w" && kingInCheck(whiteKing[0], whiteKing[1])) ||
      (turn == "b" && kingInCheck(blackKing[0], blackKing[1]))
    ) {
      winner = turn == "w" ? "Black" : "White";
      endGame("Checkmate! " + winner + " wins!");
    } else {
      endGame("Stalemate! White and Black draw!");
    }
  }
}

function checkInsufficientMaterial() {
  whitePieces = [];
  blackPieces = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (chessGrid[i][j] !== "") {
        if (chessGrid[i][j].charAt(0) == "w") {
          if (chessGrid[i][j].charAt(1) == "b") {
            if ((i + j) % 2 == 0) {
              whitePieces.push(chessGrid[i][j] + "w");
            } else {
              whitePieces.push(chessGrid[i][j] + "b");
            }
          } else {
            whitePieces.push(chessGrid[i][j]);
          }
        } else {
          if (chessGrid[i][j].charAt(1) == "b") {
            if ((i + j) % 2 == 0) {
              blackPieces.push(chessGrid[i][j] + "w");
            } else {
              blackPieces.push(chessGrid[i][j] + "b");
            }
          } else {
            blackPieces.push(chessGrid[i][j]);
          }
        }
      }
    }
  }
  whitePieces.sort();
  blackPieces.sort();
  if (whitePieces.toString() == "wk" && blackPieces.toString() == "bk") {
    endGame("Insufficient Material! White and Black draw!");
  } else if (
    (whitePieces.toString() == "wbw,wk" && blackPieces.toString() == "bk") ||
    (whitePieces.toString() == "wbb,wk" && blackPieces.toString() == "bk") ||
    (whitePieces.toString() == "wk" && blackPieces.toString() == "bbw,bk") ||
    (whitePieces.toString() == "wk" && blackPieces.toString() == "bbb,bk")
  ) {
    endGame("Insufficient Material! White and Black draw!");
  } else if (
    (whitePieces.toString() == "wk,wn" && blackPieces.toString() == "bk") ||
    (whitePieces.toString() == "wk" && blackPieces.toString() == "bk,bn")
  ) {
    endGame("Insufficient Material! White and Black draw!");
  } else if (
    (whitePieces.toString() == "wbw,wk" &&
      blackPieces.toString() == "bbw, bk") ||
    (whitePieces.toString() == "wbb,wk" && blackPieces.toString() == "bbb,bk")
  ) {
    endGame("Insufficient Material! White and Black draw!");
  }
}

function checkThreeFold() {
  if (boardFreq.get(chessGrid.toString()) == 3) {
    endGame("Three Fold Repetition! White and Black draw!");
  }
}

function checkPromotion(coordinates) {
  var pieces = [];
  if (getPiece(coordinates) == "wp" && coordinates.charAt(1) == 8) {
    pieces = [
      charMap.get("wq"),
      charMap.get("wn"),
      charMap.get("wr"),
      charMap.get("wb"),
    ];
  } else if (getPiece(coordinates) == "bp" && coordinates.charAt(1) == 1) {
    pieces = [
      charMap.get("bq"),
      charMap.get("bn"),
      charMap.get("br"),
      charMap.get("bb"),
    ];
  }
  if (pieces.length !== 0) {
    promotionButtons = document.getElementsByClassName("promotion");
    for (var i = 0; i < promotionButtons.length; i++) {
      promotionButtons[i].innerHTML = pieces[i];
    }
    var promotion = document.getElementsByClassName("promotionSection");
    for (var i = 0; i < promotion.length; i++) {
      promotion[i].classList.toggle("show");
    }
    possibleMoves.clear();
    turn = turn == "w" ? "b" : "w";
  }
  return pieces.length !== 0;
}

function getIndices(coordinates) {
  return [
    Number(coordinates.charAt(1)) * -1 + 8,
    coordinates.charCodeAt(0) - 97,
  ];
}

function getCoordinates(i, j) {
  return String.fromCharCode(97 + j) + (i * -1 + 8).toString();
}

function getPossibleMoves(i, j, piece) {
  var coordinates = getCoordinates(i, j);
  var oppColor = turn == "w" ? "b" : "w";
  if (!possibleMoves.has(coordinates)) {
    possibleMoves.set(coordinates, new Set());
  }
  var kingI = turn == "w" ? whiteKing[0] : blackKing[0];
  var kingJ = turn == "w" ? whiteKing[1] : blackKing[1];
  if (piece == "b" || piece == "q") {
    for (var x = 0; x < B_MOVES.length; x++) {
      var tempi = i + B_MOVES[x][0];
      var tempj = j + B_MOVES[x][1];
      while (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == "") {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
        tempi += B_MOVES[x][0];
        tempj += B_MOVES[x][1];
      }
      if (
        inBounds(tempi, tempj) &&
        chessGrid[tempi][tempj].charAt(0) == oppColor
      ) {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
      }
    }
  }
  if (piece == "r" || piece == "q") {
    for (var x = 0; x < R_MOVES.length; x++) {
      var tempi = i + R_MOVES[x][0];
      var tempj = j + R_MOVES[x][1];
      while (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == "") {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
        tempi += R_MOVES[x][0];
        tempj += R_MOVES[x][1];
      }
      if (
        inBounds(tempi, tempj) &&
        chessGrid[tempi][tempj].charAt(0) == oppColor
      ) {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
      }
    }
  }
  if (piece == "n") {
    for (var x = 0; x < N_MOVES.length; x++) {
      var tempi = i + N_MOVES[x][0];
      var tempj = j + N_MOVES[x][1];
      if (
        inBounds(tempi, tempj) &&
        (chessGrid[tempi][tempj] == "" ||
          chessGrid[tempi][tempj].charAt(0) == oppColor)
      ) {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
      }
    }
  }
  if (piece == "k") {
    for (var x = 0; x < K_MOVES.length; x++) {
      var tempi = i + K_MOVES[x][0];
      var tempj = j + K_MOVES[x][1];
      if (
        inBounds(tempi, tempj) &&
        (chessGrid[tempi][tempj] == "" ||
          chessGrid[tempi][tempj].charAt(0) == oppColor)
      ) {
        var temp = chessGrid[tempi][tempj];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[tempi][tempj] = turn + piece;
        kingI += K_MOVES[x][0];
        kingJ += K_MOVES[x][1];
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(tempi, tempj));
        }
        kingI -= K_MOVES[x][0];
        kingJ -= K_MOVES[x][1];
        chessGrid[tempi][tempj] = temp;
        chessGrid[i][j] = temp2;
      }
    }
    if (!kingInCheck(kingI, kingJ)) {
      checkCastle(i, j, coordinates);
    }
  }
  if (piece == "p") {
    if (turn == "b") {
      if (
        inBounds(i + 1, j - 1) &&
        ((chessGrid[i + 1][j - 1] !== "" &&
          chessGrid[i + 1][j - 1].charAt(0) == oppColor) ||
          (lastMove[0].charAt(1) == 2 &&
            lastMove[1] == getCoordinates(4, j - 1) &&
            chessGrid[i][j - 1] == "wp"))
      ) {
        var temp = chessGrid[i + 1][j - 1];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i + 1][j - 1] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i + 1, j - 1));
        }
        chessGrid[i + 1][j - 1] = temp;
        chessGrid[i][j] = temp2;
      }
      if (
        inBounds(i + 1, j + 1) &&
        ((chessGrid[i + 1][j + 1] !== "" &&
          chessGrid[i + 1][j + 1].charAt(0) == oppColor) ||
          (lastMove[0].charAt(1) == 2 &&
            lastMove[1] == getCoordinates(4, j + 1) &&
            chessGrid[i][j + 1] == "wp"))
      ) {
        var temp = chessGrid[i + 1][j + 1];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i + 1][j + 1] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i + 1, j + 1));
        }
        chessGrid[i + 1][j + 1] = temp;
        chessGrid[i][j] = temp2;
      }
      if (inBounds(i + 1, j) && chessGrid[i + 1][j] == "") {
        var temp = chessGrid[i + 1][j];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i + 1][j] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i + 1, j));
        }
        chessGrid[i + 1][j] = temp;
        chessGrid[i][j] = temp2;
        if (inBounds(i + 2, j) && chessGrid[i + 2][j] == "" && i == 1) {
          temp = chessGrid[i + 2][j];
          temp2 = chessGrid[i][j];
          chessGrid[i][j] = "";
          chessGrid[i + 2][j] = turn + piece;
          if (!kingInCheck(kingI, kingJ)) {
            possibleMoves.get(coordinates).add(getCoordinates(i + 2, j));
          }
          chessGrid[i + 2][j] = temp;
          chessGrid[i][j] = temp2;
        }
      }
    } else {
      if (
        inBounds(i - 1, j - 1) &&
        ((chessGrid[i - 1][j - 1] !== "" &&
          chessGrid[i - 1][j - 1].charAt(0) == oppColor) ||
          (lastMove[0].charAt(1) == 7 &&
            lastMove[1] == getCoordinates(3, j - 1) &&
            chessGrid[i][j - 1] == "bp"))
      ) {
        var temp = chessGrid[i - 1][j - 1];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i - 1][j - 1] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i - 1, j - 1));
        }
        chessGrid[i - 1][j - 1] = temp;
        chessGrid[i][j] = temp2;
      }
      if (
        inBounds(i - 1, j + 1) &&
        ((chessGrid[i - 1][j + 1] !== "" &&
          chessGrid[i - 1][j + 1].charAt(0) == oppColor) ||
          (lastMove[0].charAt(1) == 7 &&
            lastMove[1] == getCoordinates(3, j + 1) &&
            chessGrid[i][j + 1] == "bp"))
      ) {
        var temp = chessGrid[i - 1][j + 1];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i - 1][j + 1] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i - 1, j + 1));
        }
        chessGrid[i - 1][j + 1] = temp;
        chessGrid[i][j] = temp2;
      }
      if (inBounds(i - 1, j) && chessGrid[i - 1][j] == "") {
        var temp = chessGrid[i - 1][j];
        var temp2 = chessGrid[i][j];
        chessGrid[i][j] = "";
        chessGrid[i - 1][j] = turn + piece;
        if (!kingInCheck(kingI, kingJ)) {
          possibleMoves.get(coordinates).add(getCoordinates(i - 1, j));
        }
        chessGrid[i - 1][j] = temp;
        chessGrid[i][j] = temp2;
        if (inBounds(i - 2, j) && chessGrid[i - 2][j] == "" && i == 6) {
          temp = chessGrid[i - 2][j];
          temp2 = chessGrid[i][j];
          chessGrid[i][j] = "";
          chessGrid[i - 2][j] = turn + piece;
          if (!kingInCheck(kingI, kingJ)) {
            possibleMoves.get(coordinates).add(getCoordinates(i - 2, j));
          }
          chessGrid[i - 2][j] = temp;
          chessGrid[i][j] = temp2;
        }
      }
    }
  }
}

function kingInCheck(i, j) {
  var oppColor = turn == "w" ? "b" : "w";
  for (var x = 0; x < B_MOVES.length; x++) {
    var tempi = i + B_MOVES[x][0];
    var tempj = j + B_MOVES[x][1];
    while (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == "") {
      tempi += B_MOVES[x][0];
      tempj += B_MOVES[x][1];
    }
    if (
      inBounds(tempi, tempj) &&
      (chessGrid[tempi][tempj] == oppColor + "b" ||
        chessGrid[tempi][tempj] == oppColor + "q")
    ) {
      return true;
    }
  }
  for (var x = 0; x < R_MOVES.length; x++) {
    var tempi = i + R_MOVES[x][0];
    var tempj = j + R_MOVES[x][1];
    while (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == "") {
      tempi += R_MOVES[x][0];
      tempj += R_MOVES[x][1];
    }
    if (
      inBounds(tempi, tempj) &&
      (chessGrid[tempi][tempj] == oppColor + "r" ||
        chessGrid[tempi][tempj] == oppColor + "q")
    ) {
      return true;
    }
  }
  for (var x = 0; x < N_MOVES.length; x++) {
    var tempi = i + N_MOVES[x][0];
    var tempj = j + N_MOVES[x][1];
    if (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == oppColor + "n") {
      return true;
    }
  }
  for (var x = 0; x < K_MOVES.length; x++) {
    var tempi = i + K_MOVES[x][0];
    var tempj = j + K_MOVES[x][1];
    if (inBounds(tempi, tempj) && chessGrid[tempi][tempj] == oppColor + "k") {
      return true;
    }
  }
  if (
    (oppColor == "w" &&
      inBounds(i + 1, j - 1) &&
      chessGrid[i + 1][j - 1] == oppColor + "p") ||
    (inBounds(i + 1, j + 1) && chessGrid[i + 1][j + 1] == oppColor + "p")
  ) {
    return true;
  } else if (
    (oppColor == "b" &&
      inBounds(i - 1, j - 1) &&
      chessGrid[i - 1][j - 1] == oppColor + "p") ||
    (inBounds(i - 1, j + 1) && chessGrid[i - 1][j + 1] == oppColor + "p")
  ) {
    return true;
  }
  return false;
}

function inBounds(i, j) {
  return i >= 0 && j >= 0 && i < chessGrid.length && j < chessGrid.length;
}

function findKings() {
  arr = [
    [-100, 100],
    [-100, -100],
  ];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (chessGrid[i][j] == "wk") {
        arr[0] = [i, j];
      } else if (chessGrid[i][j] == "bk") {
        arr[1] = [i, j];
      }
    }
  }
  return arr;
}

function isValidBoard() {
  var whiteKings = 0;
  var blackKings = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (chessGrid[i][j] == "wk") {
        whiteKings++;
      } else if (chessGrid[i][j] == "bk") {
        blackKings++;
      }
    }
  }
  if (whiteKings != 1 || blackKings != 1) {
    return false;
  }
  for (var i = 0; i < 8; i++) {
    if (chessGrid[0][i] !== "" && chessGrid[0][i].charAt(1) == "p") {
      return false;
    }
    if (chessGrid[7][i] !== "" && chessGrid[7][i].charAt(1) == "p") {
      return false;
    }
  }
  if (turn == "b" && kingInCheck(blackKing[0], blackKing[1])) {
    return false;
  }
  if (turn == "w" && kingInCheck(whiteKing[0], whiteKing[1])) {
    return false;
  }
  return true;
}

function endGame(text) {
  gameFinished = true;
  document.getElementById("text").classList.toggle("show");
  document.getElementById("text").textContent = text;
}
