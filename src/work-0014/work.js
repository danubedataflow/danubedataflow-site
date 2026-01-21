import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';

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
            makeSlider('lineWidthChance', 'Line width probability: {0}%', 0, 100, 5),
            makeSlider('lineWidthRange', 'Line width range: {0} to {1}', 1, 4, [2, 3]),
        ),
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
            // `+ 0.5` to move to the tile's center
            ctx.translate((x - 1) * (tileDim + 0.5), (y - 1) * (tileDim + 0.5));
            if (randomIntUpTo(100) < ctrl.rotationChance) ctx.rotate(randomIntRange(...ctrl.rotationRange) * Math.PI / 180);
            if (randomIntUpTo(100) < ctrl.scaleChance) {
                let s = randomIntRange(...ctrl.scaleRange) / 100;
                ctx.scale(s, s);
            }
            if (randomIntUpTo(100) < ctrl.translationChance) ctx.translate(
                tileDim * randomIntRange(...ctrl.translationRange) / 100,
                tileDim * randomIntRange(...ctrl.translationRange) / 100);
            if (randomIntUpTo(100) < ctrl.lineWidthChance) ctx.lineWidth = randomIntRange(...ctrl.lineWidthRange);
            ctx.strokeRect(0, 0, tileDim, tileDim);
            ctx.restore();
        }
    }
    ctx.restore();
}
let description = `Each tile has separate probabilities of being rotated, scaled, translated and stroked. Inspired by Vera Molnár.`;
run({
    createdDate: '2022-11-14',
    description,
    setupControls,
    drawWork
});
