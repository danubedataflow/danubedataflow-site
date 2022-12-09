'use strict';

/* Shows 'evenodd' filling of CanvasRenderingContext2D.fill()
 * See https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
 * Also see https://openprocessing.org/sketch/1626688 ("0576_2" by kusakari)
 */

makeForm(
    makeSlider('numCurves', 'Number of curves', 2, 100, 30),
);

function setup() {
    initCanvas();
}

function draw() {
    readControls();

    let curves = [];

    // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
    for (let i = 0; i < ctrl.numCurves; i++) {
        curves.push([randomPoint(), randomPoint(), randomPoint()]);
    }

    drawingContext.fillStyle = color(0);
    drawingContext.lineWidth = 1;
    drawingContext.strokeStyle = color(100);

    background("white");

    let path = new Path2D();
    curves.forEach((c) => {
        path.bezierCurveTo(...c[0], ...c[1], ...c[2]);
    });
    path.closePath();
    drawingContext.fill(path, "evenodd");
    noLoop();
}

function randomPoint() {
    return [int(random(width)), int(random(width))];
}
