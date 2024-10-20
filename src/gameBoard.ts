import { COORD } from "./coord";
import { Shape } from "./shape";

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
    private getPixelsWithOffset(shape: Shape, at: COORD) {
        const pixels = shape.getPixels();
        return pixels.map(p => p.offset(at))
    }
    /**test if a shape can be drawn at the coordinates given */
    canDrawShape(shape: Shape, at: COORD) {
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
    }
    //** draw or erase a shape from the canvas
    private drawOrClearShape(shape: Shape, at: COORD, clear: boolean) {
        const pixels = this.getPixelsWithOffset(shape, at);
        this.ctxPieces.fillStyle = shape.color;
        this.ctxPieces.strokeStyle = shape.color;
        this.ctxPieces.beginPath();
        const fn = clear
            ? this.ctxPieces.clearRect.bind(this.ctxPieces)
            : this.ctxPieces.fillRect.bind(this.ctxPieces);
        for (const pixel of pixels) {
            fn(
                pixel.x * squareSize,
                pixel.y * squareSize,
                squareSize,
                squareSize
            );
        }
        this.ctxPieces.stroke();
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
