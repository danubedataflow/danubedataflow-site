import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/math.js';
import {
    Palette
} from '/js/color.js';
import {
    Point
} from '/js/point.js';
export class Work0039 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 5, 20, 8),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 8, 5),
            ),
        ];
    }

    drawWork() {
        // choose colors
        let palette = new Palette(this.ctrl.colorMap, this.ctrl.numColors);
        let colors = [];
        for (let k = 0; k < this.ctrl.numTiles; k++) {
            colors[k] = palette.getRandomColor();

            // adjacent colors must be different
            while (k > 0 && colors[k] == colors[k - 1]) {
                colors[k] = palette.getRandomColor();
            }
        }

        // the last element of colors[] acts as the background color
        this.clearCanvas(colors[colors.length - 1]);

        let tileWidth = this.width / this.ctrl.numTiles;
        let tileHeight = this.height / this.ctrl.numTiles;

        for (let column = 0; column < this.ctrl.numTiles; column++) {

            // Iterative over rows from bottom to top so later (smaller)
            // rectangles overlap earlier (bigger) ones.
            for (let row = this.ctrl.numTiles - 1; row >= 0; row--) {

                // choose a random height within the [row, column] tile
                let bottom = MathUtils.randomIntRange(row * tileHeight, (row + 1) * tileHeight);
                this.ctx.fillStyle = colors[row];
                this.fillRectForPoint(new Point(column * tileWidth, 0), tileWidth, bottom);
            }
        }
    }

    description = `...`;
    createdDate = '2026-03-15';
}
