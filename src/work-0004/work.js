import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/math.js';
import {
    ArrayUtils
} from '/js/array.js';
import {
    Palette
} from '/js/color.js';
import {
    Point
} from '/js/point.js';
export class Work0004 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['lighter', 'source-over', 'difference', 'exclusion', 'hard-light', 'lighten', 'screen']),
                this.makeSlider('numColors', 'Number of colors: {0}', 5, 32, 16),
            ),
            this.makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
        ];
    }
    drawWork() {
        this.clearCanvas('black');
        this.ctx.globalCompositeOperation = this.ctrl.blendMode;
        let angle = MathUtils.random() * 2 * Math.PI;
        let palette = new Palette(this.ctrl.colorMap, this.ctrl.numColors);
        this.tileIterator((tile) => {
            let radius = tile.tileDim * 0.4;
            let p = new Point(Math.sin(angle) * radius, Math.cos(angle) * radius);
            let numLines = MathUtils.randomIntRange(...this.ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                this.ctx.strokeStyle = palette.getRandomColor();
                let angle2 = MathUtils.random() * 2 * Math.PI;
                let p2 = new Point(Math.sin(angle2) * radius, Math.cos(angle2) * radius);
                this.linePath(p, p2);
                this.ctx.stroke();
                p = p2;
            }
        });
    }
    description = `A random number of lines from one point on a circle to a random point on the same circle. This becomes the starting point of the next line.`;
    createdDate = '2022-08-25';
}
