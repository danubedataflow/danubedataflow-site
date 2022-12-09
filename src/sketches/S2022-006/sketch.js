'use strict';

const config = new Config()
    .maxIterations(-1);

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    angleMode(DEGREES);
}

function drawSketch() {
    blendMode(ctrl.blendMode);
    translate(width / 2, height / 2);
    if (currentIteration % 2000 == 1) background('black'); // run on first frame as well

    let radius = width * 0.4;
    let angle = random(360);

    let colorScale = chroma.scale(ctrl.colorMap);
    let c = color(colorScale(random()).toString());
    stroke(c);

    line(0, 0, sin(angle) * radius, cos(angle) * radius);
}
