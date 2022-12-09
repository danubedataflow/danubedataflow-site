'use strict';

let radius, p;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numLines', 'Number of lines', 1, 1500, 500),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    angleMode(DEGREES);
    radius = width * 0.4;
    let angle = random(360);
    p = [sin(angle) * radius, cos(angle) * radius];
}

function draw() {
    readControls();
    blendMode(ctrl.blendMode);
    let colorScale = chroma.scale(ctrl.colorMap);
    translate(width / 2, height / 2);

    for (let i = 1; i <= ctrl.numLines; i++) {
        let c = color(colorScale(random()).toString());
        stroke(c);

        let angle = random(360);
        let p2 = [sin(angle) * radius, cos(angle) * radius];
        line(...p, ...p2);
        p = p2;
    }
    noLoop();
}
