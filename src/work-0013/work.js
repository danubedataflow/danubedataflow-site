import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0013 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
            this.makeSlider('horizontalLineChance', 'Probability of a horizontal line: {0}%', 0, 100, 30),
            this.makeSlider('verticalLineChance', 'Probability of a vertical line: {0}%', 0, 100, 30),
            this.makeSlider('diagonalUpwardsLineChance', 'Probability of a diagonal upwards line: {0}%', 0, 100, 30),
            this.makeSlider('diagonalDownwardsLineChance', 'Probability of a diagonal downwards line: {0}%', 0, 100, 30),
            this.makeCheckbox('hasTileBorder', 'Tile border: '),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.scaleCanvas(0.97); // padding
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            if (this.ctrl.hasTileBorder) this.strokeSquareForPoint(tile.upperLeft(), tile.tileDim);
            if (MathUtils.randomIntUpTo(100) < this.ctrl.horizontalLineChance) {
                this.linePath(tile.middleLeft(), tile.middleRight());
                this.ctx.stroke();
            }
            if (MathUtils.randomIntUpTo(100) < this.ctrl.verticalLineChance) {
                this.linePath(tile.upperMiddle(), tile.lowerMiddle());
                this.ctx.stroke();
            }
            if (MathUtils.randomIntUpTo(100) < this.ctrl.diagonalUpwardsLineChance) {
                this.linePath(tile.lowerLeft(), tile.upperRight());
                this.ctx.stroke();
            }
            if (MathUtils.randomIntUpTo(100) < this.ctrl.diagonalDownwardsLineChance) {
                this.linePath(tile.upperLeft(), tile.lowerRight());
                this.ctx.stroke();
            }
        });
    }
    description = `Each tile has separate probabilities of containing a horizontal line, a vertical line, a diagonal upwards line and a diagonal downwards line.`;
    createdDate = '2022-11-07';
}
