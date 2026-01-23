import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work0004 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['lighter', 'source-over', 'difference', 'exclusion', 'hard-light', 'lighten', 'screen']),
            ),
            this.makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
        );
    }
    drawWork() {
        this.clearCanvas('black');
        this.ctx.globalCompositeOperation = this.ctrl.blendMode;
        let angle = MathUtils.random() * 2 * Math.PI;
        let colorScale = chroma.scale(this.ctrl.colorMap);
        let tileDim = Math.floor(this.width / this.ctrl.numTiles);
        let radius = tileDim * 0.4;
        let p = new Point(Math.sin(angle) * radius, Math.cos(angle) * radius);
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                this.ctx.save();
                this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
                let numLines = MathUtils.randomIntRange(...this.ctrl.numLinesRange);
                for (let i = 1; i <= numLines; i++) {
                    this.ctx.strokeStyle = colorScale(MathUtils.random()).toString();
                    let angle2 = MathUtils.random() * 2 * Math.PI;
                    let p2 = new Point(Math.sin(angle2) * radius, Math.cos(angle2) * radius);
                    this.ctx.beginPath();
                    this.ctx.moveTo(...p.asArray());
                    this.ctx.lineTo(...p2.asArray());
                    this.ctx.stroke();
                    p = p2;
                }
                this.ctx.restore();
            }
        }
    }
    description = `A random number of lines from one point on a circle to a random point on the same circle. This becomes the starting point of the next line.`;
    createdDate = '2022-08-25';
}
