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
            this.makeSlider('strokeWidth', 'Stroke width: {0}', 0, 5, 2),
        ];
    }

    drawWork() {
        // choose colors
        let palette = new Palette(this.ctrl.colorMap, this.ctrl.numColors);

        // +1 for the background color
        let colors = palette.getRandomColorsDistinctNeighbors(this.ctrl.numTiles + 1);

        // the last element of colors[] acts as the background color
        this.clearCanvas(colors.pop());

        let tileWidth = this.width / this.ctrl.numTiles;
        let tileHeight = this.height / this.ctrl.numTiles;

        let strokePaths = [];  // one path per row

        for (let column = 0; column < this.ctrl.numTiles; column++) {

            // Iterative over rows from bottom to top so later (smaller)
            // rectangles overlap earlier (bigger) ones.
            for (let row = this.ctrl.numTiles - 1; row >= 0; row--) {

                // choose a random height within the [row, column] tile
                let bottom = MathUtils.randomIntRange(row * tileHeight, (row + 1) * tileHeight);
                this.ctx.fillStyle = colors[row];
                this.fillRectForPoint(new Point(column * tileWidth, 0), tileWidth, bottom);

                strokePaths[row] ||= [];
                strokePaths[row].push(
                    new Point(column * tileWidth, bottom),
                    new Point((column + 1) * tileWidth, bottom)
                );
            }
        }

        strokePaths.forEach(points => {
            let path = new Path2D();
            path.moveTo(...points.shift().asArray());
            points.forEach((p) => path.lineTo(...p.asArray()));
            this.ctx.save();
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = this.ctrl.strokeWidth;
            this.ctx.stroke(path);
            this.ctx.restore();
        });
    }

    description = `Iterate over tiles in a grid, left to right and bottom to top. For each tile choose a random vertical position within the tile. Paint the column from the top of the grid to the chosen position. Colors are chosen randomly from a palette but neighboring colors must be distinct.`;
    createdDate = '2026-03-15';
}
