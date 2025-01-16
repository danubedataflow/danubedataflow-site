'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 4, 40, 20),
        makeFieldset('rotation',
            makeSlider('rotationChance', 0, 100, 5),
            makeSlider('rotationRange', -45, 45, [-10, 10]),
        ),
        makeFieldset('scale',
            makeSlider('scaleChance', 0, 100, 5),
            makeSlider('scaleRange', 50, 150, [80, 120]),
        ),
        makeFieldset('translation',
            makeSlider('translationChance', 0, 100, 5),
            makeSlider('translationRange', -50, 50, [-20, 20]),
        ),
        makeFieldset('stroke',
            makeSlider('strokeWeightChance', 0, 100, 5),
            makeSlider('strokeWeightRange', 1, 4, [2, 3]),
        ),
    );
}

function drawSketch() {
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    padSketch();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            // `+ 0.5` to move to the tile's center
            ctx.translate((x - 1) * (dim + 0.5), (y - 1) * (dim + 0.5));

            if (randomIntUpTo(100) < ctrl.rotationChance) ctx.rotate(randomIntRange(...ctrl.rotationRange) * Math.PI / 180);
            if (randomIntUpTo(100) < ctrl.scaleChance) {
                let s = randomIntRange(...ctrl.scaleRange) / 100;
                ctx.scale(s, s);
            }
            if (randomIntUpTo(100) < ctrl.translationChance) ctx.translate(
                dim * randomIntRange(...ctrl.translationRange) / 100,
                dim * randomIntRange(...ctrl.translationRange) / 100);
            if (randomIntUpTo(100) < ctrl.strokeWeightChance) ctx.lineWidth = randomIntRange(...ctrl.strokeWeightRange);
            ctx.strokeRect(0, 0, dim, dim);

            ctx.restore();
        }
    }
    ctx.restore();
}
