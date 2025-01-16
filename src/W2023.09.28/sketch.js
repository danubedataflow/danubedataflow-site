'use strict';

let palette, shouldFillArray;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 0, 20, 10),
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 1, 8, 2),
            makeSlider('ratioColoredTiles', 8, 32, 16),
        ),
    );
}

function drawSketch() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    padSketch(0.9);
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    /* Fill one in ratioColoredTiles tiles. For example, if ratioColoredTiles
     * is 9, we want to fill one in nine tiles.
     *
     * Divide the total number of tiles by ratioColoredTiles and round to the
     * nearest integer. Fill at least one tile.
     *
     * To know which tiles to fill, keep an array of size numTiles ** 2; one
     * element per tile. As we draw each tile, we shift the first array
     * element.
     *
     * To distribute the n filled tiles randomly, mark the first n array
     * elements, then shuffle the array.
     */

    let numTilesTotal = Math.pow(ctrl.numTiles, 2);
    let numFilled = Math.max(1, Math.round(numTilesTotal / ctrl.ratioColoredTiles));
    shouldFillArray = Array.from(Array(numTilesTotal))
        .map((el, index) => {
            return index < numFilled
        }).shuffle();

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
    ctx.restore();
}

function drawTile(tile) {
    ctx.translate(
        randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        randomIntPlusMinus(ctrl.maxOffsetPerAxis),
    );
    let shouldFill = shouldFillArray.shift();
    if (shouldFill) {
        ctx.fillStyle = palette.randomElement();
        ctx.fillRect(...tile.upperLeft, tile.width, tile.height);
    }
    ctx.strokeRect(...tile.upperLeft, tile.width, tile.height);
}
