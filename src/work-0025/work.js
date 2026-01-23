import {
    Work
} from '/js/ui.js';
import {
    randomIntPlusMinus
} from '/js/math.js';
class Work0025 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
            this.makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 30, 15),
            this.makeSlider('numSquaresPerTile', 'Number of squares per tile: {0}', 2, 20, 10),
        );
    }
    drawWork() {
        this.ctx.save();
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        // pad the work
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.scale(0.9, 0.9);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                let tileULX = (x - 1) * tileDim;
                let tileULY = (y - 1) * tileDim;
                for (let i = 0; i < this.ctrl.numSquaresPerTile; i++) {
                    let xOffset = randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                    let yOffset = randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                    this.ctx.strokeRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
                }
            }
        }
        this.ctx.restore();
    }
    description = `Each tile contains a number of stroked squares, each randomly offset. Inspired by Vera Molnár.`;
    createdDate = '2023-09-29';
}
new Work0025().run();