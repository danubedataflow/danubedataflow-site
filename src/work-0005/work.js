import {
    Work
} from '/js/ui.js';
import {
    random,
    randomIntUpTo
} from '/js/math.js';
class Work0005 extends Work {
    setupControls() {
        this.makeForm(
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['source-over', 'darken', 'difference', 'exclusion', 'hard-light', 'multiply']),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 32, 25),
            ),
            this.makeSlider('maxLength', 'Maximum length: {0}', 3, 19, 11, 2),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.globalCompositeOperation = this.ctrl.blendMode;
        this.ctx.save();
        this.ctx.translate(this.width / 2, this.height / 2);
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        let colorIndex = randomIntUpTo(palette.length);
        let magnify = Math.round(this.width / this.ctrl.maxLength);
        let numPoints = Math.pow(this.ctrl.maxLength, 2);
        this.iterateSquareSpiral(numPoints, (x, y, n) => {
            let direction = randomIntUpTo(2) - 1; // [-1, +1]
            // wrap around
            colorIndex = (palette.length + colorIndex + direction) % palette.length;
            this.ctx.fillStyle = palette[colorIndex];
            this.ctx.beginPath();
            this.ctx.fillRect(x * magnify, y * magnify, magnify, magnify);
        });
        this.ctx.restore();
    }
    /* See https://math.stackexchange.com/a/4128516
     *
     * x(n) is the sum of sin(term) for 1 <= k <= n.
     *
     * y(n) is the sum of cos(term) for 1 <= k <= n.
     *
     * Since we are iterating, we just need to add the latest term to get the new
     * values.
     */
    iterateSquareSpiral(max, callback) {
        let x = 0,
            y = 0;
        callback(x, y, 0);
        for (let k = 1; k < max; k++) {
            let term = Math.PI / 2 * Math.floor(Math.sqrt(4 * k - 3));
            x += Math.sin(term);
            y += Math.cos(term);
            callback(x, y, k);
        }
    }
    description = `Randomly colored tiles on a squared spiral.`;
    createdDate = '2022-09-08';
}
new Work0005().run();