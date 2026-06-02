const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 1;
let gameOver = false;
let vsAI = false;

let player1Score = 0;
let player2Score = 0;

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const scoreText = document.getElementById("score");

createBoard();

function createBoard() {

    board = [];
    boardElement.innerHTML = "";

    for(let r=0;r<ROWS;r++){

        board[r] = [];

        for(let c=0;c<COLS;c++){

            board[r][c] = 0;

            const cell = document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", () => {
                makeMove(c);
            });

            boardElement.appendChild(cell);
        }
    }

    currentPlayer = 1;
    gameOver = false;

    updateStatus();
}

function makeMove(col){

    if(gameOver) return;

    let row = getRow(col);

    if(row === -1) return;

    board[row][col] = currentPlayer;

    renderBoard();

    if(checkWinner(row,col)){

        gameOver = true;

        if(currentPlayer === 1){
            player1Score++;
        }else{
            player2Score++;
        }

        updateScore();

        setTimeout(() => {

            showPopup(
                currentPlayer === 1
                ? "🎉 Player 1 Wins!"
                : vsAI
                    ? "🤖 AI Wins!"
                    : "🎉 Player 2 Wins!"
            );

        },200);

        return;
    }

    if(isBoardFull()){

        gameOver = true;

        setTimeout(() => {
            showPopup("🤝 Match Draw!");
        },200);

        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;

    updateStatus();

    if(vsAI && currentPlayer === 2){

        statusText.innerText = "AI Thinking...";

        setTimeout(() => {
            aiMove();
        },700);
    }
}

function aiMove(){

    if(gameOver) return;

    let validCols = [];

    for(let c=0;c<COLS;c++){

        if(getRow(c) !== -1){
            validCols.push(c);
        }
    }

    if(validCols.length === 0) return;

    let randomCol =
        validCols[Math.floor(Math.random() * validCols.length)];

    makeMove(randomCol);
}

function getRow(col){

    for(let r=ROWS-1;r>=0;r--){

        if(board[r][col] === 0){
            return r;
        }
    }

    return -1;
}

function renderBoard(){

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {

        const row = cell.dataset.row;
        const col = cell.dataset.col;

        cell.classList.remove("player1","player2");

        if(board[row][col] === 1){
            cell.classList.add("player1");
        }

        if(board[row][col] === 2){
            cell.classList.add("player2");
        }
    });
}

function checkWinner(row,col){

    return (
        checkDirection(row,col,1,0) ||
        checkDirection(row,col,0,1) ||
        checkDirection(row,col,1,1) ||
        checkDirection(row,col,1,-1)
    );
}

function checkDirection(row,col,rowDir,colDir){

    let count = 1;

    count += countCells(row,col,rowDir,colDir);

    count += countCells(row,col,-rowDir,-colDir);

    return count >= 4;
}

function countCells(row,col,rowDir,colDir){

    let count = 0;

    let player = board[row][col];

    let r = row + rowDir;
    let c = col + colDir;

    while(
        r >=0 &&
        r < ROWS &&
        c >=0 &&
        c < COLS &&
        board[r][c] === player
    ){

        count++;

        r += rowDir;
        c += colDir;
    }

    return count;
}

function isBoardFull(){

    for(let c=0;c<COLS;c++){

        if(board[0][c] === 0){
            return false;
        }
    }

    return true;
}

function updateStatus(){

    if(vsAI){

        statusText.innerText =
            currentPlayer === 1
            ? "Player 1 Turn"
            : "AI Turn";

    }else{

        statusText.innerText =
            currentPlayer === 1
            ? "Player 1 Turn"
            : "Player 2 Turn";
    }
}

function updateScore(){

    scoreText.innerText =
        `Player 1: ${player1Score} | Player 2: ${player2Score}`;
}

function restartGame(){

    createBoard();
}

function setAI(value){

    vsAI = value;

    restartGame();
}

function showPopup(message){

    const popup = document.createElement("div");

    popup.classList.add("popup");

    popup.innerHTML = `
        <div class="popup-content">
            <h1>${message}</h1>

            <button onclick="closePopup()">
                Play Again
            </button>
        </div>
    `;

    document.body.appendChild(popup);
}

function closePopup(){

    const popup = document.querySelector(".popup");

    if(popup){
        popup.remove();
    }

    restartGame();
}