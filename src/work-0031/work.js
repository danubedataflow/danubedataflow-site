import {
    Work
} from '/js/work.js';
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
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to tile center to scale, then back to UL corner
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                this.ctx.scale(0.9, 0.9);
                this.ctx.translate(-tileDim / 2, -tileDim / 2);
                this.ctx.lineWidth = this.ctrl.lineWidth;
                for (let i = 0; i < this.ctrl.numLines; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(MathUtils.randomIntUpTo(tileDim), 0);
                    if (this.ctrl.hasBend) this.ctx.lineTo(MathUtils.randomIntUpTo(tileDim), MathUtils.randomIntUpTo(tileDim));
                    this.ctx.lineTo(MathUtils.randomIntUpTo(tileDim), tileDim);
                    this.ctx.stroke();
                }
                // draw a border around the tile
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(0, 0, tileDim, tileDim);
                this.ctx.restore();
            }
        }
    }
    description = `In each tile, a number of random lines are drawn at the given line this.width. Optionally all lines can be split into two, bending around a random point in the middle. Each tile has a border.`;
    createdDate = '2025-01-18';
}
