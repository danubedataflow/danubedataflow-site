import {
    Work
} from '/js/basework.js';
import {
    ArrayUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work0022 extends Work {
    getControls() {
        return [
            this.makeFieldset('Repetitions',
                this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 12, 9),
                this.makeSlider('scale', 'Scale: {0}', 0.6, 1, 0.8, 0.05),
            ),
            this.makeSlider('numPointsPerSide', 'Number of points per side in a square: {0}', 4, 8, 4),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            this.ctx.scale(this.ctrl.scale, this.ctrl.scale);
            let points = [];
            for (let py = 0; py < this.ctrl.numPointsPerSide; py++) {
                for (let px = 0; px < this.ctrl.numPointsPerSide; px++) {
                    points.push(new Point(
                        Math.round(px * tile.tileDim / (this.ctrl.numPointsPerSide - 1) - tile.tileDim / 2),
                        Math.round(py * tile.tileDim / (this.ctrl.numPointsPerSide - 1) - tile.tileDim / 2)
                    ));
                }
            }
            points = ArrayUtils.shuffle(points);
            ArrayUtils.pairwise(points, (p1, p2) => {
                this.linePath(p1, p2);
                this.ctx.stroke();
            });
        });
    }
    description = `In each square tile, a grid of points is randomly connected by lines. Homage to "Hommage à Dürer" by haVera Molnár, which itself was based on the magic square from Albrecht Dürer's engraving "Melencolia I".`;
    createdDate = '2023-09-21';
}