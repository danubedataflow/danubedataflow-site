'use strict';

/* based on the Mathologer video
 * "Times Tables, Mandelbrot and the Heart of Mathematics"
 * https://www.youtube.com/watch?v=qhbuKbxJsk8
 */

const config = new Config()
    .title('S2022-013')
    .maxIterations(1);

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    // the modulus is the number of points on the circle
    makeSlider('modulus', 'Modulus', 10, 300, 100),
    makeSlider('timesTable', 'Times table', 2, 100, 10, 0.2),
);

let palette;

function initSketch() {
    angleMode(DEGREES);
    fill('white');
    strokeWeight(1);
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.modulus);
}

function drawSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('#cccccc');

    push();
    translate(width / 2, height / 2);
    circle(0, 0, width);

    blendMode(ctrl.blendMode);
    const radius = width / 2;
    for (let i = 0; i < ctrl.modulus; i++) {

        // cycle through all colors in the palette; wrap around
        const colorIndex = (i + palette.length) % palette.length;
        stroke(palette[colorIndex]);

        line(
            ...pointOnCircle(angle(i), radius),
            ...pointOnCircle(angle(i * ctrl.timesTable), radius)
        );
    }
    pop();
}

function angle(n) {
    return n * 360 / ctrl.modulus;
}

function pointOnCircle(angle, radius) {
    return [sin(angle) * radius, cos(angle) * radius];
}