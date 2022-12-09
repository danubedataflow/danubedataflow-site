'use strict';

// based on Jon Stanley's program "lines" for the Tektronix 4052
// https://www.electronixandmore.com/resources/teksystem/

const config = new Config()
    .maxIterations(-1);

makeForm(
    makeSlider('numIterations', 'Number of iterations', 100, 2000, 500),
    makeSlider('randomDelta', 'Random delta', 1, 20, 5),
);

let x1, y1, x2, y2, x1d, y1d, x2d, y2d;

function initSketch() {
    x1 = int(random(width / 2));
    y1 = int(random(height / 2));
    x2 = int(random(width / 2)) + width / 2;
    y2 = int(random(height / 2)) + height / 2;
    x1d = rnd(6);
    y1d = rnd(5);
    x2d = rnd(2);
    y2d = rnd(7);
    stroke("white");
    background("black");
}

function drawSketch() {
    if (currentIteration % ctrl.numIterations == 0) background("black");

    line(x1, y1, x2, y2);
    if (x1 > width) x1d = -rnd(2);
    if (y1 > height) y1d = -rnd(8);
    if (x2 < 0) x2d = rnd(6);
    if (y2 < 0) y2d = -rnd(5);
    if (x1 < 0) x1d = rnd(2);
    if (y1 < 0) y1d = rnd(3);
    if (x2 > width) x2d = rnd(8);
    if (y2 > height) y2d = rnd(2);

    x1 += x1d;
    y1 += y1d;
    x2 -= x2d;
    y2 -= y2d;
}

function rnd(mid) {
    return int(random(mid - ctrl.randomDelta, mid + ctrl.randomDelta + 1));
}
