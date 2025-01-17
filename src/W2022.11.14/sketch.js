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
            makeSlider('lineWidthChance', 0, 100, 5),
            makeSlider('lineWidthRange', 1, 4, [2, 3]),
        ),
    );
}

function drawSketch() {
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // pad the sketch
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
