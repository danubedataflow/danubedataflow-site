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
export class Work9001 extends Work {
    getControls() {
        return [
            // FIXME use a float slider from -2 to 2 with 0.001 intervals
            // Most value combinations will either produce a blank image or a
            // very boring image.
            this.makeSlider('a', 'a * 1000: {0}', -2000, 2000, 1),
            this.makeSlider('b', 'b * 1000: {0}', -2000, 2000, 1),
            this.makeSlider('c', 'c * 1000: {0}', -2000, 2000, 1),
            this.makeSlider('d', 'd * 1000: {0}', -2000, 2000, 1),
        ];
    }
    drawWork() {
        this.clearCanvas('white');
        // this.ctx.fillStyle = ColorUtils.colorRGBA(0, 0, 0, 1);
        this.ctx.fillStyle = 'black';

        let [x, y] = [0, 0];
        // let [a, b, c, d] = [0.970, -1.899, 1.381, -1.506];
        // let [a, b, c, d] = [-2, -2, -1.2, 2];
        let [a, b, c, d] = [
            this.ctrl.a / 1000,
            this.ctrl.b / 1000,
            this.ctrl.c / 1000,
            this.ctrl.d / 1000
        ];
        for (let i = 0; i < 100000; i++) {
            let nx = Math.sin(a * y) - Math.cos(b * x);
            let ny = Math.sin(c * x) - Math.cos(d * y);
            if (i > 100) {
                let p = new Point(MathUtils.mapRange(x, -2, 2, 0, this.width), MathUtils.mapRange(y, -2, 2, 0, this.height));
                this.fillRectForPoint(p, 1, 1);
            }
            [x, y] = [nx, ny];
        }
    }
    description = `Experimenting with the De Jong attractor.`;
    createdDate = '2026-03-09';
}
