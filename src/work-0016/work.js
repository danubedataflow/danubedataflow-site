import {
    Work
} from '/js/work.js';
import {
    randomIntRange
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
class Work0016 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
            this.makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
        );
    }
    drawWork() {
        this.clearCanvas('#777777');
        let palette = ['white', '#aaaaaa', 'black'];
        let tileDim = this.width / this.ctrl.numTiles; // square canvas
        for (let i = 0; i <= this.ctrl.numRects; i++) {
            let ulX = randomIntRange(0, this.ctrl.numTiles - 1);
            let ulY = randomIntRange(0, this.ctrl.numTiles - 1);
            let spanX = randomIntRange(1, this.ctrl.numTiles - ulX);
            let spanY = randomIntRange(1, this.ctrl.numTiles - ulY);
            this.ctx.fillStyle = randomElement(palette);
            this.ctx.fillRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
        }
    }
    description = `Random white, grey and black rectangles, each spanning a random number of horizontal and vertical tiles.`;
    createdDate = '2022-11-25';
}
new Work0016().run();
