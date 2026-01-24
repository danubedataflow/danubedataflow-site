import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0029 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 3),
            this.makeSlider('lineGap', 'Distance of initial points: {0}', 5, 100, 50),
            this.makeSlider('maxMovement', 'Maximum movement: {0}', 5, 20, 10),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            this.ctx.scale(0.9, 0.9);
            this.drawWalkers(tile);
            this.ctx.rotate(Math.PI / 2);
            this.drawWalkers(tile);
        });
    }
    drawWalkers(tile) {
        this.ctx.save();
        this.translateToPoint(tile.upperLeft());
        for (let startY = 0; startY <= tile.tileDim; startY += this.ctrl.lineGap) {
            let y = startY;
            this.ctx.fillStyle = ColorUtils.colorRGBA(MathUtils.randomIntUpTo(255), MathUtils.randomIntUpTo(255), MathUtils.randomIntUpTo(255), 0.2);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            for (let x = 0; x <= tile.tileDim; x += this.ctrl.maxMovement) {
                this.ctx.lineTo(x, y);
                // random movement but constrain to the tile size
                y += MathUtils.randomIntPlusMinus(this.ctrl.maxMovement);
                if (y < 0) y = 0;
                if (y > tile.tileDim) y = tile.tileDim;
            }
            this.ctx.lineTo(tile.tileDim, 0);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        // draw a border
        this.ctx.strokeRect(0, 0, tile.tileDim, tile.tileDim);
        this.ctx.restore();
    }
    description = `Each tile contains a shape that has straight borders on the left, top and right sides. The shape along the bottom follows the path of a random walker. Each shape uses a random semitransparent fill so each intersecting shape of adjacent horizontal and vertical walkers is filled by a color that is related to its neighbors. Homage to "25 croix" by Vera Molnár, 1994`;
    createdDate = '2023-10-06';
}