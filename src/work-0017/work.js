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

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
        makeSlider('scale', 'Scale: {0}', 0.5, 1, 0.9, 0.1),
        makeSlider('lineWidthRange', 'Stroke weight range: {0} to {1}', 1, 20, [10, 12]),
        makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    // Scale down to create a margin so the outermost strokes won't be clipped.
    let dim = width; // width == height because of square canvas
    ctx.save();
    ctx.translate(dim / 2, dim / 2);
    ctx.scale(ctrl.scale, ctrl.scale);
    ctx.translate(-dim / 2, -dim / 2);
    let tileDim = width / ctrl.numTiles;
    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);
        ctx.lineWidth = (randomIntRange(...ctrl.lineWidthRange));
        let alpha = randomIntRange(...ctrl.alphaRange) / 100;
        ctx.strokeStyle = colorRGBA(0, 0, 0, alpha);
        ctx.strokeRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
    ctx.restore();
}
let description = `Random stroked rectangles. The strokes have random weights and transparencies. Each rectangle spans a random number of horizontal and vertical tiles.`;
run({
    createdDate: '2022-11-30',
    description,
    setupControls,
    drawWork
});