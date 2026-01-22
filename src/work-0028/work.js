import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    random,
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorHSL
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 5, 4),
        makeSlider('numPoints', 'Number of points per tile: {0}', 4, 10, 7),
        makeSlider('exponentsRange', 'Exponent range: {0} to {1}', 0.2, 5, [2, 3], 0.1),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas();
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            // Tile background: scale down to leave space between tiles
            c.ctx.scale(0.8, 0.8);
            c.ctx.fillStyle = 'white';
            c.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
            // Draw the tile. Scale down to leave a border on each tile.
            c.ctx.scale(0.8, 0.8);
            c.ctx.rotate(randomIntUpTo(4) * Math.PI / 2);
            // The following code assumes that (0, 0) is in the tile's upper left
            c.ctx.translate(-tileDim / 2, -tileDim / 2);
            // Get a random exponent for each tile
            let exponent = randomFloatRange(...c.ctrl.exponentsRange);
            let dim = tileDim / c.ctrl.numPoints;
            for (let y = 1; y <= c.ctrl.numPoints; y++) {
                for (let x = 1; x <= c.ctrl.numPoints; x++) {
                    c.ctx.save();
                    c.ctx.translate((x - 1) * dim, (y - 1) * dim);
                    // 0 < yPercent < 1, so the higher the exponent the more
                    // likely a rectangle will be drawn.
                    let yPercent = (y - 1) / c.ctrl.numPoints;
                    c.ctx.scale(0.9, 0.9); // to have space between the squares
                    if (random() > Math.pow(yPercent, exponent)) {
                        c.ctx.fillStyle = 'black';
                        c.ctx.fillRect(0, 0, dim, dim);
                    }
                    c.ctx.restore();
                }
            }
            c.ctx.restore();
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
