import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
class Work0023 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 70, 50),
            this.makeSlider('scale', 'Scale: {0}', 1, 2, 1.5, 0.1),
            this.makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
            this.makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 10, 2),
            this.makeSlider('lineWidth', 'Line this.width: {0}', 1, 6, 1),
        );
    }
    drawWork() {
        this.ctx.save();
        this.clearCanvas();
        this.ctx.lineWidth = this.ctrl.lineWidth;
        this.ctx.strokeStyle = 'black';
        // pad the work
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.scale(0.97, 0.97);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile center so rotate() and scale() happen there
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                this.ctx.rotate(2 * Math.PI * MathUtils.randomIntUpTo(this.ctrl.angleStep) / this.ctrl.angleStep);
                this.ctx.translate(
                    MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis),
                    MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis),
                );
                // `this.ctx.scale(this.ctrl.scale, this.ctrl.scale)` instead would also change the line weight.
                this.ctx.beginPath();
                this.ctx.moveTo(this.ctrl.scale * -tileDim / 2, 0);
                this.ctx.lineTo(this.ctrl.scale * tileDim / 2, 0);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
        this.ctx.restore();
    }
    description = `Each tile contains a randomly rotated and randomly offset line. Technically, the tile itself is rotated and offset, then a straign line is drawn. Inspired by Vera Molnár.`;
    createdDate = '2023-09-22';
}
new Work0023().run();