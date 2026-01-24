import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0003 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeSelectColorMap(),
            this.makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
        ];
    }
    drawWork() {
        this.clearCanvas('black');
        let colorScale = chroma.scale(this.ctrl.colorMap);

        this.tileIterator((tile) => {
            let radius = tile.tileDim * 0.4;
            let numLines = MathUtils.randomIntRange(...this.ctrl.numLinesRange);
            for (let i = 1; i <= numLines; i++) {
                this.ctx.strokeStyle = colorScale(MathUtils.random()).toString();
                this.ctx.beginPath();
                this.moveToPoint(tile.center());
                let angle = MathUtils.random() * 2 * Math.PI;
                this.ctx.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
                this.ctx.stroke();
            }
        });
    }
    description = `A random number of lines from a central point to a point on a circle at a random angle.`;
    createdDate = '2022-08-13';
}
