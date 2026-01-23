import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0016 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
            this.makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
        ];
    }
    drawWork() {
        this.clearCanvas('#777777');
        let palette = ['white', '#aaaaaa', 'black'];
        let tileDim = this.width / this.ctrl.numTiles; // square canvas
        for (let i = 0; i <= this.ctrl.numRects; i++) {
            let ulX = MathUtils.randomIntRange(0, this.ctrl.numTiles - 1);
            let ulY = MathUtils.randomIntRange(0, this.ctrl.numTiles - 1);
            let spanX = MathUtils.randomIntRange(1, this.ctrl.numTiles - ulX);
            let spanY = MathUtils.randomIntRange(1, this.ctrl.numTiles - ulY);
            this.ctx.fillStyle = ArrayUtils.randomElement(palette);
            this.ctx.fillRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
        }
    }
    description = `Random white, grey and black rectangles, each spanning a random number of horizontal and vertical tiles.`;
    createdDate = '2022-11-25';
}
