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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
