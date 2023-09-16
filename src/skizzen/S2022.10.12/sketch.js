'use strict';

function setupForm() {
    makeForm(
        makeSelectColorMap(),
        makeSlider('numColors', 'Anzahl der Farben', 2, 32, 16),
        makeSlider('numSides', 'Anzahl der Seiten', 3, 10, 5),
        makeFieldset('Skalierung',
            makeSlider('scaleRange', 'Bereich (%)', 1, 100, [5, 80]),
            makeSlider('scaleDelta', 'Delta (%)', 1, 5, 2),
        ),
    );
}

function drawSketch() {
    readControls();

    let roughCanvas = rough.canvas(canvas.elt);
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    background('white');
    noFill();
    translate(width / 2, height / 2);

    let colorIndex = 0;
    let [minScale, maxScale] = ctrl.scaleRange;

    // for some reason roughCanvas.polygon() and .linearPoath() don't do anything

    for (let f = minScale / 100; f < maxScale / 100; f += ctrl.scaleDelta / 100) {
        getPointsForPolygon(ctrl.numSides, width * f, 180).pairwise((current, next) => {
            roughCanvas.line(...current, ...next, {
                stroke: palette[colorIndex],
                strokeWidth: 2
            });
            colorIndex = (colorIndex + 1) % palette.length;
        });
    }
}
