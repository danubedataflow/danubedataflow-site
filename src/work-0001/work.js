import {
    Work
} from '/js/work.js';
import {
    getPointsForPolygon
} from '/js/math.js';
class Work0001 extends Work {
    setupControls() {
        this.makeForm(
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
        );
    }
    drawWork() {
        this.clearCanvas('black');
        this.ctx.strokeStyle = 'white';
        let tileDim = Math.floor(this.width / this.ctrl.numTiles);
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                this.ctx.save();
                this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
                let n = noise.simplex2(
                    this.ctrl.noiseOffsetX + x / this.ctrl.noiseDivisor,
                    this.ctrl.noiseOffsetY + y / this.ctrl.noiseDivisor
                );
                let diameter = Math.floor(n * this.ctrl.polygonScaleFactor * tileDim);
                this.ctx.beginPath();
                let points = getPointsForPolygon(this.ctrl.numSides, diameter, 0);
                points.forEach(p => this.ctx.lineTo(...p));
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }
    description = `Draw a grid of polygons whose sizes depend on two-dimensional Perlin noise.`;
    createdDate = '2022-07-27';
}
new Work0001().run();
