import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
        makeFieldset('Rotation',
            makeSlider('rotationChance', 'Rotation probability: {0}%', 0, 100, 5),
            makeSlider('rotationRange', 'Rotation range: {0}° to {1}°', -45, 45, [-10, 10]),
        ),
        makeFieldset('Scale',
            makeSlider('scaleChance', 'Scale probability: {0}%', 0, 100, 5),
            makeSlider('scaleRange', 'Scale range: {0} to {1}', 50, 150, [80, 120]),
        ),
        makeFieldset('Translation',
            makeSlider('translationChance', 'Translation probability: {0}%', 0, 100, 5),
            makeSlider('translationRange', 'Translation range: {0} to {1}', -50, 50, [-20, 20]),
        ),
        makeFieldset('Stroke',
            makeSlider('lineWidthChance', 'Line c.width probability: {0}%', 0, 100, 5),
            makeSlider('lineWidthRange', 'Line c.width range: {0} to {1}', 1, 4, [2, 3]),
        ),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.save();
    clearCanvas();

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
            // `+ 0.5` to move to the tile's center
            c.ctx.translate((x - 1) * (tileDim + 0.5), (y - 1) * (tileDim + 0.5));
            if (randomIntUpTo(100) < c.ctrl.rotationChance) c.ctx.rotate(randomIntRange(...c.ctrl.rotationRange) * Math.PI / 180);
            if (randomIntUpTo(100) < c.ctrl.scaleChance) {
                let s = randomIntRange(...c.ctrl.scaleRange) / 100;
                c.ctx.scale(s, s);
            }
            if (randomIntUpTo(100) < c.ctrl.translationChance) c.ctx.translate(
                tileDim * randomIntRange(...c.ctrl.translationRange) / 100,
                tileDim * randomIntRange(...c.ctrl.translationRange) / 100);
            if (randomIntUpTo(100) < c.ctrl.lineWidthChance) c.ctx.lineWidth = randomIntRange(...c.ctrl.lineWidthRange);
            c.ctx.strokeRect(0, 0, tileDim, tileDim);
            c.ctx.restore();
        }
    }
    c.ctx.restore();
}
let description = `Each tile has separate probabilities of being rotated, scaled, translated and stroked. Inspired by Vera Molnár.`;
run({
    createdDate: '2022-11-14',
    description,
    setupControls,
    drawWork
});
