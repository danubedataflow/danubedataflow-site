'use strict';

/* Note: You can get outlines only (no fills) if you set the background color
 * and/or shape color's alpha to 0.
 */

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln', 2, 10, 4),
        makeSlider('maxDepth', 'Maximale Tiefe', 0, 4, 2),
    );
}

function drawSketch() {
    colorMode(HSB, 360, 100, 100, 100);
    angleMode(DEGREES);
    rectMode(CENTER);
    stroke('black');
    strokeWeight(1);
    padSketch();
    background("white");
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        gridWidth: width,
        gridHeight: height,
        numSubdivisions: function(depth) {
            if (depth >= ctrl.maxDepth) return 0;
            return (random() > 0.5) * int(random(3)) + 1;
        },
        tileCallback: function(tile) {

            // background rectangle for each tile
            fill(color(random(255), random(100)));
            rect(0, 0, tile.width, tile.height);

            // the random shape
            fill(color(random(255), 100 + random(155)));
            // rotate(90 * int(random(4)));
            scale((30 + random(70)) / 100);

            let r = random();
            if (r < 0.33) {
                triangle(...tile.upperLeft, ...tile.upperRight, ...tile.lowerMiddle);
            } else if (r < 0.66) {
                circle(...tile.center, min(tile.width, tile.height));
            } else {
                rect(...tile.center, tile.width, tile.height);
            }

        }
    });
}
