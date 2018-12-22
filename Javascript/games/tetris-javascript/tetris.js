const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

ctx.scale(20, 20);

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, screen.width, screen.height);

let game = {
    posCurrElement: { x: 10, y: 0 },
    currElement: createElement(),
    board: createBoard(20, 30)
}

function createBoard(w, h) {
    const board = [];
    for (let i = 0; i < h; i++) {
        board.push(new Array(w).fill(0));
    }
    board[15][15] = 1;
    return board;
}



function createElement() {
    const element = [
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ];
    return element;
}

function drawElement(el, offset) {
    el.forEach((row, j) => {
        row.forEach((v, i) => {
            if (v !== 0)
                console.log(v, i, j);
            if (v !== 0) {
                ctx.fillStyle = "green";
                ctx.fillRect(i + offset.x, j + offset.y, 1, 1);
            }
        });
    });
}



function draw() {
    const { currElement, board, posCurrElement } = game;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, screen.width, screen.height);
    drawElement(board, { x: 0, y: 0 });
    drawElement(currElement, posCurrElement);
}

let lastUpdateTime = 0;
let dropTime = 0; // tempo dall'ultimo drop
let dropNum = 0;
let dropDelay = 2000;

function collide(game) {
    const { currElement, posCurrElement, board } = game;
    for (let y = 0; y < currElement.length; y++) {
        for (let x = 0; x < currElement[0].length; x++) {

            if (currElement[y][x] !== 0 &&
                (board[y + posCurrElement.y] && board[y + posCurrElement.y][x + posCurrElement.x]) !== 0) {
                return true;

            }
            if (currElement[y][x] !== 0 && (y + posCurrElement.y) > board.length) return true;
        }
    }
    return false;
}

function mergeElementAndBoard(game) {
    const  { board, currElement, posCurrElement } = game;
    console.table(currElement);
    currElement.forEach((row, y) => {

        row.forEach((v, x) => {
            console.log("MERGE->", v, y + posCurrElement.y, x + posCurrElement.x, board[y + posCurrElement.y]);
            if (v !== 0) {
                board[y + posCurrElement.y][x + posCurrElement.x] = v;
            }
        })
    })
}

function resetElement() {
    game.posCurrElement.y = 0;
    game.posCurrElement.x = 10;
    game.currElement = createElement();
}

function dropElement() {

    game.posCurrElement.y++;
    if (collide(game)) {
        console.log("COLLIDE")
        game.posCurrElement.y--;
        mergeElementAndBoard(game);
        resetElement();

    }
    dropTime = 0;
}

function update(time = 0) {
    const deltaTime = time - lastUpdateTime;
    lastUpdateTime = time;
    //console.log(deltaTime);
    dropTime += deltaTime;

    if (dropTime > dropDelay) {
        dropElement();
    }

    draw();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
    const { key, keyCode } = event;
    /*
    const key = event.key;
    const.keyCode = event.keyCode;
    */
    //console.log(event.key, event.keyCode);
    if (event.key === "ArrowRight") {
        console.log("DESTRA")
        game.posCurrElement.x++;
    }
    if (event.key === "ArrowLeft") {
        console.log("SINISTRA")
        game.posCurrElement.x--;
    }
    if (event.key === "ArrowDown") {
        console.log("IN BASSO");
        dropElement();
    }
})

update();