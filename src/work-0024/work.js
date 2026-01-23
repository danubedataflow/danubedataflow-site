import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0024 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
            this.makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 20, 10),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 8, 2),
                this.makeSlider('ratioColoredTiles', 'One in {0} tiles is colored', 8, 32, 16),
            ),
        );
    }
    drawWork() {
        this.ctx.save();
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        // pad the work
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.scale(0.9, 0.9);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        /*
         * Fill one in ratioColoredTiles tiles. For example, if ratioColoredTiles
         * is 9, we want to fill one in nine tiles.
         *
         * Divide the total number of tiles by ratioColoredTiles and round to the
         * nearest integer. Fill at least one tile.
         */
        let numFilled = Math.max(1, Math.round(this.ctrl.numTiles * this.ctrl.numTiles / this.ctrl.ratioColoredTiles));
        /*
         * To know which tiles to fill, keep an array that has as many elements as
         * there are tiles. Set the first n tiles to be colored, then shuffle the
         * array. As we draw each tile, we shift the first array element.
         */
        let shouldFillArray = ArrayUtils.shuffle(Array(this.ctrl.numTiles * this.ctrl.numTiles).fill(false)
            .map((el, index) => index < numFilled));
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                let tileULX = (x - 1) * tileDim;
                let tileULY = (y - 1) * tileDim;
                let xOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                let yOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
                let shouldFill = shouldFillArray.shift();
                if (shouldFill) {
                    this.ctx.fillStyle = ArrayUtils.randomElement(palette);
                    this.ctx.fillRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
                }
                this.ctx.strokeRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
            }
        }
        this.ctx.restore();
    }
    description = `Each tile contains a randomly offset stroked square. A given ratio of squares, but at least one, is filled with a random color. Inspired by Vera Molnár.`;
    createdDate = '2023-09-28';
}
