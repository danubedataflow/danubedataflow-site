'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap
} from '/js/ui.js';
import {
    randomIntPlusMinus
} from '/js/math.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 20, 10),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 1, 8, 2),
            makeSlider('ratioColoredTiles', 'Ratio of colored tiles: {0}', 8, 32, 16),
        ),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    // pad the work
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.9, 0.9);
    ctx.translate(-width / 2, -height / 2);

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

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

    let numFilled = Math.max(1, Math.round(ctrl.numTiles * ctrl.numTiles / ctrl.ratioColoredTiles));
    let shouldFillArray = Array(ctrl.numTiles * ctrl.numTiles).fill(false)
        .map((el, index) => index < numFilled).shuffle();

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            let tileULX = (x - 1) * tileDim;
            let tileULY = (y - 1) * tileDim;
            let xOffset = randomIntPlusMinus(ctrl.maxOffsetPerAxis);
            let yOffset = randomIntPlusMinus(ctrl.maxOffsetPerAxis);

            let shouldFill = shouldFillArray.shift();
            if (shouldFill) {
                ctx.fillStyle = palette.randomElement();
                ctx.fillRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
            }
            ctx.strokeRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
        }
    }
    ctx.restore();
}

run({
    createdDate: '2023.09.28',
    setupControls,
    drawWork
});
