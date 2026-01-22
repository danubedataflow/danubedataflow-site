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
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
        makeSlider('horizontalLineChance', 'Probability of a horizontal line: {0}%', 0, 100, 30),
        makeSlider('verticalLineChance', 'Probability of a vertical line: {0}%', 0, 100, 30),
        makeSlider('diagonalUpwardsLineChance', 'Probability of a diagonal upwards line: {0}%', 0, 100, 30),
        makeSlider('diagonalDownwardsLineChance', 'Probability of a diagonal downwards line: {0}%', 0, 100, 30),
        makeCheckbox('hasTileBorder', 'Tile border: '),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.save();
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    // pad the work
    c.ctx.translate(c.width / 2, c.height / 2);
    c.ctx.scale(0.97, 0.97);
    c.ctx.translate(-c.width / 2, -c.height / 2);
    c.ctx.lineWidth = 1;
    c.ctx.strokeStyle = 'black';
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            c.ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
            if (c.ctrl.hasTileBorder) c.ctx.strokeRect(0, 0, tileDim, tileDim);
            if (randomIntUpTo(100) < c.ctrl.horizontalLineChance) {
                c.ctx.beginPath();
                c.ctx.moveTo(0, tileDim / 2);
                c.ctx.lineTo(tileDim, tileDim / 2);
                c.ctx.stroke();
            }
            if (randomIntUpTo(100) < c.ctrl.verticalLineChance) {
                c.ctx.beginPath();
                c.ctx.moveTo(tileDim / 2, 0);
                c.ctx.lineTo(tileDim / 2, tileDim);
                c.ctx.stroke();
            }
            if (randomIntUpTo(100) < c.ctrl.diagonalUpwardsLineChance) {
                c.ctx.beginPath();
                c.ctx.moveTo(0, tileDim);
                c.ctx.lineTo(tileDim, 0);
                c.ctx.stroke();
            }
            if (randomIntUpTo(100) < c.ctrl.diagonalDownwardsLineChance) {
                c.ctx.beginPath();
                c.ctx.moveTo(0, 0);
                c.ctx.lineTo(tileDim, tileDim);
                c.ctx.stroke();
            }
            c.ctx.restore();
        }
    }
    c.ctx.restore();
}
let description = `Each tile has separate probabilities of containing a horizontal line, a vertical line, a diagonal upwards line and a diagonal downwards line.`;
run({
    createdDate: '2022-11-07',
    description,
    setupControls,
    drawWork
});