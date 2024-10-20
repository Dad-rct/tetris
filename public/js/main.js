/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../js/producer/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/coord.ts":
/*!**********************!*\
  !*** ./src/coord.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.COORD = void 0;
class COORD {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
    }
    offset(other) {
        return new COORD({ x: this.x + other.x, y: this.y + other.y });
    }
}
exports.COORD = COORD;


/***/ }),

/***/ "./src/gameBoard.ts":
/*!**************************!*\
  !*** ./src/gameBoard.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBoard = void 0;
const squareSize = 40;
const gameBoardSquaresWidthCount = 10;
const gameBoardSquaresHeightCount = 20;
const canvasWidth = gameBoardSquaresWidthCount * squareSize;
const canvasHeight = gameBoardSquaresHeightCount * squareSize;
class GameBoard {
    constructor(args) {
        if (!args.parentElement)
            throw new Error("No parent element");
        this.canvasBoard = document.createElement("canvas");
        this.canvasPieces = document.createElement("canvas");
        args.parentElement.appendChild(this.canvasBoard);
        args.parentElement.appendChild(this.canvasPieces);
        this.canvasBoard.width = this.canvasPieces.width = canvasWidth;
        this.canvasBoard.height = this.canvasPieces.height = canvasHeight;
        this.canvasBoard.id = "canvasBoard";
        this.canvasPieces.id = "canvasPieces";
        this.canvasPieces.style.position = "";
        const ctxBoard = this.canvasBoard.getContext("2d");
        const ctxPieces = this.canvasPieces.getContext("2d");
        if (!ctxBoard || !ctxPieces)
            throw new Error("Unable to create context");
        this.ctxBoard = ctxBoard;
        this.ctxPieces = ctxPieces;
        this.ctxBoard.strokeStyle = "#AAA";
        this.ctxBoard.lineWidth = 0.5;
    }
    drawBoard() {
        for (let x = 1; x < gameBoardSquaresWidthCount; x++) {
            const lineX = x * squareSize - this.ctxBoard.lineWidth / 2;
            const lineYStart = 0;
            const lineYEnd = canvasHeight;
            this.ctxBoard.beginPath();
            this.ctxBoard.moveTo(lineX, lineYStart);
            this.ctxBoard.lineTo(lineX, lineYEnd);
            this.ctxBoard.stroke();
        }
        for (let y = 1; y < gameBoardSquaresHeightCount; y++) {
            const lineY = y * squareSize - this.ctxBoard.lineWidth / 2;
            const lineXStart = 0;
            const lineXEnd = canvasWidth;
            this.ctxBoard.beginPath();
            this.ctxBoard.moveTo(lineXStart, lineY);
            this.ctxBoard.lineTo(lineXEnd, lineY);
            this.ctxBoard.stroke();
        }
    }
    /**add the co-ordinates for a shape to the coordinates for it's pixels */
    getPixelsWithOffset(shape, at) {
        const pixels = shape.getPixels();
        return pixels.map(p => p.offset(at));
    }
    /**test if a shape can be drawn at the coordinates given */
    canDrawShape(shape, at) {
        const pixels = this.getPixelsWithOffset(shape, at);
        for (const pixel of pixels) {
            //test if shape can be drawn here
            if (pixel.x >= gameBoardSquaresWidthCount
                || pixel.y >= gameBoardSquaresHeightCount
                || pixel.x < 0 || pixel.y < 0) {
                return false;
            }
        }
        return true;
    }
    //** draw or erase a shape from the canvas
    drawOrClearShape(shape, at, clear) {
        const pixels = this.getPixelsWithOffset(shape, at);
        this.ctxPieces.fillStyle = shape.color;
        this.ctxPieces.strokeStyle = shape.color;
        this.ctxPieces.beginPath();
        const fn = clear
            ? this.ctxPieces.clearRect.bind(this.ctxPieces)
            : this.ctxPieces.fillRect.bind(this.ctxPieces);
        for (const pixel of pixels) {
            fn(pixel.x * squareSize, pixel.y * squareSize, squareSize, squareSize);
        }
        this.ctxPieces.stroke();
    }
    drawShape(shape, at) {
        return this.drawOrClearShape(shape, at, false);
    }
    clearShape(shape, at) {
        return this.drawOrClearShape(shape, at, true);
    }
}
exports.GameBoard = GameBoard;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const coord_1 = __webpack_require__(/*! ./coord */ "./src/coord.ts");
const gameBoard_1 = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.ts");
const shape_1 = __webpack_require__(/*! ./shape */ "./src/shape.ts");
let currentShapeIndex = 0;
let currentColorIndex = 0;
let currentShape = new shape_1.Shape({ shape: shape_1.AllShapes[currentShapeIndex], color: shape_1.AllShapeColours[currentColorIndex] });
let currentShapeCOORDS = new coord_1.COORD({ x: 0, y: 0 });
document.addEventListener("readystatechange", async () => {
    if (document.readyState === "complete") {
        const board = new gameBoard_1.GameBoard({ parentElement: document.getElementById("boardContainer") });
        board.drawBoard();
        board.drawShape(currentShape, currentShapeCOORDS);
        document.addEventListener("keydown", e => {
            console.log(e.key);
            switch (e.key) {
                case " ":
                    //change of shape
                    board.clearShape(currentShape, currentShapeCOORDS);
                    currentShapeIndex++;
                    currentShapeIndex = currentShapeIndex % shape_1.AllShapes.length;
                    currentShape = new shape_1.Shape({ shape: shape_1.AllShapes[currentShapeIndex], color: shape_1.AllShapeColours[currentColorIndex] });
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
                case "r": {
                    const oldShape = JSON.parse(JSON.stringify(currentShape.shape));
                    board.clearShape(currentShape, currentShapeCOORDS);
                    currentShape.rotate();
                    if (!board.canDrawShape(currentShape, currentShapeCOORDS)) {
                        currentShape.shape = oldShape;
                    }
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
                }
                case "ArrowRight":
                case "ArrowLeft":
                case "ArrowUp":
                case "ArrowDown":
                    const newCOORD = new coord_1.COORD(currentShapeCOORDS);
                    switch (e.key) {
                        case "ArrowRight":
                            newCOORD.x++;
                            break;
                        case "ArrowLeft":
                            newCOORD.x--;
                            break;
                        case "ArrowDown":
                            newCOORD.y++;
                            break;
                        case "ArrowUp":
                            newCOORD.y--;
                            break;
                    }
                    if (!board.canDrawShape(currentShape, newCOORD)) {
                        return;
                    }
                    board.clearShape(currentShape, currentShapeCOORDS);
                    //shape can be drawn at the required location
                    currentShapeCOORDS.x = newCOORD.x;
                    currentShapeCOORDS.y = newCOORD.y;
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
                case "c":
                    //change colour
                    currentColorIndex++;
                    currentColorIndex = currentColorIndex % shape_1.AllShapeColours.length;
                    currentShape.color = shape_1.AllShapeColours[currentColorIndex];
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
            }
        });
    }
});


