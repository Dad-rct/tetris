import { COORD, iCOORD } from "./coord";
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
        function addShape() {
            board.destroyCompleteLines();
            currentShapeIndex = Math.floor(Math.random() * AllShapes.length);
            currentColorIndex = Math.floor(Math.random() * AllShapeColours.length);
            currentShape = new Shape({
                shape: AllShapes[currentShapeIndex],
                color: AllShapeColours[currentColorIndex]
            });
            const allPlaces = board.getShapeAvailablePlaces(currentShape);

            const place = allPlaces[Math.floor(Math.random() * allPlaces.length)];
            if (!place) {
                return false;
            }
            const [coords, r] = place;
            currentShapeCOORDS = coords;
            for (let i = 0; i < r; i++)
                currentShape.rotate();
            board.log();
            board.drawShape(currentShape, currentShapeCOORDS);
            return true;
        }
        addShape();
        document.addEventListener("keydown", e => {
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
                        //can we maybe acheive same by kicking block to allow for rotation
                        let kickSize = 1;
                        let canKick;
                        const maxKickSize = Math.floor(currentShape.shape[0].length / 2);
                        while (kickSize <= maxKickSize) {
                            const offsets: iCOORD[] = [
                                { x: kickSize, y: 0 },
                                { x: -kickSize, y: 0 },
                                { x: 0, y: kickSize },
                                { x: 0, y: -kickSize }
                            ]
                            canKick = offsets.map(offset => currentShapeCOORDS.offset(offset))
                                .find(coords => {
                                    return (board.canDrawShape(currentShape, coords))
                                });
                            if (canKick)
                                break;
                            kickSize++
                        }
                        if (canKick) {
                            currentShapeCOORDS = canKick
                        } else {
                            currentShape.shape = oldShape;
                        }
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
                case "p":
                    //place
                    board.place(currentShape, currentShapeCOORDS);
                    addShape();
            }
        })


    }
});
