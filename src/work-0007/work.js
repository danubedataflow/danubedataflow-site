import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0007 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColorsRange', 'Number of colors: {0} to {1}', 2, 32, [12, 20]),
            ),
            this.makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 50, [8, 15]),
        ];
    }
    drawWork() {
        this.clearCanvas('black');
        this.tileIterator((tile) => {
            let numColors = MathUtils.randomIntRange(...this.ctrl.numColorsRange);
            let palette = chroma.scale(this.ctrl.colorMap).colors(numColors);
            let numSides = MathUtils.randomIntRange(...this.ctrl.numSidesRange);
            let points = MathUtils.getPointsForPolygon(numSides, tile.tileDim * 0.9, 0);
            let colorIndex = 0;

            // draw a line from each point to each point
            points.forEach((p, i) => {
                points.forEach((p2, j) => {
                    if (i == j) return;
                    this.ctx.strokeStyle = palette[colorIndex];
                    colorIndex = (colorIndex + 1 + palette.length) % palette.length;
                    this.linePath(p, p2);
                    this.ctx.stroke();
                });
            });
        });
    }
    description = `Different polygons. Each points on a polygon is connected to all other points, using a random color.`
    createdDate = '2022-09-25';
}
