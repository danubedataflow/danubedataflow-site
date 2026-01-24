import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0024 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
            this.makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 20, 10),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 8, 2),
                this.makeSlider('ratioColoredTiles', 'One in {0} tiles is colored', 8, 32, 16),
            ),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.scaleCanvas(0.9); // padding
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
        this.tileIterator((tile) => {
            let xOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
            let yOffset = MathUtils.randomIntPlusMinus(this.ctrl.maxOffsetPerAxis);
            let rectArgs = [tile.upperLeft().move(xOffset, yOffset), tile.tileDim, tile.tileDim];
            if (shouldFillArray.shift()) {
                this.ctx.fillStyle = ArrayUtils.randomElement(palette);
                this.fillRectForPoint(...rectArgs);
            }
            this.strokeRectForPoint(...rectArgs);
        });
    }
    description = `Each tile contains a randomly offset stroked square. A given ratio of squares, but at least one, is filled with a random color. Inspired by Vera Molnár.`;
    createdDate = '2023-09-28';
}