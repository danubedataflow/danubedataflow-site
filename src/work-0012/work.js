import {
    Work
} from '/js/ui.js';
import {
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
class Work0012 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('horizontalSineFactor', 'Horizontal sine factor: {0}', 1, 5, 2.5, 0.1),
            this.makeSlider('alpha', 'Transparency (alpha): {0}', 1, 100, 30),
            this.makeSlider('angleStep', 'Angle step: {0}', 0.1, 10, 0.5, 0.1),
            this.makeSlider('squareSizeRange', 'Square size range: {0} to {1}', 1, 100, [30, 50]),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = colorRGBA(0, 0, 0, this.ctrl.alpha / 100);
        this.ctx.lineWidth = 1;
        this.ctx.save();
        this.ctx.translate(this.width / 2, this.height / 2);
        for (let i = 0; i < 360; i += this.ctrl.angleStep) {
            let rad = i / 180 * Math.PI;
            // x-factor 2 produces the "infinity sign"
            let x = Math.sin(rad * this.ctrl.horizontalSineFactor) * (this.width / 3);
            let y = Math.sin(rad) * (this.height / 3);
            // Draw random squares around each point at 10% alpha, produces a fuzzy
            // shape.
            let dim = randomIntRange(...this.ctrl.squareSizeRange);
            this.ctx.strokeRect(x, y, dim, dim);
        }
        this.ctx.restore();
    }
    description = `Rectangles are drawn along a modified sine wave.`;
    createdDate = '2022-11-02';
}
new Work0012().run();