import {
    Work
} from '/js/work.js';
import {
    ArrayUtils
} from '/js/utils.js';
class Work0022 extends Work {
    setupControls() {
        this.makeForm(
            this.makeFieldset('Repetitions',
                this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 12, 9),
                this.makeSlider('scale', 'Scale: {0}', 0.6, 1, 0.8, 0.05),
            ),
            this.makeSlider('numPointsPerSide', 'Number of points per side in a square: {0}', 4, 8, 4),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile center so rotate() and scale() happen there
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                this.ctx.scale(this.ctrl.scale, this.ctrl.scale);
                let points = [];
                for (let py = 0; py < this.ctrl.numPointsPerSide; py++) {
                    for (let px = 0; px < this.ctrl.numPointsPerSide; px++) {
                        points.push([
                            Math.round(px * tileDim / (this.ctrl.numPointsPerSide - 1) - tileDim / 2),
                            Math.round(py * tileDim / (this.ctrl.numPointsPerSide - 1) - tileDim / 2)
                        ]);
                    }
                }
                points = ArrayUtils.shuffle(points);
                for (let i = 0; i < points.length - 1; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(...points[i]);
                    this.ctx.lineTo(...points[i + 1]);
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }
        }
    }
    description = `In each square tile, a grid of points is randomly connected by lines. Homage to "Hommage à Dürer" by haVera Molnár, which itself was based on the magic square from Albrecht Dürer's engraving "Melencolia I".`;
    createdDate = '2023-09-21';
}
new Work0022().run();