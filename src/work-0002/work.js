import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
import { Point } from '/js/point.js';
export class Work0002 extends Work {
    getControls() {
        return [
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['source-over', 'darken', 'difference', 'hard-light', 'multiply']),
            ),
            this.makeSlider('numTriangles', 'Number of triangles: {0}', 1, 500, 100),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.globalCompositeOperation = this.ctrl.blendMode;
        let colorScale = chroma.scale(this.ctrl.colorMap);
        let p = [];
        // + 2 because the first triangle is only drawn on the third iteration
        for (let i = 1; i <= this.ctrl.numTriangles + 2; i++) {
            p.push(new Point(MathUtils.randomIntUpTo(this.width), MathUtils.randomIntUpTo(this.height)));
            if (p.length == 3) {
                let color = colorScale(MathUtils.random()).rgb();
                this.ctx.fillStyle = ColorUtils.colorRGBA(...color, MathUtils.random());
                // draw a triangle
                this.ctx.beginPath();
                this.moveToPoint(p[0]);
                this.lineToPoint(p[1]);
                this.lineToPoint(p[2]);
                this.ctx.closePath();
                this.ctx.fill();
                p.shift();
            }
        }
    }
    description = `A series of random triangles, each drawn with a random colors from a palette and the selected composite operations. Each triangle shares two points with the previous triangle.`;
    createdDate = '2022-08-13';
}
