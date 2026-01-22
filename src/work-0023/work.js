import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntPlusMinus
} from '/js/math.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 70, 50),
        makeSlider('scale', 'Scale: {0}', 1, 2, 1.5, 0.1),
        makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 10, 2),
        makeSlider('lineWidth', 'Line width: {0}', 1, 6, 1),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = ctrl.lineWidth;
    ctx.strokeStyle = 'black';
    // pad the work
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.97, 0.97);
    ctx.translate(-width / 2, -height / 2);
    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            ctx.rotate(2 * Math.PI * randomIntUpTo(ctrl.angleStep) / ctrl.angleStep);
            ctx.translate(
                randomIntPlusMinus(ctrl.maxOffsetPerAxis),
                randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            );
            // `ctx.scale(ctrl.scale, ctrl.scale)` instead would also change the line weight.
            ctx.beginPath();
            ctx.moveTo(ctrl.scale * -tileDim / 2, 0);
            ctx.lineTo(ctrl.scale * tileDim / 2, 0);
            ctx.stroke();
            ctx.restore();
        }
    }
    ctx.restore();
}
let description = `Each tile contains a randomly rotated and randomly offset line. Technically, the tile itself is rotated and offset, then a straign line is drawn. Inspired by Vera Molnár.`;
run({
    createdDate: '2023-09-22',
    description,
    setupControls,
    drawWork
});
