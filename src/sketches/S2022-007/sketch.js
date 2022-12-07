'use strict';

const config = new Config()
    .title('S2022-007');

let radius, p;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    radius = width * 0.4;
    p = getRandomPointOnCircle(radius);
}

function drawSketch() {
    blendMode(ctrl.blendMode);
    translate(width / 2, height / 2);
    if (currentIteration % 2000 == 1) background('black'); // run on first frame as well

    let colorScale = chroma.scale(ctrl.colorMap);
    let c = color(colorScale(random()).toString());
    stroke(c);

    let p2 = getRandomPointOnCircle(radius);
    line(...p, ...p2);
    p = p2;
}
