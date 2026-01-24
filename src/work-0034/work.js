import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
import { Point } from '/js/point.js';
export class Work0034 extends Work {
    getControls() {
        return [
            this.makeSlider('numPoints', 'Number of points: {0}', 25, 75, 50),
            this.makeSlider('percentStandardDeviation', 'Standard deviation: {0}% of this.width', 5, 25, 15),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        let points = [];
        let standardDeviation = this.width * this.ctrl.percentStandardDeviation / 100;
        for (let i = 1; i <= this.ctrl.numPoints; i++) {
            let x = Math.floor(MathUtils.gaussianRandom(this.width / 2, standardDeviation));
            // Calculate y for an imaginary this.height of 500, then scale to the actual
            // this.height. This is so the result looks the same regardless of the
            // canvas size. Also subtract from this.height so it goes from bottom to top.
            let y = 500 - ((Math.pow(i, 2) + 5 * i) % 500);
            y *= this.height / 500;
            points.push(new Point(x, y));
        }
        ArrayUtils.pairwise(points, (current, next) => {
            this.ctx.beginPath();
            this.moveToPoint(current);
            this.lineToPoint(next);
            this.ctx.stroke();
        });
    }
    description = `Lines join points whose horizontal positions are Gaussian, bounded by the canvas. The vertical positions increase quadratically. If a vertical position is outside the canvas, it is reflected to the bottom of the canvas (modulo). Homage to "Gaussian-Quadratic" by Michael Noll, 1963.`;
    createdDate = '2026-01-14';
}
