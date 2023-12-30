'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 1, 5, 3),
        makeSlider('lineGap', 5, 100, 50),
        makeSlider('maxMovement', 5, 20, 10),
    );
}

function drawSketch() {
    background('white');
    stroke('black');
    noFill();
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    scale(0.9);
    drawWalkers(tile);
    rotate(90);
    drawWalkers(tile);
}

function drawWalkers(tile) {
    push();
    translate(...tile.upperLeft);
    for (let startY = 0; startY <= tile.height; startY += ctrl.lineGap) {
        let y = startY;
        fill(color(random(255), random(255), random(255), 50));

        /* Make a shape that borders the left, top and right side; the bottom
         * is determined by the walker. We use a random semitransparent fill
         * for each shape so each intersecting shape of adjacent horizontal and
         * vertical walkers is filled by a color that is related to its
         * neighbors.
         */
        beginShape();
        vertex(0, 0);
        for (let x = 0; x <= tile.width; x += ctrl.maxMovement) {
            vertex(x, y);
            y = constrain(y + random(-ctrl.maxMovement, ctrl.maxMovement), 0, tile.height);
        }
        vertex(tile.width, 0);
        endShape(CLOSE);
    }

    // draw a border
    noFill();
    rect(0, 0, tile.width, tile.height);
    pop();
}
