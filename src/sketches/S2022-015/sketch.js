'use strict';

const config = new Config()
    .maxIterations(1);

makeForm(
    makeSelectColorMap(),
    makeSlider('numColors', 'Number of colors', 2, 32, 16),
    makeSlider('numSides', 'Number of sides', 3, 10, 5),
    makeFieldset('Scale',
        makeSlider('scaleRange', 'Range (%)', 1, 100, [5, 80]),
        makeSlider('scaleDelta', 'Delta (%)', 1, 5, 2),
    ),
);

let roughCanvas, palette;

function initSketch() {
    if (roughCanvas === undefined) {
        roughCanvas = rough.canvas(canvas.elt);
    }
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
}

function drawSketch() {
    background('white');
    noFill();
    translate(width / 2, height / 2);

    let colorIndex = 0;
    let [minScale, maxScale] = ctrl.scaleRange;
    // for some reason roughCanvas.polygon() and .linearPoath() don't do anything
    for (let f = minScale / 100; f < maxScale / 100; f += ctrl.scaleDelta / 100) {
        pairwise(getPointsForPolygon(ctrl.numSides, width * f, 180), (current, next) => {
            roughCanvas.line(...current, ...next, {
                stroke: palette[colorIndex],
                strokeWidth: 2
            });
            colorIndex = (colorIndex + 1) % palette.length;
        });
    }
}

function pairwise(arr, func) {
    for (let i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1])
    }
}
