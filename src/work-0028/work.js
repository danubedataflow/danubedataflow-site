import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0028 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 5, 4),
            this.makeSlider('numPoints', 'Number of points per tile: {0}', 4, 10, 7),
            this.makeSlider('exponentsRange', 'Exponent range: {0} to {1}', 0.2, 5, [2, 3], 0.1),
        );
    }
    drawWork() {
        this.clearCanvas();
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile center so rotate() and scale() happen there
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                // Tile background: scale down to leave space between tiles
                this.ctx.scale(0.8, 0.8);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
                // Draw the tile. Scale down to leave a border on each tile.
                this.ctx.scale(0.8, 0.8);
                this.ctx.rotate(MathUtils.randomIntUpTo(4) * Math.PI / 2);
                // The following code assumes that (0, 0) is in the tile's upper left
                this.ctx.translate(-tileDim / 2, -tileDim / 2);
                // Get a random exponent for each tile
                let exponent = this.randomFloatRange(...this.ctrl.exponentsRange);
                let dim = tileDim / this.ctrl.numPoints;
                for (let y = 1; y <= this.ctrl.numPoints; y++) {
                    for (let x = 1; x <= this.ctrl.numPoints; x++) {
                        this.ctx.save();
                        this.ctx.translate((x - 1) * dim, (y - 1) * dim);
                        // 0 < yPercent < 1, so the higher the exponent the more
                        // likely a rectangle will be drawn.
                        let yPercent = (y - 1) / this.ctrl.numPoints;
                        this.ctx.scale(0.9, 0.9); // to have space between the squares
                        if (MathUtils.random() > Math.pow(yPercent, exponent)) {
                            this.ctx.fillStyle = 'black';
                            this.ctx.fillRect(0, 0, dim, dim);
                        }
                        this.ctx.restore();
                    }
                }
                this.ctx.restore();
            }
        }
    }
    randomFloatRange(lowerBound, upperBound) {
        return lowerBound + MathUtils.random() * (upperBound + 1 - lowerBound);
    }
    description = `Take a probability value that goes from 0 at the top to 1 at the bottom. In order for a square to be drawn in a row, a random number must be larger than the probability value raised to the power of a given value. So the higher the exponent, the lower the threshold becomes, and the more likely it is that a square will be drawn.`;
    createdDate = '2023-10-05';
}
