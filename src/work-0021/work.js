import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
import { Point } from '/js/point.js';
export class Work0021 extends Work {
    getControls() {
        return [
            this.makeSlider('numRects', 'Number of rectangles: {0}', 10, 100, 50),
            this.makeSlider('lineWidthRange', 'Line this.width range: {0} to {1}', 1, 20, [2, 4]),
            this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
        ];
    }
    drawWork() {
        this.clearCanvas();
        let tileDim = this.width / this.ctrl.numTiles;
        for (let i = 0; i <= this.ctrl.numRects; i++) {
            let upperLeft = new Point(MathUtils.randomIntUpTo(this.width), MathUtils.randomIntUpTo(this.height));
            let w = MathUtils.randomIntUpTo(this.width - upperLeft.x);
            let h = MathUtils.randomIntUpTo(this.height - upperLeft.y);
            this.ctx.lineWidth = MathUtils.randomIntRange(...this.ctrl.lineWidthRange);
            let alpha = MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100;
            this.ctx.strokeStyle = ColorUtils.colorRGBA(0, 0, 0, alpha);
            this.strokeRectForPoint(upperLeft, w, h);
        }
    }
    description = `Random rectangles with random border line this.widths and random alpha are overlaid on top of each other.`;
    createdDate = '2023-09-13';
}
