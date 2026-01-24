import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0027 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 5),
            this.makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
            this.makeSlider('scaleInner', 'Scale of the inner squares: {0}', 0.3, 0.7, 0.5, 0.05),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.tileIterator((tile) => {
            let scales = [1, this.ctrl.scaleInner];
            scales.forEach(s => {
                this.ctx.scale(s, s);
                this.ctx.fillStyle = ColorUtils.colorHSL(this.ctrl.colorAngle, 100, 40 + MathUtils.randomIntUpTo(60));
                this.fillRectForPoint(tile.upperLeft(), tile.tileDim, tile.tileDim);
            });
        });
    }
    description = `Each square tile is filled with a color from the given angle on the color wheel. Then a smaller inner square is drawn as well. Both squares are drawn with random transparency. Inspired by Vera Molnár.`;
    createdDate = '2023-10-03';
}