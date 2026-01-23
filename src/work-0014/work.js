import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0014 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
            this.makeFieldset('Rotation',
                this.makeSlider('rotationChance', 'Rotation probability: {0}%', 0, 100, 5),
                this.makeSlider('rotationRange', 'Rotation range: {0}° to {1}°', -45, 45, [-10, 10]),
            ),
            this.makeFieldset('Scale',
                this.makeSlider('scaleChance', 'Scale probability: {0}%', 0, 100, 5),
                this.makeSlider('scaleRange', 'Scale range: {0} to {1}', 50, 150, [80, 120]),
            ),
            this.makeFieldset('Translation',
                this.makeSlider('translationChance', 'Translation probability: {0}%', 0, 100, 5),
                this.makeSlider('translationRange', 'Translation range: {0} to {1}', -50, 50, [-20, 20]),
            ),
            this.makeFieldset('Stroke',
                this.makeSlider('lineWidthChance', 'Line this.width probability: {0}%', 0, 100, 5),
                this.makeSlider('lineWidthRange', 'Line this.width range: {0} to {1}', 1, 4, [2, 3]),
            ),
        ];
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
                // `+ 0.5` to move to the tile's center
                this.ctx.translate((x - 1) * (tileDim + 0.5), (y - 1) * (tileDim + 0.5));
                if (MathUtils.randomIntUpTo(100) < this.ctrl.rotationChance) this.ctx.rotate(MathUtils.randomIntRange(...this.ctrl.rotationRange) * Math.PI / 180);
                if (MathUtils.randomIntUpTo(100) < this.ctrl.scaleChance) {
                    let s = MathUtils.randomIntRange(...this.ctrl.scaleRange) / 100;
                    this.ctx.scale(s, s);
                }
                if (MathUtils.randomIntUpTo(100) < this.ctrl.translationChance) this.ctx.translate(
                    tileDim * MathUtils.randomIntRange(...this.ctrl.translationRange) / 100,
                    tileDim * MathUtils.randomIntRange(...this.ctrl.translationRange) / 100);
                if (MathUtils.randomIntUpTo(100) < this.ctrl.lineWidthChance) this.ctx.lineWidth = MathUtils.randomIntRange(...this.ctrl.lineWidthRange);
                this.ctx.strokeRect(0, 0, tileDim, tileDim);
                this.ctx.restore();
            }
        }
        this.ctx.restore();
    }
    description = `Each tile has separate probabilities of being rotated, scaled, translated and stroked. Inspired by Vera Molnár.`;
    createdDate = '2022-11-14';
}
