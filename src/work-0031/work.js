import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0031 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 10, 5),
            this.makeSlider('numLines', 'Number of lines: {0}', 1, 10, 5),
            this.makeSlider('lineWidth', 'Line this.width: {0}', 1, 3, 2),
            this.makeCheckbox('hasBend', 'Bend: '),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            this.ctx.scale(0.9, 0.9);
            // draw a border around the tile
            this.ctx.lineWidth = 1;
            this.strokeRectForPoint(tile.upperLeft(), tile.tileDim, tile.tileDim);
            this.ctx.lineWidth = this.ctrl.lineWidth;
            this.translateToPoint(tile.upperLeft());
            for (let i = 0; i < this.ctrl.numLines; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(MathUtils.randomIntUpTo(tile.tileDim), 0);
                if (this.ctrl.hasBend) this.ctx.lineTo(MathUtils.randomIntUpTo(tile.tileDim), MathUtils.randomIntUpTo(tile.tileDim));
                this.ctx.lineTo(MathUtils.randomIntUpTo(tile.tileDim), tile.tileDim);
                this.ctx.stroke();
            }
        });
    }
    description = `In each tile, a number of random lines are drawn at the given line this.width. Optionally all lines can be split into two, bending around a random point in the middle. Each tile has a border.`;
    createdDate = '2025-01-18';
}