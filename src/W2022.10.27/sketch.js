'use strict';

// based on Jon Stanley's program "lines" for the Tektronix 4052
// https://www.electronixandmore.com/resources/teksystem/

function setupForm() {
    makeForm(
        makeSlider('numLines', 1, 1500, 500),
        makeSlider('randomPointOffset', 1, 20, 5),
    );
}

function drawSketch() {
    let x1 = int(random(width / 2));
    let y1 = int(random(height / 2));
    let x2 = int(random(width / 2)) + width / 2;
    let y2 = int(random(height / 2)) + height / 2;
    let x1d = rnd(6);
    let y1d = rnd(5);
    let x2d = rnd(2);
    let y2d = rnd(7);
    stroke("white");
    background("black");

    for (let i = 1; i <= ctrl.numLines; i++) {
        line(x1, y1, x2, y2);
        if (x1 > width) x1d = -rnd(2);
        if (y1 > height) y1d = -rnd(8);
        if (x2 < 0) x2d = rnd(6);
        if (y2 < 0) y2d = rnd(5);
        if (x1 < 0) x1d = rnd(2);
        if (y1 < 0) y1d = rnd(3);
        if (x2 > width) x2d = rnd(8);
        if (y2 > height) y2d = rnd(2);

        x1 += x1d;
        y1 += y1d;
        x2 -= x2d;
        y2 -= y2d;
    }
}

function rnd(mid) {
    return int(random(mid - ctrl.randomPointOffset, mid + ctrl.randomPointOffset + 1));
}
