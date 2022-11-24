'use strict';

const config = new Config()
    .title('S2022-016')
    .maxIterations(1);

/* Shows 'evenodd' filling of CanvasRenderingContext2D.fill()
 * See https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
 * Also see https://openprocessing.org/sketch/1626688 ("0576_2" by kusakari)
 */

makeForm(
    makeSlider('numCurves', 'Number of curves', 2, 100, 30),
);

let curves;

function initSketch() {
    curves = [];

    // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
    for (let i = 0; i < ctrl.numCurves; i++) {
        curves.push([randomPoint(), randomPoint(), randomPoint()]);
    }

    drawingContext.fillStyle = color(0);
    drawingContext.lineWidth = 1;
    drawingContext.strokeStyle = color(100);
}

function drawSketch() {
    background("white");

    let path = new Path2D();
    curves.forEach((c) => {
        path.bezierCurveTo(...c[0], ...c[1], ...c[2]);
    });
    path.closePath();
    drawingContext.fill(path, "evenodd");
}

function randomPoint() {
    return [int(random(width)), int(random(width))];
}