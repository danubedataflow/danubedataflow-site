import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntPlusMinus
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 30, 15),
        makeSlider('numSquaresPerTile', 'Number of squares per tile: {0}', 2, 20, 10),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.save();
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'black';
    // pad the work
    c.ctx.translate(c.width / 2, c.height / 2);
    c.ctx.scale(0.9, 0.9);
    c.ctx.translate(-c.width / 2, -c.height / 2);
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            let tileULX = (x - 1) * tileDim;
            let tileULY = (y - 1) * tileDim;
            for (let i = 0; i < c.ctrl.numSquaresPerTile; i++) {
                let xOffset = randomIntPlusMinus(c.ctrl.maxOffsetPerAxis);
                let yOffset = randomIntPlusMinus(c.ctrl.maxOffsetPerAxis);
                c.ctx.strokeRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
            }
        }
    }
    c.ctx.restore();
}
let description = `Each tile contains a number of stroked squares, each randomly offset. Inspired by Vera Molnár.`;
run({
    createdDate: '2023-09-29',
    description,
    setupControls,
    drawWork
});