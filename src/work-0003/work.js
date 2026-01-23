import {
    Work
} from '/js/work.js';
import {
    random,
    randomIntRange
} from '/js/math.js';
class Work0003 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeSelectColorMap(),
            this.makeSlider('numLinesRange', 'Number of lines: {0} to {1}', 1, 500, [160, 330]),
        );
    }
    drawWork() {
        this.clearCanvas('black');
        let colorScale = chroma.scale(this.ctrl.colorMap);
        let tileDim = Math.floor(this.width / this.ctrl.numTiles);
        let radius = tileDim * 0.4;
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                this.ctx.save();
                this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
                let numLines = randomIntRange(...this.ctrl.numLinesRange);
                for (let i = 1; i <= numLines; i++) {
                    this.ctx.strokeStyle = colorScale(random()).toString();
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    let angle = random() * 2 * Math.PI;
                    this.ctx.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }
        }
    }
    description = `A random number of lines from a central point to a point on a circle at a random angle.`;
    createdDate = '2022-08-13';
}
new Work0003().run();
