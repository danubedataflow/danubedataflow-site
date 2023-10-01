'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln pro Achse', 3, 10, 4),
        makeSlider('maxOffset', 'Maximaler Versatz pro Achse', 0, 20, 10),
        makeFieldset('Farbe',
            makeSlider('numRatio', 'Färbe eine in so vielen Kacheln', 8, 32, 16),
            makeSelectColorMap(),
            makeSlider('numColors', 'Anzahl der Farben', 1, 8, 2),
        ),
    );
}

function drawSketch() {
    noStroke();
    rectMode(CORNERS);
    background("white");
    stroke('black');
    padSketch(0.9);
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    /* Fill one in numRatio tiles. For example, if numRatio is 9, we want
     * to fill one in nine tiles.
     *
     * Divide the total number of tiles by numRatio and round to the
     * nearest integer. Fill at least one tile.
     *
     * To know which tiles to fill, keep an array of size numTiles ** 2;
     * one element per tile. As we draw each tile, we shift the first
     * array element.
     *
     * To distribute the n filled tiles randomly, mark the first n array
     * elements, then shuffle the array.
     */

    let numTilesTotal = pow(ctrl.numTiles, 2);
    let numFilled = max(1, round(numTilesTotal / ctrl.numRatio));
    let shouldFillArray = shuffle(Array.from(Array(numTilesTotal))
        .map((el, index) => { return index < numFilled }));

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        gridWidth: width,
        gridHeight: height,
        tileCallback: function(tile) {
            translate(
                int(random(2 * ctrl.maxOffset) - ctrl.maxOffset),
                int(random(2 * ctrl.maxOffset) - ctrl.maxOffset),
            );
            let shouldFill = shouldFillArray.shift();
            if (shouldFill) {
                fill(random(palette));
            } else {
                noFill();
            }
            rect(...tile.upperLeft, ...tile.lowerRight);
        },
    });
}
