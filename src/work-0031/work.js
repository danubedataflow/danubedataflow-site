import {
    run,
    makeForm,
    makeSlider,
    makeCheckbox
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 10, 5),
        makeSlider('numLines', 'Number of lines: {0}', 1, 10, 5),
        makeSlider('lineWidth', 'Line c.width: {0}', 1, 3, 2),
        makeCheckbox('hasBend', 'Bend: '),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'black';
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to tile center to scale, then back to UL corner
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.scale(0.9, 0.9);
            c.ctx.translate(-tileDim / 2, -tileDim / 2);
            c.ctx.lineWidth = c.ctrl.lineWidth;
            for (let i = 0; i < c.ctrl.numLines; i++) {
                c.ctx.beginPath();
                c.ctx.moveTo(randomIntUpTo(tileDim), 0);
                if (c.ctrl.hasBend) c.ctx.lineTo(randomIntUpTo(tileDim), randomIntUpTo(tileDim));
                c.ctx.lineTo(randomIntUpTo(tileDim), tileDim);
                c.ctx.stroke();
            }
            // draw a border around the tile
            c.ctx.lineWidth = 1;
            c.ctx.strokeRect(0, 0, tileDim, tileDim);
            c.ctx.restore();
        }
    }
}
let description = `In each tile, a number of random lines are drawn at the given line c.width. Optionally all lines can be split into two, bending around a random point in the middle. Each tile has a border.`;
run({
    createdDate: '2025-01-18',
    description,
    setupControls,
    drawWork
});