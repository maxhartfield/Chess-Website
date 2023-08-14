class Node {
    constructor(chessGrid, message) {
        this.chessGrid = chessGrid
        this.message = message
        this.children = []
    }
}

class PuzzleTree {
    constructor(node) {
        this.root = node
    }

    addChildren(node, children) {
        node.children = children
    }
}

//Example
var puzzle1 = new PuzzleTree(new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', 'wp', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', 'wp', 'wp', 'wp', '[]', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Good Luck!"))

puzzle1.addChildren(puzzle1.root, [new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', 'wp', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', 'wp', 'wp', 'wp', '[]', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Nice Move!"), new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', 'wp', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', 'wp', 'wp', '[]', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Nice Move!"), new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Hmm... Not the best move.")])

puzzle1.addChildren(puzzle1.root.children[0], [new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', '[]', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', 'bp', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', 'wp', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', 'wp', 'wp', 'wp', '[]', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Nice Move!")])

puzzle1.addChildren(puzzle1.root.children[0].children[0], [new Node([
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', '[]', 'bp', 'bp', 'bp', 'bp'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', 'wp', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]'],
    ['wp', 'wp', 'wp', 'wp', '[]', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
], "Nice Move!")])

