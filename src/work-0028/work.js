'use strict';

import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    random,
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorHSL
} from '/js/colors.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 5, 4),
        makeSlider('numPoints', 'Number of points per tile: {0}', 4, 10, 7),
        makeSlider('exponentsRange', 'Exponent range: {0} to {1}', 0.2, 5, [2, 3], 0.1),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    // random color, saturation and brightness
    ctx.fillStyle = colorHSL(randomIntRange(0, 350), randomIntRange(50, 100), randomIntRange(50, 100));
    ctx.fillRect(0, 0, width, height);

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            // Tile background: scale down to leave space between tiles
            ctx.scale(0.8, 0.8);
            ctx.fillStyle = 'white';
            ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);

            // Draw the tile. Scale down to leave a border on each tile.
            ctx.scale(0.8, 0.8);
            ctx.rotate(randomIntUpTo(4) * Math.PI / 2);

            // The following code assumes that (0, 0) is in the tile's upper left
            ctx.translate(-tileDim / 2, -tileDim / 2);

            // Get a random exponent for each tile
            let exponent = randomFloatRange(...ctrl.exponentsRange);
            let dim = tileDim / ctrl.numPoints;
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
    }
}

function randomFloatRange(lowerBound, upperBound) {
    return lowerBound + random() * (upperBound + 1 - lowerBound);
}

let description = `Take a probability value that goes from 0 at the top to 1 at the bottom. In order for a square to be drawn in a row, a random number must be larger than the probability value raised to the power of a given value. So the higher the exponent, the lower the threshold becomes, and the more likely it is that a square will be drawn.`;

run({
    createdDate: '2023-10-05',
    description,
    setupControls,
    drawWork
});
