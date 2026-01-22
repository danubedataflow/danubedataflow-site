import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeCheckbox,
    makeSelectColorMap
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
import {
    shuffle,
    randomElement
} from '/js/array.js';
let c, palette;
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

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);

    palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);
    if (c.ctrl.useLayers) {
        for (let layer = 1; layer <= c.ctrl.numLayers; layer++) {
            drawLayer();
        }
    } else {
        drawLayer();
    }
}

function drawLayer() {
    // see Work 0024
    let numColored = Math.max(1, Math.round(c.ctrl.numTiles * c.ctrl.numTiles / c.ctrl.ratioColoredTiles));
    let shouldColorArray = shuffle(Array(c.ctrl.numTiles * c.ctrl.numTiles).fill(false)
        .map((el, index) => index < numColored));
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to tile center to rotate
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.scale(0.9, 0.9);
            drawTile(tileDim, shouldColorArray);
            c.ctx.restore();
        }
    }
}

function drawTile(tileDim, shouldColorArray) {
    // each tile consists of 5 x 5 "pixels"
    let pixelDim = tileDim / 5;
    // random rotation by a multiple of 90 degrees
    c.ctx.rotate(randomIntUpTo(4) * Math.PI / 2);
    // Use calls to random() in any case so the shapes, chosen by another
    // randomElement() below, stay the same when you // change the color
    // chance.
    let alpha = randomIntRange(...c.ctrl.alphaRange) / 100;
    // alpha is only used if we use layers
    if (!c.ctrl.useLayers) alpha = 1;

    if (c.ctrl.useColors) {
        if (shouldColorArray.shift()) {
            c.ctx.fillStyle = colorRGBA(...chroma(randomElement(palette)).rgb(), alpha);
        } else {
            c.ctx.fillStyle = colorRGBA(0, 0, 0, alpha);
        }
    } else {
        c.ctx.fillStyle = colorRGBA(0, 0, 0, alpha);
    }

    // draw a random shape's pixels
    let shape = randomElement(shapes);
    for (let px = 0; px < 5; px++) {
        for (let py = 0; py < 5; py++) {
            // if the shape array has an 'X' at (px,py), draw a rectangle there
            if (shape[px].charAt(py) == 'X') {
                // Assuming that the context has been moved to the
                // tile's center, calculate the upper left corner of
                // pixel (px, py).
                let ulX = (px - 2.5) * pixelDim;
                let ulY = (py - 2.5) * pixelDim;
                c.ctx.fillRect(ulX, ulY, pixelDim, pixelDim);
            }
        }
    }
}
let description = `Each square tile has one or more layers of shapes. They shapes can optionally be colored. If there is more than one layer`;
run({
    createdDate: '2025-01-20',
    description,
    setupControls,
    drawWork
});
