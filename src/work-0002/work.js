import {
    Work
} from '/js/basework.js';
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
        let points = [];
        // + 2 because the first triangle is only drawn on the third iteration
        for (let i = 1; i <= this.ctrl.numTriangles + 2; i++) {
            points.push(new Point(MathUtils.randomIntUpTo(this.width), MathUtils.randomIntUpTo(this.height)));
            if (points.length == 3) {
                let color = colorScale(MathUtils.random()).rgb();
                this.ctx.fillStyle = ColorUtils.colorRGBA(...color, MathUtils.random());
                this.trianglePath(...points);
                this.ctx.fill();
                points.shift();
            }
        }
    }
    description = `A series of random triangles, each drawn with a random colors from a palette and the selected composite operations. Each triangle shares two points with the previous triangle.`;
    createdDate = '2022-08-13';
}
