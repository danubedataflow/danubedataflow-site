tileIterator(scanOrder, callback) {
    let tileDim = Math.floor(this.width / ctrl.numTiles);
    let handleTile = (x, y, tileDim, callback) => {
        this.ctx.save();
        // translate to tile center so any scale() or rotate() happen there
        this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
        callback(new Tile(x, y, tileDim));
        this.ctx.restore();
    };
    if (scanOrder == 'yx') {
        // top-to-bottom; within that left-to-right
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                handleTile(x, y, tileDim, callback);
            }
        }
    } else if (scanOrder == 'xy') {
        // left-to-right; within that top-to-bottom
        for (let y = 0; y < this.ctrl.numTiles; y++) {
            for (let x = 0; x < this.ctrl.numTiles; x++) {
                handleTile(x, y, tileDim, callback);
            }
        }
    } else if (scanOrder == 'serpentine') {
        // rows alternating between left-to-right and right-to-left
    } else if (scanOrder == 'spiral-in') {
        // square spiral
    } else {
        throw new Error(`tileIterator(): invalid scan order '${scanOrder}'`);
    }
}

class Tile {
    constructor(x, y, tileDim) {
        this.x = x;
        this.y = y;
        this.tileDim = tileDim;
    }

    upperLeft() {
        return new Point(-this.tileDim / 2, -this.tileDim / 2);
    }

    upperRight {
        return new Point(this.tileDim / 2, -this.tileDim / 2);
    }

    lowerLeft() {
        return new Point(-this.tileDim / 2, this.tileDim / 2);
    }

    lowerRight() {
        return new Point(this.tileDim / 2, this.tileDim / 2);
    }
}
