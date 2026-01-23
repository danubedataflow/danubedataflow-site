import {
    Work
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
import {
    colorHSL
} from '/js/colors.js';
class Work0027 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 5),
            this.makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
            this.makeSlider('scaleInner', 'Scale of the inner squares: {0}', 0.3, 0.7, 0.5, 0.05),
        );
    }
    drawWork() {
        this.clearCanvas();
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile center so rotate() and scale() happen there
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                this.ctx.fillStyle = colorHSL(this.ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
                this.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
                this.ctx.scale(this.ctrl.scaleInner, this.ctrl.scaleInner);
                this.ctx.fillStyle = colorHSL(this.ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
                this.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
                this.ctx.restore();
            }
        }
    }
    description = `Each square tile is filled with a color from the given angle on the color wheel. Then a smaller inner square is drawn as well. Both squares are drawn with random transparency. Inspired by Vera Molnár.`;
    createdDate = '2023-10-03';
}
new Work0027().run();