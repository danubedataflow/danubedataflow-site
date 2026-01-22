import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
import {
    colorHSL
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 5),
        makeSlider('colorAngle', 'Angle on the color wheel: {0}', 0, 359, 0),
        makeSlider('scaleInner', 'Scale of the inner squares: {0}', 0.3, 0.7, 0.5, 0.05),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas();
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.fillStyle = colorHSL(c.ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
            c.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
            c.ctx.scale(c.ctrl.scaleInner, c.ctrl.scaleInner);
            c.ctx.fillStyle = colorHSL(c.ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
            c.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
            c.ctx.restore();
        }
    }
}
let description = `Each square tile is filled with a color from the given angle on the color wheel. Then a smaller inner square is drawn as well. Both squares are drawn with random transparency. Inspired by Vera Molnár.`;
run({
    createdDate: '2023-10-03',
    description,
    setupControls,
    drawWork
});
