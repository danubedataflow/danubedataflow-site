'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 2, 20, 10),
        makeSlider('numRects', 2, 20, 10),
        makeSlider('scale', 0.5, 1, 0.9, 0.1),
        makeSlider('strokeWeightRange', 1, 20, [10, 12]),
        makeSlider('alphaRange', 0, 100, [80, 100]),
    );
}

function drawSketch() {
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

        ctx.lineWidth = (randomIntRange(...ctrl.strokeWeightRange));
        let alpha = randomIntRange(...ctrl.alphaRange) / 100;
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.strokeRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
    ctx.restore();
}
