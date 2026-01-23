import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0029 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 3),
            this.makeSlider('lineGap', 'Distance of initial points: {0}', 5, 100, 50),
            this.makeSlider('maxMovement', 'Maximum movement: {0}', 5, 20, 10),
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
                this.ctx.scale(0.9, 0.9);
                this.drawWalkers(tileDim);
                this.ctx.rotate(Math.PI / 2);
                this.drawWalkers(tileDim);
                this.ctx.restore();
            }
        }
    }
    drawWalkers(tileDim) {
        this.ctx.save();
        this.ctx.translate(-tileDim / 2, -tileDim / 2);
        for (let startY = 0; startY <= tileDim; startY += this.ctrl.lineGap) {
            let y = startY;
            this.ctx.fillStyle = ColorUtils.colorRGBA(MathUtils.randomIntUpTo(255), MathUtils.randomIntUpTo(255), MathUtils.randomIntUpTo(255), 0.2);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            for (let x = 0; x <= tileDim; x += this.ctrl.maxMovement) {
                this.ctx.lineTo(x, y);
                // random movement but constrain to the tile size
                y += MathUtils.randomIntPlusMinus(this.ctrl.maxMovement);
                if (y < 0) y = 0;
                if (y > tileDim) y = tileDim;
            }
            this.ctx.lineTo(tileDim, 0);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        // draw a border
        this.ctx.strokeRect(0, 0, tileDim, tileDim);
        this.ctx.restore();
    }
    description = `Each tile contains a shape that has straight borders on the left, top and right sides. The shape along the bottom follows the path of a random walker. Each shape uses a random semitransparent fill so each intersecting shape of adjacent horizontal and vertical walkers is filled by a color that is related to its neighbors. Homage to "25 croix" by Vera Molnár, 1994`;
    createdDate = '2023-10-06';
}
