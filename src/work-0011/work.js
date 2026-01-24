import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work0011 extends Work {
    getControls() {
        return [
            this.makeSlider('numLines', 'Number of lines: {0}', 1, 1500, 500),
            this.makeSlider('randomPointOffset', 'Random point offset: {0}', 1, 20, 5),
        ];
    }
    drawWork() {
        let offset = this.ctrl.randomPointOffset;
        let x1 = MathUtils.randomIntUpTo(this.width / 2);
        let y1 = MathUtils.randomIntUpTo(this.height / 2);
        let x2 = MathUtils.randomIntUpTo(this.width / 2) + this.width / 2;
        let y2 = MathUtils.randomIntUpTo(this.height / 2) + this.height / 2;
        let x1d = this.rnd(6, offset);
        let y1d = this.rnd(5, offset);
        let x2d = this.rnd(2, offset);
        let y2d = this.rnd(7, offset);
        this.clearCanvas('black');
        this.ctx.strokeStyle = 'white';
        for (let i = 1; i <= this.ctrl.numLines; i++) {
            this.linePath(new Point(x1, y1), new Point(x2, y2));
            this.ctx.stroke();
            if (x1 > this.width) x1d = -this.rnd(2, offset);
            if (y1 > this.height) y1d = -this.rnd(8, offset);
            if (x2 < 0) x2d = this.rnd(6, offset);
            if (y2 < 0) y2d = this.rnd(5, offset);
            if (x1 < 0) x1d = this.rnd(2, offset);
            if (y1 < 0) y1d = this.rnd(3, offset);
            if (x2 > this.width) x2d = this.rnd(8, offset);
            if (y2 > this.height) y2d = this.rnd(2, offset);
            x1 += x1d;
            y1 += y1d;
            x2 -= x2d;
            y2 -= y2d;
        }
    }
    rnd(mid, offset) {
        return MathUtils.randomIntRange(mid - offset, mid + offset + 1);
    }
    description = `Each line is the previous line plus random movement. Based on Jon Stanley's program <a href="https://www.electronixandmore.com/resources/teksystem/">Lines</a> for the Tektronix 4052.`;
    createdDate = '2022-10-27';
}
