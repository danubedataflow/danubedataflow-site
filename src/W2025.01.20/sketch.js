'use strict';

let shapes;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 1, 10, 5),
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 1, 8, 2),
            makeSlider('ratioColoredTiles', 8, 32, 16),
        ),
    );
    shapes = [
        [
            '.....',
            '.....',
            'XXXXX',
            '.....',
            '.....'
        ],

        [
            'X....',
            'X....',
            'XXXXX',
            'X....',
            'X....'
        ],

        [
            'X...X',
            'X...X',
            'XXXXX',
            'X...X',
            'X...X'
        ],

        [
            'XXXXX',
            'X...X',
            'X...X',
            'X...X',
            'X...X'
        ],

        [
            'X...X',
            'X...X',
            'XXXXX',
            'X...X',
            'XXXXX'
        ],

        [
            'XXXXX',
            'X...X',
            'X...X',
            'X...X',
            'XXXXX'
        ],

        [
            'X....',
            'XXXXX',
            'X....',
            'XXXXX',
            'X....'
        ],

        [
            'XXXXX',
            '.....',
            '.....',
            '.....',
            'XXXXX'
        ],

        [
            'XXXXX',
            'X....',
            'XXXXX',
            'X....',
            'XXXXX'
        ],

        [
            'XXXXX',
            '....X',
            'XXXXX',
            'X....',
            'XXXXX'
        ],

        [
            'XXXXX',
            '.....',
            'XXXXX',
            '.....',
            'XXXXX'
        ],

        [
            'XXXXX',
            '.X X.',
            '.X X.',
            '.X X.',
            'XXXXX'
        ],

        [
            'XXXXX',
            '....X',
            '....X',
            '....X',
            '....X'
        ]
    ];
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    // see W2023.09.28
    let numColored = Math.max(1, Math.round(ctrl.numTiles * ctrl.numTiles / ctrl.ratioColoredTiles));
    let shouldColorArray = Array(ctrl.numTiles * ctrl.numTiles).fill(false)
        .map((el, index) => index < numColored).shuffle();

    // FIXME add chance of a random color in the current palette

    let tileDim = width / ctrl.numTiles;

    // each tile consists of 5 x 5 "pixels"
    let pixelDim = tileDim / 5;

    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to tile center to rotate
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            ctx.scale(0.9, 0.9);

            // random rotation by a multiple of 90 degrees
            ctx.rotate(randomIntUpTo(4) * Math.PI / 2);

            // Use random() in randomElement() in any case so the shapes,
            // chosen by another randomElement() below, stay the same when you
            // change the color chance.
            ctx.fillStyle = palette.randomElement();
            if (!shouldColorArray.shift()) ctx.fillStyle = 'black';

            // draw a random shape's pixels
            let shape = shapes.randomElement();
            for (let px = 0; px < 5; px++) {
                for (let py = 0; py < 5; py++) {
                    // if the shape array has an 'X' at (px,py), draw a rectangle there
                    if (shape[px].charAt(py) == 'X') {
                        // Assuming that the context has been moved to the
                        // tile's center, calculate the upper left corner of
                        // pixel (px, py).

                        let ulX = (px - 2.5) * pixelDim;
                        let ulY = (py - 2.5) * pixelDim;
                        ctx.fillRect(ulX, ulY, pixelDim, pixelDim);
                    }
                }
            }

            ctx.restore();
        }
    }
}
