
const columns = 30;
const rows = 16;
const minesTotal = 99;
let cellsArray = [[]];
let intervalId = 0;
let time = 0;
let minesLeft = minesTotal;
let cells_isShow = 0;
let startTime
class Cells {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    obj;
    flag = false;
    mine = false;
    num = 0;
    isShow = false;

}

window.onload = function () {
    let cell;
    timeTxt.innerText = time;
    mineTxt.innerText = minesLeft;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            cell = `<div class="cells" data-x_index=${x} data-y_index=${y}> </div>`;
            $('#gameBoard').append(cell);
        }
    }
    init();
    $("#resetBtn").on("click", init)
}
/* ========== 初始化 ========== */
function init() {
    clearBoard();
    cellsArray = [[]];
    intervalId = 0;
    time = 0;
    minesLeft = minesTotal;
    cells_isShow = 0;
    timeTxt.innerText = time;
    mineTxt.innerText = minesLeft;

    cellsArrayCreate();
    $(".cells").each((index, element) => {
        let [x, y] = [Number(element.dataset.x_index), Number(element.dataset.y_index)];
        cellsArray[y][x].obj = element;
        $(element).on("click", (event) => {
            if (!intervalId) {
                startTime = new Date()
                intervalId = setInterval(timing, 100)
            };
            notMine(event);
        });
        $(element).on("contextmenu", (event) => isMine(event));

        // $(element).text(cellsArray[y][x].num); // 測試用
    })
}
function clearBoard() {
    clearInterval(intervalId);
    $(".cells").each((index, element) => {
        $(element).text("")
        $(element).css("backgroundColor", "white");
        $(element).off("click");
        $(element).off("contextmenu");
    })
}

function cellsArrayCreate() {
    for (let y = 0; y < rows; y++) {
        cellsArray[y] = []
        for (let x = 0; x < columns; x++) {
            cellsArray[y][x] = new Cells(x, y);
        }
    }
    mineCreate();
    cellsStatus();
}

function mineCreate() {
    let num = 0;
    let randx = 0, randy = 0;
    while (num < minesTotal) {
        randx = Math.floor(Math.random() * columns);
        randy = Math.floor(Math.random() * rows);
        if (!cellsArray[randy][randx].mine) {
            cellsArray[randy][randx].mine = true;
            num += 1;
        }
    }
}
function cellsStatus() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            for (let nearby_x = ((x - 1) < 0 ? 0 : (x - 1)); nearby_x <= (nearby_x + 1 > columns ? x : x + 1); nearby_x++) {
                for (let nearby_y = ((y - 1) < 0 ? 0 : (y - 1)); nearby_y <= (nearby_y + 1 > rows ? y : y + 1); nearby_y++) {
                    if (cellsArray[nearby_y][nearby_x].mine) cellsArray[y][x].num += 1;
                }
            }
            if (cellsArray[y][x].mine) cellsArray[y][x].num = -1;
        }
    }
}
/* ========== 遊戲function - 點擊  ========== */
function isMine(event) {
    let obj = event.target;
    let [x, y] = [Number(event.target.dataset.x_index), Number(event.target.dataset.y_index)];
    let cell = cellsArray[y][x];
    if (cell.isShow) {
        event.preventDefault();
        return;
    }
    if (cell.flag) {
        cell.flag = false;
        $(obj).css("backgroundColor", "white")
        minesLeft += 1;
        if (cell.mine) {
            cells_isShow -= 1;
        }
    }
    else {
        cell.flag = true;
        $(obj).css("backgroundColor", "red");
        minesLeft -= 1;
        if (cell.mine) {
            cells_isShow += 1;
        }
    }
    mineTxt.innerText = minesLeft;
    event.preventDefault();
}

function notMine(event) {
    let obj = event.target;
    let [x, y] = [Number(event.target.dataset.x_index), Number(event.target.dataset.y_index)];
    let cell = cellsArray[y][x];
    if (cell.flag) return;
    if (cell.mine) {
        gameover(obj);
        return;
    }
    cellsShow(cell, x, y);
}
function cellsShow(cell, x, y) {
    let nearby_cell;
    let nearby_x, nearby_y;
    obj = cell.obj;
    if (!cell.isShow) {
        if (cell.num) {
            cellsShowNum(cell);
        }
        else if (cell.num == 0) {
            cellsShowNone(cell)
            for (nearby_x = ((x - 1) < 0 ? x : (x - 1)); nearby_x <= (nearby_x == columns ? x : x + 1); nearby_x++) {
                for (nearby_y = ((y - 1) < 0 ? y : (y - 1)); nearby_y <= (nearby_y == rows ? y : y + 1); nearby_y++) {
                    nearby_cell = cellsArray[nearby_y][nearby_x];
                    if (nearby_cell.mine) return;
                    else if (nearby_cell.num) cellsShowNum(nearby_cell);
                    else if (nearby_cell.num == 0) cellsShow(nearby_cell, nearby_x, nearby_y);
                }
            }
        }
    }
}
function cellsShowNum(cell) {
    if (!cell.isShow) {
        cell.isShow = true;
        cells_isShow += 1;
        $(cell.obj).text(cell.num);

        $(cell.obj).css("color", "black");
        $(cell.obj).css("backgroundColor", "skyblue");
        $(cell.obj).off("click");
    }
}
function cellsShowNone(cell) {
    if (!cell.isShow) {
        cell.isShow = true;
        cells_isShow += 1;
        $(cell.obj).css("backgroundColor", "gray");
        $(cell.obj).off("click");
    }
}

/* ========== 遊戲function - 時間、過關、game over  ========== */
function timing() {
    time = Math.floor((new Date() - startTime) / 1000);
    timeTxt.innerText = time;
    time += 1;
    if (cells_isShow == (columns * rows)) gamePass();
}
function gameover(obj) {
    $(obj).css("backgroundColor", "black");
    $(".cells").each((index, element) => {
        $(element).off("click");
        $(element).off("contextmenu");
    })
    clearInterval(intervalId);
}
function gamePass(oj) {
    console.log("Pass the game");
    $(".cells").each((index, element) => {
        $(element).off("click");
        $(element).off("contextmenu");
    })
    clearInterval(intervalId);
}

//=============================================================================//
/* 測試用function */
function test1() {
    console.log(cellsArray);
}
function test() {
    let num = 0
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (cellsArray[y][x].isShow) num += 1
        }
    }
    console.log(`cells_isShow =${cells_isShow},num=${num}`);
}
