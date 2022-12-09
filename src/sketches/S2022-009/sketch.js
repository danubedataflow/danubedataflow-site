'use strict';

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numColors', 'Number of colors', 1, 32, 25),
    makeSlider('maxLength', 'Maximum length', 3, 19, 11, 2),
);

function drawSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    blendMode(ctrl.blendMode);
    noStroke();
    translate(width / 2, height / 2);

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    let colorIndex = int(random(palette.length));

    let magnify = int(width / ctrl.maxLength);
    let numPoints = Math.pow(ctrl.maxLength, 2);

    rectMode(CENTER);
    iterateSquareSpiral(numPoints, (x, y, n) => {
        let direction = random([-1, 1]);

        // wrap around
        colorIndex = (palette.length + colorIndex + direction) % palette.length;

        fill(palette[colorIndex]);
        rect(x * magnify, y * magnify, magnify, magnify);
    });
    noLoop();
}
