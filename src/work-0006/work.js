import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils,
    ColorUtils
} from '/js/utils.js';
class Work0006 extends Work {
    setupControls() {
        this.makeForm(
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['source-over', 'difference', 'hard-light', 'overlay']),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 32, 16),
                this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [20, 80]),
            ),
            this.makeSlider('numSquares', 'Number of squares: {0}', 20, 1000, 100, 20),
            this.makeSlider('squareLengthRange', 'Side lengths are {0}% to {1}% of the canvas', 1, 100, [5, 30]),
        );
    }
    drawWork() {
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        this.clearCanvas(ArrayUtils.randomElement(palette));
        this.ctx.globalCompositeOperation = this.ctrl.blendMode;
        for (let i = 0; i < this.ctrl.numSquares; i++) {
            let color = ArrayUtils.randomElement(palette);
            // turn RGB hex string into [R, G, B]
            color = chroma(color).rgb();
            // map [0,100]% to [0, 1]
            let alpha = MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100;
            this.ctx.fillStyle = ColorUtils.colorRGBA(...color, alpha);
            let [minLength, maxLength] = this.ctrl.squareLengthRange;
            let s = MathUtils.randomIntRange(this.width * minLength / 100, this.height * maxLength / 100);
            this.ctx.fillRect(MathUtils.randomIntUpTo(this.width), MathUtils.randomIntUpTo(this.height), s, s);
        }
    }
    description = `Random rectangles in random colors, blended together.`;
    createdDate = '2022-09-14';
}
new Work0006().run();