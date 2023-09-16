'use strict';

function setupForm() {
    makeForm(
        makeSelectColorMap(),
        makeSlider('numColors', 'Anzahl der Farben', 2, 32, 16),
        makeSlider('numSides', 'Anzahl der Seiten', 3, 50, 10),
    );
}

function drawSketch() {
    background("black");
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    translate(width / 2, height / 2);

    let points = getPointsForPolygon(ctrl.numSides, width * 0.9, 0);

    // draw a line from each point to each point
    let colorIndex = 0;
    points.forEach((p, i) => {
        points.forEach((p2, j) => {
            if (i == j) return;
            stroke(palette[colorIndex]);
            colorIndex = (colorIndex + 1 + palette.length) % palette.length;
            line(...p, ...p2);
        });
    });
}
