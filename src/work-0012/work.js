import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work0012 extends Work {
    getControls() {
        return [
            this.makeSlider('horizontalSineFactor', 'Horizontal sine factor: {0}', 1, 5, 2.5, 0.1),
            this.makeSlider('alpha', 'Transparency (alpha): {0}', 1, 100, 30),
            this.makeSlider('angleStep', 'Angle step: {0}', 0.1, 10, 0.5, 0.1),
            this.makeSlider('squareSizeRange', 'Square size range: {0} to {1}', 1, 100, [30, 50]),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = ColorUtils.colorRGBA(0, 0, 0, this.ctrl.alpha / 100);
        this.ctx.lineWidth = 1;
        this.ctx.translate(this.width / 2, this.height / 2);
        for (let i = 0; i < 360; i += this.ctrl.angleStep) {
            let rad = i / 180 * Math.PI;
            // x-factor 2 produces the "infinity sign"
            let p = new Point(Math.sin(rad * this.ctrl.horizontalSineFactor) * (this.width / 3),
                Math.sin(rad) * (this.height / 3));
            // Draw random squares around each point at 10% alpha, produces a fuzzy
            // shape.
            let dim = MathUtils.randomIntRange(...this.ctrl.squareSizeRange);
            this.strokeRectForPoint(p, dim, dim);
        }
    }
    description = `Rectangles are drawn along a modified sine wave.`;
    createdDate = '2022-11-02';
}