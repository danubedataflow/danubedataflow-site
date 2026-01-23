import {
    Work
} from '/js/work.js';
import {
    randomIntUpTo
} from '/js/math.js';
class Work0010 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
        );
    }
    drawWork() {
        let curves = [];
        // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
        for (let i = 0; i < this.ctrl.numCurves; i++) {
            curves.push([
                [randomIntUpTo(this.width), randomIntUpTo(this.height)],
                [randomIntUpTo(this.width), randomIntUpTo(this.height)],
                [randomIntUpTo(this.width), randomIntUpTo(this.height)],
            ]);
        }
        this.clearCanvas();
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#707070';
        let path = new Path2D();
        curves.forEach((c) => {
            path.bezierCurveTo(...c[0], ...c[1], ...c[2]);
        });
        path.closePath();
        this.ctx.fill(path, "evenodd");
    }
    description = `A series of bezier curves with 'evenodd' filling.`;
    createdDate = '2022-10-22';
}
new Work0010().run();
