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
    ColorUtils
} from '/js/color.js';
import {
    Point
} from '/js/point.js';
import {
    MarkovChain
} from '/js/markov.js';
export class Work0039 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 60, 35),
        ];
    }

    drawWork() {}

    description = `...`;
    createdDate = '2026-03-13';
}
