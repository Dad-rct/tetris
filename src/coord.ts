export interface iCOORD {
    x: number;
    y: number;
}

export class COORD implements iCOORD {
    x;
    y;
    constructor(args: { x: number, y: number }) {
        this.x = args.x;
        this.y = args.y;
    }
    offset(other: iCOORD) {
        return new COORD({ x: this.x + other.x, y: this.y + other.y });
    }
}