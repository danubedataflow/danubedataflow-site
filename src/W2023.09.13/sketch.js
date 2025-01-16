'use strict';

function setupControls() {
    makeForm(
        makeSlider('numRects', 10, 100, 50),
        makeSlider('lineWidthRange', 1, 20, [2, 4]),
        makeSlider('alphaRange', 0, 100, [80, 100]),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntUpTo(width);
        let ulY = randomIntUpTo(height);
        let w = randomIntUpTo(width - ulX);
        let h = randomIntUpTo(height - ulY);

        ctx.lineWidth = randomIntRange(...ctrl.lineWidthRange);
        let alpha = randomIntRange(...ctrl.alphaRange) / 100;
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.strokeRect(ulX, ulY, w, h);
    }
}
