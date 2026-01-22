import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntPlusMinus
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 70, 50),
        makeSlider('scale', 'Scale: {0}', 1, 2, 1.5, 0.1),
        makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 10, 2),
        makeSlider('lineWidth', 'Line c.width: {0}', 1, 6, 1),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.save();
    clearCanvas();
    c.ctx.lineWidth = c.ctrl.lineWidth;
    c.ctx.strokeStyle = 'black';
    // pad the work
    c.ctx.translate(c.width / 2, c.height / 2);
    c.ctx.scale(0.97, 0.97);
    c.ctx.translate(-c.width / 2, -c.height / 2);
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.rotate(2 * Math.PI * randomIntUpTo(c.ctrl.angleStep) / c.ctrl.angleStep);
            c.ctx.translate(
                randomIntPlusMinus(c.ctrl.maxOffsetPerAxis),
                randomIntPlusMinus(c.ctrl.maxOffsetPerAxis),
            );
            // `c.ctx.scale(c.ctrl.scale, c.ctrl.scale)` instead would also change the line weight.
            c.ctx.beginPath();
            c.ctx.moveTo(c.ctrl.scale * -tileDim / 2, 0);
            c.ctx.lineTo(c.ctrl.scale * tileDim / 2, 0);
            c.ctx.stroke();
            c.ctx.restore();
        }
    }
    c.ctx.restore();
}
let description = `Each tile contains a randomly rotated and randomly offset line. Technically, the tile itself is rotated and offset, then a straign line is drawn. Inspired by Vera Molnár.`;
run({
    createdDate: '2023-09-22',
    description,
    setupControls,
    drawWork
});
