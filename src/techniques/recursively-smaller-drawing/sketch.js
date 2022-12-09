'use strict';

/* from the book "Processing for Visual Artists"
 * https://github.com/codigo42/processing-glassner/Ch10-recursion/sketches/spinners7/spinners7.pde
 */

makeForm(
    makeSelectColorMap(),
    makeSlider('numCircles', 'Number of circles', 2, 8, 3),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 2),
    makeSlider('translation', 'Translation', 0.1, 1, 0.6, 0.05),
    makeSlider('scaleFactor', 'Scale factor', 0.1, 1, 0.4, 0.05),
    makeSlider('speed', 'Speed', 0.1, 2, 0.8, 0.05),
);

let palette, theta;

function setup() {
    initCanvas();
}

function init() {
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.maxDepth + 1).shuffle();
    theta = 0;
}

function draw() {
    readControls();

    angleMode(DEGREES);
    noStroke();

    background('#cccccc');
    translate(width / 2, height / 2);
    scale(width * 0.45);
    drawCircles(0);
    theta += ctrl.speed;
}

function drawCircles(depth) {
    fill(palette[depth]);
    ellipse(0, 0, 2, 2);

    for (let i = 0; i < ctrl.numCircles; i++) {
        push();
        rotate(theta + (i * 360) / ctrl.numCircles);
        translate(0, ctrl.translation);
        scale(ctrl.scaleFactor);
        if (depth < ctrl.maxDepth) drawCircles(depth + 1);
        pop();
    }
}
