'use strict';

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numLines', 'Number of lines', 1, 1500, 500),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    angleMode(DEGREES);
}

function draw() {
    readControls();
    blendMode(ctrl.blendMode);
    let colorScale = chroma.scale(ctrl.colorMap);
    translate(width / 2, height / 2);

    for (let i = 1; i <= ctrl.numLines; i++) {
        let radius = width * 0.4;
        let angle = random(360);

        let c = color(colorScale(random()).toString());
        stroke(c);

        line(0, 0, sin(angle) * radius, cos(angle) * radius);
    }
    noLoop();
}
