import {
    Work
} from '/js/work.js';
import {
    randomIntUpTo
} from '/js/math.js';
class Work0013 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
            this.makeSlider('horizontalLineChance', 'Probability of a horizontal line: {0}%', 0, 100, 30),
            this.makeSlider('verticalLineChance', 'Probability of a vertical line: {0}%', 0, 100, 30),
            this.makeSlider('diagonalUpwardsLineChance', 'Probability of a diagonal upwards line: {0}%', 0, 100, 30),
            this.makeSlider('diagonalDownwardsLineChance', 'Probability of a diagonal downwards line: {0}%', 0, 100, 30),
            this.makeCheckbox('hasTileBorder', 'Tile border: '),
        );
    }
    drawWork() {
        this.ctx.save();
        this.clearCanvas();
        // pad the work
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.scale(0.97, 0.97);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                this.ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
                if (this.ctrl.hasTileBorder) this.ctx.strokeRect(0, 0, tileDim, tileDim);
                if (randomIntUpTo(100) < this.ctrl.horizontalLineChance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, tileDim / 2);
                    this.ctx.lineTo(tileDim, tileDim / 2);
                    this.ctx.stroke();
                }
                if (randomIntUpTo(100) < this.ctrl.verticalLineChance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(tileDim / 2, 0);
                    this.ctx.lineTo(tileDim / 2, tileDim);
                    this.ctx.stroke();
                }
                if (randomIntUpTo(100) < this.ctrl.diagonalUpwardsLineChance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, tileDim);
                    this.ctx.lineTo(tileDim, 0);
                    this.ctx.stroke();
                }
                if (randomIntUpTo(100) < this.ctrl.diagonalDownwardsLineChance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(tileDim, tileDim);
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }
        }
        this.ctx.restore();
    }
    description = `Each tile has separate probabilities of containing a horizontal line, a vertical line, a diagonal upwards line and a diagonal downwards line.`;
    createdDate = '2022-11-07';
}
new Work0013().run();
