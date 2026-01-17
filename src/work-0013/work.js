'use strict';
import {
    run,
    makeForm,
    makeSlider,
    makeCheckbox
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
        makeSlider('horizontalLineChance', 'Probability of a horizontal line: {0}%', 0, 100, 30),
        makeSlider('verticalLineChance', 'Probability of a vertical line: {0}%', 0, 100, 30),
        makeSlider('diagonalUpwardsLineChance', 'Probability of a diagonal upwards line: {0}%', 0, 100, 30),
        makeSlider('diagonalDownwardsLineChance', 'Probability of a diagonal downwards line: {0}%', 0, 100, 30),
        makeCheckbox('hasTileBorder', 'Tile border: '),
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
    // pad the work
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.97, 0.97);
    ctx.translate(-width / 2, -height / 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
            if (ctrl.hasTileBorder) ctx.strokeRect(0, 0, tileDim, tileDim);
            if (randomIntUpTo(100) < ctrl.horizontalLineChance) {
                ctx.beginPath();
                ctx.moveTo(0, tileDim / 2);
                ctx.lineTo(tileDim, tileDim / 2);
                ctx.stroke();
            }
            if (randomIntUpTo(100) < ctrl.verticalLineChance) {
                ctx.beginPath();
                ctx.moveTo(tileDim / 2, 0);
                ctx.lineTo(tileDim / 2, tileDim);
                ctx.stroke();
            }
            if (randomIntUpTo(100) < ctrl.diagonalUpwardsLineChance) {
                ctx.beginPath();
                ctx.moveTo(0, tileDim);
                ctx.lineTo(tileDim, 0);
                ctx.stroke();
            }
            if (randomIntUpTo(100) < ctrl.diagonalDownwardsLineChance) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(tileDim, tileDim);
                ctx.stroke();
            }
            ctx.restore();
        }
    }
    ctx.restore();
}
let description = `Each tile has separate probabilities of containing a horizontal line, a vertical line, a diagonal upwards line and a diagonal downwards line.`;
run({
    createdDate: '2022-11-07',
    description,
    setupControls,
    drawWork
});