import { COORD, iCOORD } from "./coord";
import { Shape } from "./shape";
import Color from "color";
const squareSize = 40;
const gameBoardSquaresWidthCount = 10;
const gameBoardSquaresHeightCount = 20;

const canvasWidth = gameBoardSquaresWidthCount * squareSize;
const canvasHeight = gameBoardSquaresHeightCount * squareSize;
export class GameBoard {
    private grid = Array.from(new Array(gameBoardSquaresWidthCount))
        .map(() => Array.from(new Array(gameBoardSquaresHeightCount)).map(() => ""));
    private canvasBoard;
    private canvasPieces;
    private ctxBoard;
    private ctxPieces;
    constructor(args: { parentElement: HTMLElement | null }) {
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
        if (!ctxBoard || !ctxPieces) throw new Error("Unable to create context");
        this.ctxBoard = ctxBoard;
        this.ctxPieces = ctxPieces;
        this.ctxBoard.strokeStyle = "#AAA";
        this.ctxBoard.lineWidth = 0.5;
    }
    /**Get a list of all co-ordinates and rotations that shape can be placed in */
    getShapeAvailablePlaces(shape: Shape) {
        const places: [COORD, number][] = [];
        for (let r = 0; r < 4; r++) {
            //find locations shape can be placed in
            for (let x = 0; x < gameBoardSquaresWidthCount; x++) {
                for (let y = 0; y < gameBoardSquaresHeightCount; y++) {
                    const c = new COORD({ x, y });
                    if (this.canDrawShape(shape, c))
                        places.push([c, r]);
                }
            }
            shape.rotate()
        }
        return places;
    }
    destroyPixel(location: iCOORD, withConnected: boolean) {
        const color = this.grid[location.x][location.y];
        if (color) {
            this.grid[location.x][location.y] = "";
            this.ctxPieces.clearRect(location.x * squareSize, location.y * squareSize, squareSize, squareSize);
            if (withConnected) {
                const colorR = this.grid[location.x + 1]?.[location.y];
                const colorL = this.grid[location.x - 1]?.[location.y];
                const colorU = this.grid[location.x]?.[location.y - 1];
                const colorD = this.grid[location.x]?.[location.y + 1];
                if (colorR === color)
                    this.destroyPixel({ ...location, x: location.x + 1 }, true);
                if (colorL === color)
                    this.destroyPixel({ ...location, x: location.x - 1 }, true);
                if (colorU === color)
                    this.destroyPixel({ ...location, y: location.y - 1 }, true);
                if (colorD === color)
                    this.destroyPixel({ ...location, y: location.y + 1 }, true);
            }
        }
    }
    destroyCompleteLines() {
        const completeColumns = this.grid.map((col, x) => {
            if (!col.some(v => !v)) return [x];
            return []
        }).flat();
        const completeRows: number[] = [];
        for (let y = 0; y < gameBoardSquaresHeightCount; y++) {
            const row = Array.from(new Array(gameBoardSquaresWidthCount))
                .map((_, idx) => this.grid[idx][y]);
            if (!row.some(v => !v))
                completeRows.push(y);
        }
        this.ctxPieces.beginPath();
        for (const x of completeColumns) {
            for (let y = 0; y < gameBoardSquaresHeightCount; y++) {
                this.destroyPixel({ x, y }, false)
            }
        }
        for (const y of completeRows) {
            for (let x = 0; x < gameBoardSquaresWidthCount; x++) {
                this.destroyPixel({ x, y }, false)
            }
        }
        console.log(completeColumns, completeRows)
        this.ctxPieces.stroke();
    }
    getCompleteLines() {
        const completeColumns = this.grid.map((col, x) => {
            if (!col.some(v => !v)) return [x];
            return []
        }).flat();
        const completeRows: number[] = [];
        for (let y = 0; y < gameBoardSquaresHeightCount; y++) {
            const row = Array.from(new Array(gameBoardSquaresWidthCount))
                .map((_, idx) => this.grid[idx][y]);
            if (!row.some(v => !v))
                completeRows.push(y);
        }
        return { completeColumns, completeRows }
    }
    drawBoard() {
        for (let x = 1; x < gameBoardSquaresWidthCount; x++) {
            const lineX = x * squareSize - this.ctxBoard.lineWidth;
            const lineYStart = 0
            const lineYEnd = canvasHeight;
            this.ctxBoard.beginPath();
            this.ctxBoard.moveTo(lineX, lineYStart);
            this.ctxBoard.lineTo(lineX, lineYEnd);
            this.ctxBoard.stroke();
        }

        for (let y = 1; y < gameBoardSquaresHeightCount; y++) {
            const lineY = y * squareSize - this.ctxBoard.lineWidth / 2;
            const lineXStart = 0
            const lineXEnd = canvasWidth;
            this.ctxBoard.beginPath();
            this.ctxBoard.moveTo(lineXStart, lineY);
            this.ctxBoard.lineTo(lineXEnd, lineY);
            this.ctxBoard.stroke();
        }
    }
    /**add the co-ordinates for a shape to the coordinates for it's pixels */
    private getPixelsWithOffset(shape: Shape, at: iCOORD) {
        const pixels = shape.getPixels();
        return pixels.map(p => p.offset(at))
    }
    /**test if a shape can be drawn at the coordinates given */
    canDrawShape(shape: Shape, at: iCOORD) {
        const pixels = this.getPixelsWithOffset(shape, at);
        for (const pixel of pixels) {
            //test if shape can be drawn here
            if (
                pixel.x >= gameBoardSquaresWidthCount
                || pixel.y >= gameBoardSquaresHeightCount
                || pixel.x < 0 || pixel.y < 0
            ) {
                return false;
            }
            if (this.grid[pixel.x][pixel.y] !== "")
                return false;
        }
        return true;
    }
    place(shape: Shape, at: COORD) {
        const pixels = this.getPixelsWithOffset(shape, at);
        for (const pixel of pixels) {
            this.grid[pixel.x][pixel.y] = shape.color;
        }
        this.drawOrClearShape(shape, at, true);
        this.drawOrClearShape(shape, at, false, 0.4);
    }
    private drawPixel(pixel: iCOORD, color: string, opacity: number) {
        const borderWidth = squareSize / 10;
        const mainColor = Color(color).alpha(opacity).toString();
        const hiColor = Color("#FFF").alpha(opacity * 0.4).toString();
        const lowColor = Color("#000").alpha(opacity * 0.4).toString();
        this.ctxPieces.fillStyle = mainColor;
        this.ctxPieces.fillRect(pixel.x * squareSize, pixel.y * squareSize, squareSize, squareSize);
        //top edge
        this.ctxPieces.beginPath();
        this.ctxPieces.fillStyle = hiColor;
        this.ctxPieces.moveTo(pixel.x * squareSize, pixel.y * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize, pixel.y * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize - borderWidth, borderWidth + pixel.y * squareSize);
        this.ctxPieces.lineTo(pixel.x * squareSize + borderWidth, borderWidth + pixel.y * squareSize);
        this.ctxPieces.closePath();
        this.ctxPieces.fill();
        //right edge
        this.ctxPieces.beginPath();
        this.ctxPieces.fillStyle = lowColor;
        this.ctxPieces.moveTo((1 + pixel.x) * squareSize, pixel.y * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize, (1 + pixel.y) * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize - borderWidth, (1 + pixel.y) * squareSize - borderWidth);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize - borderWidth, pixel.y * squareSize + borderWidth);
        this.ctxPieces.closePath();
        this.ctxPieces.fill();
        //left edge
        this.ctxPieces.beginPath();
        this.ctxPieces.fillStyle = hiColor;
        this.ctxPieces.moveTo((pixel.x) * squareSize, pixel.y * squareSize);
        this.ctxPieces.lineTo((pixel.x) * squareSize, (1 + pixel.y) * squareSize);
        this.ctxPieces.lineTo((pixel.x) * squareSize + borderWidth, (1 + pixel.y) * squareSize - borderWidth);
        this.ctxPieces.lineTo((pixel.x) * squareSize + borderWidth, pixel.y * squareSize + borderWidth);
        this.ctxPieces.closePath();
        this.ctxPieces.fill();
        //bottom edge
        this.ctxPieces.beginPath();
        this.ctxPieces.fillStyle = lowColor;
        this.ctxPieces.moveTo(pixel.x * squareSize, (1 + pixel.y) * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize, (1 + pixel.y) * squareSize);
        this.ctxPieces.lineTo((1 + pixel.x) * squareSize - borderWidth, (1 + pixel.y) * squareSize - borderWidth);
        this.ctxPieces.lineTo(pixel.x * squareSize + borderWidth, (1 + pixel.y) * squareSize - borderWidth);
        this.ctxPieces.closePath();
        this.ctxPieces.fill();
    }
    //** draw or erase a shape from the canvas
    private drawOrClearShape(shape: Shape, at: COORD, clear: boolean, opacity = 1) {
        const pixels = this.getPixelsWithOffset(shape, at);

        for (const pixel of pixels) {
            this.ctxPieces.clearRect(
                pixel.x * squareSize,
                pixel.y * squareSize,
                squareSize,
                squareSize);
            if (!clear)
                this.drawPixel(pixel, shape.color, opacity)
        }
    }
    drawShape(shape: Shape, at: COORD) {
        return this.drawOrClearShape(shape, at, false);
    }
    clearShape(shape: Shape, at: COORD) {
        return this.drawOrClearShape(shape, at, true);
    }
    log() {
        for (let y = 0; y < gameBoardSquaresHeightCount; y++) {
            const str = this.grid.map(v => v[y] ? "X" : " ");
            console.log(str);
        }

    }
}
