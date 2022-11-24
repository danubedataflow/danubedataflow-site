'use strict';

const config = new Config()
    .title('S2022-006');

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
}

function drawSketch() {
    blendMode(ctrl.blendMode);
    translate(width / 2, height / 2);
    if (currentIteration % 2000 == 1) background('black'); // run on first frame as well

    let radius = width * 0.4;
    let point = getRandomPointOnCircle(radius);

    let colorScale = chroma.scale(ctrl.colorMap);
    let c = color(colorScale(random()).toString());
    stroke(c);

    line(0, 0, point.x, point.y);
}
