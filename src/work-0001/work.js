import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0001 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 50, 25),
            this.makeFieldset('Polygon',
                this.makeSlider('numSides', 'Number of sides: {0}', 3, 8, 6),
                this.makeSlider('polygonScaleFactor', 'Scale factor: {0}', 1, 10, 3, 0.1),
            ),
            this.makeFieldset('Noise',
                this.makeSlider('noiseOffsetX', 'Horizontal noise offset: {0}', 0, 30, 4),
                this.makeSlider('noiseOffsetY', 'Vertical noise offset: {0}', 1, 100, 15),
                this.makeSlider('noiseDivisor', 'Noise divisor: {0}', 1, 30, 9),
            ),
        ];
    }
    drawWork() {
        this.clearCanvas('black');
        this.ctx.strokeStyle = 'white';
        this.tileIterator((tile) => {
            let n = noise.simplex2(
                this.ctrl.noiseOffsetX + tile.x / this.ctrl.noiseDivisor,
                this.ctrl.noiseOffsetY + tile.y / this.ctrl.noiseDivisor
            );
            let diameter = Math.floor(n * this.ctrl.polygonScaleFactor * tile.tileDim);
            this.ctx.beginPath();
            let points = MathUtils.getPointsForPolygon(this.ctrl.numSides, diameter, 0);
            points.forEach(p => this.lineToPoint(p));
            this.ctx.closePath();
            this.ctx.stroke();
        });
    }
    description = `Draw a grid of polygons whose sizes depend on two-dimensional Perlin noise.`;
    createdDate = '2022-07-27';
}
