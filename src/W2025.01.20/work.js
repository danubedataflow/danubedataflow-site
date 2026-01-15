'use strict';

let createdDate = '2025.01.20';

let palette;

let shapes = [
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
        '.X.X.',
        '.X.X.',
        '.X.X.',
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

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 10, 5),
        makeFieldset('Colors',
            makeCheckbox('useColors', 'Colors: '),
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 1, 8, 2),
            makeSlider('ratioColoredTiles', 'Ratio of colored tiles: {0}', 8, 32, 16),
        ),
        makeFieldset('Layers',
            makeCheckbox('useLayers', 'Layers: '),
            makeSlider('numLayers', 'Number of layers: {0}', 2, 8, 4),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 10, 100, [50, 60]),
        ),
    );
}

function drawWork() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    if (ctrl.useLayers) {
        for (let layer = 1; layer <= ctrl.numLayers; layer++) {
            drawLayer();
        }
    } else { drawLayer(); }
}

function drawLayer() {

    // see W2023.09.28
    let numColored = Math.max(1, Math.round(ctrl.numTiles * ctrl.numTiles / ctrl.ratioColoredTiles));
    let shouldColorArray = Array(ctrl.numTiles * ctrl.numTiles).fill(false)
        .map((el, index) => index < numColored).shuffle();

    let tileDim = width / ctrl.numTiles;

    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to tile center to rotate
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            ctx.scale(0.9, 0.9);

            drawTile({
                tileDim,
                shouldColorArray
            })
            ctx.restore();
        }
    }
}

function drawTile(args) {
    const {
        tileDim,
        shouldColorArray
    } = args;

    // each tile consists of 5 x 5 "pixels"
    let pixelDim = tileDim / 5;

    // random rotation by a multiple of 90 degrees
    ctx.rotate(randomIntUpTo(4) * Math.PI / 2);

    // Use calls to random() in any case so the shapes, chosen by another
    // randomElement() below, stay the same when you // change the color
    // chance.
    let alpha = randomIntRange(...ctrl.alphaRange) / 100;

    // alpha is only used if we use layers
    if (!ctrl.useLayers) alpha = 1;

    ctx.fillStyle = colorRGBA(...chroma(palette.randomElement()).rgb(), alpha);
    if (ctrl.useColors) {
        if (!shouldColorArray.shift()) ctx.fillStyle = colorRGBA(0, 0, 0, alpha);
    } else {
        ctx.fillStyle = 'black';
    }

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

}
