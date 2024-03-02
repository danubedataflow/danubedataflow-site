'use strict';

function setupForm() {
    makeForm(
        makeSlider('numCurves', 2, 100, 30),
    );
}

function drawSketch() {
    background('white');
    let offsetX = width / 2;
    let offsetY = height / 2;
    translate(offsetX, offsetY);
    let ctx = drawingContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = color(100);

    let path = randomPath(ctrl.numCurves);
    ctx.stroke(path);

    noStroke();
    for (let x = -offsetX; x < offsetX; x += 10) {
        for (let y = -offsetY; y < offsetY; y += 10) {
            // I have no idea why pixelDensity() and the offsets are necessary
            // here.
            const isPointInPath = ctx.isPointInPath(path, pixelDensity() * (x + offsetX), pixelDensity() * (y + offsetY));
            fill(isPointInPath ? 'blue' : 'red');
            circle(x, y, 3);
        }
    }
}

function randomPath(n) {
    let path = new Path2D();
    for (let i = 0; i < n; i++) {
        // each curve has two control points and an end point
        path.bezierCurveTo(...randomPoint(), ...randomPoint(), ...randomPoint());
    }
    path.closePath();
    return path;
}

function randomPoint() {
    return [
        randomIntPlusMinus(width / 3),
        randomIntPlusMinus(height / 3)
    ];
}
