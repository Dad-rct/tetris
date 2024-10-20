import { COORD } from "./coord";
import { GameBoard } from "./gameBoard"
import { AllShapeColours, AllShapes, Shape } from "./shape";

let currentShapeIndex = 0;
let currentColorIndex = 0;
let currentShape = new Shape({ shape: AllShapes[currentShapeIndex], color: AllShapeColours[currentColorIndex] });
let currentShapeCOORDS = new COORD({ x: 0, y: 0 });


document.addEventListener("readystatechange", async () => {
    if (document.readyState === "complete") {
        const board = new GameBoard({ parentElement: document.getElementById("boardContainer") });
        board.drawBoard();
        board.drawShape(currentShape, currentShapeCOORDS);
        document.addEventListener("keydown", e => {
            console.log(e.key)
            switch (e.key) {
                case " ":
                    //change of shape
                    board.clearShape(currentShape, currentShapeCOORDS);
                    currentShapeIndex++;
                    currentShapeIndex = currentShapeIndex % AllShapes.length;
                    currentShape = new Shape({ shape: AllShapes[currentShapeIndex], color: AllShapeColours[currentColorIndex] });
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
                case "r": {
                    const oldShape = JSON.parse(JSON.stringify(currentShape.shape));
                    board.clearShape(currentShape, currentShapeCOORDS);
                    currentShape.rotate();
                    if (!board.canDrawShape(currentShape, currentShapeCOORDS)) {
                        currentShape.shape = oldShape;
                    }
                    board.drawShape(currentShape, currentShapeCOORDS)
                    break;
                }
                case "ArrowRight":
                case "ArrowLeft":
                case "ArrowUp":
                case "ArrowDown":
                    const newCOORD = new COORD(currentShapeCOORDS);
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
                    currentShapeCOORDS.y = newCOORD.y
                    board.drawShape(currentShape, currentShapeCOORDS)
                    break;
                case "c":
                    //change colour
                    currentColorIndex++;
                    currentColorIndex = currentColorIndex % AllShapeColours.length;
                    currentShape.color = AllShapeColours[currentColorIndex];
                    board.drawShape(currentShape, currentShapeCOORDS);
                    break;
            }
        })


    }
});