/***/ }),

/***/ "./src/shape.ts":
/*!**********************!*\
  !*** ./src/shape.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = exports.AllShapeColours = exports.AllShapes = exports.ShapeI = exports.ShapeT = exports.ShapeJ = exports.ShapeL = exports.ShapeZ = exports.ShapeS = exports.ShapeO = void 0;
const coord_1 = __webpack_require__(/*! ./coord */ "./src/coord.ts");
// 2 x 2 shapes
exports.ShapeO = [
    ['X', 'X'],
    ['X', 'X'],
];
//3 x 3 shapes
exports.ShapeS = [
    [' ', ' ', ' '],
    [' ', 'X', 'X'],
    ['X', 'X', ' '],
];
exports.ShapeZ = [
    [' ', ' ', ' '],
    ['X', 'X', ' '],
    [' ', 'X', 'X'],
];
exports.ShapeL = [
    [' ', 'X', ' '],
    [' ', 'X', ' '],
    [' ', 'X', 'X'],
];
exports.ShapeJ = [
    [' ', 'X', ' '],
    [' ', 'X', ' '],
    ['X', 'X', ' '],
];
exports.ShapeT = [
    ['X', 'X', 'X'],
    [' ', 'X', ' '],
    [' ', ' ', ' '],
];
//4 x 4 shapes
exports.ShapeI = [
    [' ', ' ', 'X', ' '],
    [' ', ' ', 'X', ' '],
    [' ', ' ', 'X', ' '],
    [' ', ' ', 'X', ' '],
];
exports.AllShapes = [
    exports.ShapeI,
    exports.ShapeJ,
    exports.ShapeL,
    exports.ShapeO,
    exports.ShapeS,
    exports.ShapeT,
    exports.ShapeZ
];
exports.AllShapeColours = [
    "#F00",
    "#0F0",
    "#00F",
    "#0FF",
    "#F0F",
    "#FF0",
];
class Shape {
    constructor(args) {
        this.shape = args.shape;
        this.color = args.color;
    }
    rotate() {
        const out = JSON.parse(JSON.stringify(this.shape));
        for (const [rowI, row] of this.shape.entries()) {
            for (const [colI, col] of row.entries()) {
                out[colI][row.length - rowI - 1] = col;
            }
        }
        this.shape = out;
    }
    getPixels() {
        return this.shape.map((row, y) => {
            return row.map((val, x) => {
                if (val === "X")
                    return [new coord_1.COORD({ x, y })];
                return [];
            }).flat();
        }).flat();
    }
    log() {
        console.log("------------------------------");
        for (const row of this.shape) {
            console.log(row);
        }
        console.log("------------------------------");
    }
}
exports.Shape = Shape;


/***/ })

/******/ });
//# sourceMappingURL=main.js.map