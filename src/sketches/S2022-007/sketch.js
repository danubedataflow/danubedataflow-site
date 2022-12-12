'use strict';

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numLines', 'Number of lines', 1, 1500, 500),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();
    blendMode(BLEND); // so background() actually clears the canvas
    background('black');
    angleMode(DEGREES);
    let radius = width * 0.4;
    let angle = random(360);
    let p = [sin(angle) * radius, cos(angle) * radius];
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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
