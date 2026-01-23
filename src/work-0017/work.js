import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0017 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
            this.makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
            this.makeSlider('scale', 'Scale: {0}', 0.5, 1, 0.9, 0.1),
            this.makeSlider('lineWidthRange', 'Line this.width range: {0} to {1}', 1, 20, [10, 12]),
            this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
        );
    }
    drawWork() {
        this.clearCanvas();
        // Scale down to create a margin so the outermost strokes won't be clipped.
        let dim = this.width; // this.width == this.height because of square canvas
        this.ctx.save();
        this.ctx.translate(dim / 2, dim / 2);
        this.ctx.scale(this.ctrl.scale, this.ctrl.scale);
        this.ctx.translate(-dim / 2, -dim / 2);
        let tileDim = this.width / this.ctrl.numTiles;
        for (let i = 0; i <= this.ctrl.numRects; i++) {
            let ulX = MathUtils.randomIntRange(0, this.ctrl.numTiles - 1);
            let ulY = MathUtils.randomIntRange(0, this.ctrl.numTiles - 1);
            let spanX = MathUtils.randomIntRange(1, this.ctrl.numTiles - ulX);
            let spanY = MathUtils.randomIntRange(1, this.ctrl.numTiles - ulY);
            this.ctx.lineWidth = (MathUtils.randomIntRange(...this.ctrl.lineWidthRange));
            let alpha = MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100;
            this.ctx.strokeStyle = ColorUtils.colorRGBA(0, 0, 0, alpha);
            this.ctx.strokeRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
        }
        this.ctx.restore();
    }
    description = `Random stroked rectangles. The strokes have random weights and transparencies. Each rectangle spans a random number of horizontal and vertical tiles.`;
    createdDate = '2022-11-30';
}
