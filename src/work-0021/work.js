import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numRects', 'Number of rectangles: {0}', 10, 100, 50),
        makeSlider('lineWidthRange', 'Line c.width range: {0} to {1}', 1, 20, [2, 4]),
        makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [80, 100]),
    );
}

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    let tileDim = c.width / c.ctrl.numTiles;
    for (let i = 0; i <= c.ctrl.numRects; i++) {
        let ulX = randomIntUpTo(c.width);
        let ulY = randomIntUpTo(c.height);
        let w = randomIntUpTo(c.width - ulX);
        let h = randomIntUpTo(c.height - ulY);
        c.ctx.lineWidth = randomIntRange(...c.ctrl.lineWidthRange);
        let alpha = randomIntRange(...c.ctrl.alphaRange) / 100;
        c.ctx.strokeStyle = colorRGBA(0, 0, 0, alpha);
        c.ctx.strokeRect(ulX, ulY, w, h);
    }
}
let description = `Random rectangles with random border line c.widths and random alpha are overlaid on top of each other.`;
run({
    createdDate: '2023-09-13',
    description,
    setupControls,
    drawWork
});
