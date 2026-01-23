tileIterator(callback, scanOrder = 'xy') {
    let tileDim = Math.floor(this.width / ctrl.numTiles);
    let handleTile = (x, y, tileDim, callback) => {
        this.ctx.save();
        // translate to tile center so any scale() or rotate() happen there
        this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
        callback(new Tile(x, y, tileDim));
        this.ctx.restore();
    };
    if (scanOrder == 'xy') {
        // each row (top-to-bottom): left-to-right
        for (let y = 0; y < this.ctrl.numTiles; y++) {
            for (let x = 0; x < this.ctrl.numTiles; x++) {
                handleTile(x, y, tileDim, callback);
            }
        }
    } else if (scanOrder == 'yx') {
        // each column (left-to-right): top-to-bottom
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                handleTile(x, y, tileDim, callback);
            }
        }
    } else if (scanOrder == 'serpentine') {
        // rows (top-to-bottom) alternating between left-to-right and
        // right-to-left
        for (let y = 0; y < this.ctrl.numTiles; y++) {
            if (y % 2 == 0) {
                // even rows: left-to-right
                for (let x = 0; x < this.ctrl.numTiles; x++) {
                    handleTile(x, y, tileDim, callback);
                }
            } else {
                // odd rows: right-to-left
                for (let x = this.ctrl.numTiles - 1; x >= 0; x--) {
                    handleTile(x, y, tileDim, callback);
                }
            }
        }
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

    upperMiddle() {
        return new Point(0, -this.tileDim / 2);
    }

    upperRight {
        return new Point(this.tileDim / 2, -this.tileDim / 2);
    }

    middleLeft() {
        return new Point(-this.tileDim / 2, 0);
    }

    center() {
        return new Point(0, 0);
    }

    middleRight {
        return new Point(this.tileDim / 2, 0);
    }

    lowerLeft() {
        return new Point(-this.tileDim / 2, this.tileDim / 2);
    }

    lowerMiddle() {
        return new Point(0, this.tileDim / 2);
    }

    lowerRight() {
        return new Point(this.tileDim / 2, this.tileDim / 2);
    }
}
