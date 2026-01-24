import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0025 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
            this.makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 30, 15),
            this.makeSlider('numSquaresPerTile', 'Number of squares per tile: {0}', 2, 20, 10),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.scaleCanvas(0.9); // padding
        this.tileIterator((tile) => {
            for (let i = 0; i < this.ctrl.numSquaresPerTile; i++) {
                let xOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                let yOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                this.strokeSquareForPoint(tile.upperLeft().move(xOffset, yOffset), tile.tileDim);
            }
        });
    }
    description = `Each tile contains a number of stroked squares, each randomly offset. Inspired by Vera Molnár.`;
    createdDate = '2023-09-29';
}
