import { COORD } from "./coord";


export type Tuple2<T> = [T, T];
export type Tuple3<T> = [T, T, T];
export type Tuple4<T> = [T, T, T, T];

export type ShapePixel = " " | "X"

export type Square4Shape = Tuple4<Tuple4<ShapePixel>>
export type Square3Shape = Tuple3<Tuple3<ShapePixel>>
export type Square2Shape = Tuple2<Tuple2<ShapePixel>>


// 2 x 2 shapes
export const ShapeO: Square2Shape =
    [
        ['X', 'X'],
        ['X', 'X'],
    ];

//3 x 3 shapes
export const ShapeS: Square3Shape =
    [
        [' ', ' ', ' '],
        [' ', 'X', 'X'],
        ['X', 'X', ' '],
    ];

export const ShapeZ: Square3Shape =
    [
        [' ', ' ', ' '],
        ['X', 'X', ' '],
        [' ', 'X', 'X'],
    ];
export const ShapeL: Square3Shape =
    [
        [' ', 'X', ' '],
        [' ', 'X', ' '],
        [' ', 'X', 'X'],
    ];

export const ShapeJ: Square3Shape =
    [
        [' ', 'X', ' '],
        [' ', 'X', ' '],
        ['X', 'X', ' '],
    ];

export const ShapeT: Square3Shape =
    [
        ['X', 'X', 'X'],
        [' ', 'X', ' '],
        [' ', ' ', ' '],
    ];

//4 x 4 shapes
export const ShapeI: Square4Shape =
    [
        [' ', ' ', 'X', ' '],
        [' ', ' ', 'X', ' '],
        [' ', ' ', 'X', ' '],
        [' ', ' ', 'X', ' '],
    ];

export const AllShapes = [
    ShapeI,
    ShapeJ,
    ShapeL,
    ShapeO,
    ShapeS,
    ShapeT,
    ShapeZ
]
export const AllShapeColours = [
    "#F00",
    "#0F0",
    "#00F",
    "#0FF",
    "#F0F",
    "#FF0",
]
export class Shape {
    shape: Square2Shape | Square3Shape | Square4Shape;
    color;
    constructor(args: {
        shape: Square2Shape | Square3Shape | Square4Shape,
        color: string
    }) {
        this.shape = args.shape;
        this.color = args.color;
    }
    rotate() {
        const out: typeof this.shape = JSON.parse(JSON.stringify(this.shape));
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
                    return [new COORD({ x, y })]
                return [];
            }).flat();
        }).flat();
    }
    log() {
        console.log("------------------------------")
        for (const row of this.shape) {
            console.log(row)
        }
        console.log("------------------------------")
    }
}