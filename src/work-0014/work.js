import {
    Work
} from '/js/basework.js';
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
        this.clearCanvas();
        this.scaleCanvas(0.97);  // padding
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            if (MathUtils.randomIntUpTo(100) < this.ctrl.rotationChance) this.ctx.rotate(MathUtils.randomIntRange(...this.ctrl.rotationRange) * Math.PI / 180);
            if (MathUtils.randomIntUpTo(100) < this.ctrl.scaleChance) {
                let s = MathUtils.randomIntRange(...this.ctrl.scaleRange) / 100;
                this.ctx.scale(s, s);
            }
            if (MathUtils.randomIntUpTo(100) < this.ctrl.translationChance) this.ctx.translate(
                tile.tileDim * MathUtils.randomIntRange(...this.ctrl.translationRange) / 100,
                tile.tileDim * MathUtils.randomIntRange(...this.ctrl.translationRange) / 100);
            if (MathUtils.randomIntUpTo(100) < this.ctrl.lineWidthChance) this.ctx.lineWidth = MathUtils.randomIntRange(...this.ctrl.lineWidthRange);
            this.strokeRectForPoint(tile.upperLeft(), tile.tileDim, tile.tileDim);
        });
    }
    description = `Each tile has separate probabilities of being rotated, scaled, translated and stroked. Inspired by Vera Molnár.`;
    createdDate = '2022-11-14';
}
