import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
        makeSlider('scale', 'Scale: {0}', 0.5, 1, 0.9, 0.1),
        makeSlider('lineWidthRange', 'Line c.width range: {0} to {1}', 1, 20, [10, 12]),
        makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
    );
}

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    // Scale down to create a margin so the outermost strokes won't be clipped.
    let dim = c.width; // c.width == c.height because of square canvas
    c.ctx.save();
    c.ctx.translate(dim / 2, dim / 2);
    c.ctx.scale(c.ctrl.scale, c.ctrl.scale);
    c.ctx.translate(-dim / 2, -dim / 2);
    let tileDim = c.width / c.ctrl.numTiles;
    for (let i = 0; i <= c.ctrl.numRects; i++) {
        let ulX = randomIntRange(0, c.ctrl.numTiles - 1);
        let ulY = randomIntRange(0, c.ctrl.numTiles - 1);
        let spanX = randomIntRange(1, c.ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, c.ctrl.numTiles - ulY);
        c.ctx.lineWidth = (randomIntRange(...c.ctrl.lineWidthRange));
        let alpha = randomIntRange(...c.ctrl.alphaRange) / 100;
        c.ctx.strokeStyle = colorRGBA(0, 0, 0, alpha);
        c.ctx.strokeRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
    c.ctx.restore();
}
let description = `Random stroked rectangles. The strokes have random weights and transparencies. Each rectangle spans a random number of horizontal and vertical tiles.`;
run({
    createdDate: '2022-11-30',
    description,
    setupControls,
    drawWork
});
