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

    // scale down so the outer border is visible
    translate(width / 2, height / 2);
    scale(0.97);
    translate(-width / 2, -height / 2);

    background("white");
    makeGrid(ctrl.numTiles, width, ctrl.maxDepth);
}

// make square grids
function makeGrid(numTiles, gridDim, maxDepth = 0, depth = 0) {
    let dim = gridDim / numTiles;
    for (let y = 1; y <= numTiles; y++) {
        for (let x = 1; x <= numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            if (depth < maxDepth && random() > 0.5) {
                // make a sub-grid that is as big as the tile
                makeGrid(int(random(3)) + 1, dim, maxDepth, depth + 1)
            } else {
                push();

                // Move to the tile center so that rotation and scaling happen
                // around that center.
                translate(dim / 2, dim / 2);

                // background rectangle for each tile
                fill(color(random(255), random(100)));
                rect(0, 0, dim, dim);

                // the random shape
                fill(color(random(255), 100 + random(155)));
                rotate(90 * int(random(4)));
                scale((30 + random(70)) / 100);

                let r = random();
                if (r < 0.33) {
                    triangle(-dim / 2, -dim / 2, dim / 2, -dim / 2, 0, dim / 2);
                } else if (r < 0.66) {
                    circle(0, 0, dim);
                } else {
                    rect(0, 0, dim, dim);
                }

                pop();
            }
            pop();
        }
    }
}
