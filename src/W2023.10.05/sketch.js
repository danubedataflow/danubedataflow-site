'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'XXX', 3, 5, 4),
        makeSlider('numPoints', 'XXX', 4, 10, 7),
        makeSlider('exponentsRange', 'XXX', 0.2, 5, [2, 3], 0.1),
    );
}

function drawSketch() {
    colorMode(HSB, 360, 100, 100);

    // random color, saturation and brightness
    background(color(
        randomIntRange(0, 350),
        randomIntRange(50, 100),
        randomIntRange(50, 100)
    ));

    noStroke();

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {

    // Tile background: scale down to leave space between tiles
    scale(0.8);
    fill('white');
    rect(...tile.upperLeft, ...tile.lowerRight);

    // Draw the tile. Scale down to leave a border on each tile.
    scale(0.8);
    rotate(90 * int(random(4)));

    // The following code assumes that (0, 0) is in the tile's upper left
    translate(...tile.upperLeft);

    // Get a random exponent for each tile
    let exponent = random(...ctrl.exponentsRange);
    let dim = tile.width / ctrl.numPoints;
    for (let y = 1; y <= ctrl.numPoints; y++) {
        for (let x = 1; x <= ctrl.numPoints; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            // 0 < yPercent < 1, so the higher the exponent the more
            // likely a rectangle will be drawn.
            let yPercent = map(y, 1, ctrl.numPoints, 0, 1);
            scale(0.9); // to have space between the squares
            if (random() > pow(yPercent, exponent)) {
                fill('black');
                rect(0, 0, dim, dim);
            }

            pop();
        }
    }
}
