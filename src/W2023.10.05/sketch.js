'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 3, 5, 4),
        makeSlider('numPoints', 4, 10, 7),
        makeSlider('exponentsRange', 0.2, 5, [2, 3], 0.1),
    );
}

function drawSketch() {
    // random color, saturation and brightness
    let h = randomIntRange(0, 350);
    let s = randomIntRange(50, 100);
    let l = randomIntRange(50, 100);
    ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
    ctx.fillRect(0, 0, width, height);

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    ctx.save();

    // Tile background: scale down to leave space between tiles
    ctx.scale(0.8, 0.8);
    ctx.fillStyle = 'white';
    ctx.fillRect(...tile.upperLeft, tile.width, tile.height);

    // Draw the tile. Scale down to leave a border on each tile.
    ctx.scale(0.8, 0.8);
    ctx.rotate(randomIntUpTo(4) * Math.PI / 2);

    // The following code assumes that (0, 0) is in the tile's upper left
    ctx.translate(...tile.upperLeft);

    // Get a random exponent for each tile
    let exponent = randomFloatRange(...ctrl.exponentsRange);
    let dim = tile.width / ctrl.numPoints;
    for (let y = 1; y <= ctrl.numPoints; y++) {
        for (let x = 1; x <= ctrl.numPoints; x++) {
            ctx.save();
            ctx.translate((x - 1) * dim, (y - 1) * dim);

            // 0 < yPercent < 1, so the higher the exponent the more
            // likely a rectangle will be drawn.
            let yPercent = (y - 1) / ctrl.numPoints;
            ctx.scale(0.9, 0.9); // to have space between the squares
            if (random() > Math.pow(yPercent, exponent)) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, dim, dim);
            }

            ctx.restore();
        }
    }
    ctx.restore();
}

function randomFloatRange(lowerBound, upperBound) {
    return lowerBound + random() * (upperBound + 1 - lowerBound);
}

