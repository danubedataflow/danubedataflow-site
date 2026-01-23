import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
class Work0021 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numRects', 'Number of rectangles: {0}', 10, 100, 50),
            this.makeSlider('lineWidthRange', 'Line this.width range: {0} to {1}', 1, 20, [2, 4]),
            this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
        );
    }
    drawWork() {
        this.clearCanvas();
        let tileDim = this.width / this.ctrl.numTiles;
        for (let i = 0; i <= this.ctrl.numRects; i++) {
            let ulX = MathUtils.randomIntUpTo(this.width);
            let ulY = MathUtils.randomIntUpTo(this.height);
            let w = MathUtils.randomIntUpTo(this.width - ulX);
            let h = MathUtils.randomIntUpTo(this.height - ulY);
            this.ctx.lineWidth = MathUtils.randomIntRange(...this.ctrl.lineWidthRange);
            let alpha = MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100;
            this.ctx.strokeStyle = ColorUtils.colorRGBA(0, 0, 0, alpha);
            this.ctx.strokeRect(ulX, ulY, w, h);
        }
    }
    description = `Random rectangles with random border line this.widths and random alpha are overlaid on top of each other.`;
    createdDate = '2023-09-13';
}
new Work0021().run();