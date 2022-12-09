'use strict';

const config = new Config()
    .maxIterations(-1);

let radius, p;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    angleMode(DEGREES);
    radius = width * 0.4;
    let angle = random(360);
    p = [ sin(angle) * radius, cos(angle) * radius ];
}

function drawSketch() {
    blendMode(ctrl.blendMode);
    translate(width / 2, height / 2);
    if (currentIteration % 2000 == 1) background('black'); // run on first frame as well

    let colorScale = chroma.scale(ctrl.colorMap);
    let c = color(colorScale(random()).toString());
    stroke(c);

    let angle = random(360);
    let p2 = [ sin(angle) * radius, cos(angle) * radius ];
    line(...p, ...p2);
    p = p2;
}
