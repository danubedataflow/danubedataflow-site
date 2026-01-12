'use strict';

/* Shows 'evenodd' filling of CanvasRenderingContext2D.fill()
 * See https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
 * Also see https://openprocessing.org/work/1626688 ("0576_2" by kusakari)
 */

function setupControls() {
    makeForm(
        makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
    );
}

function drawWork() {
    let curves = [];

    // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
    for (let i = 0; i < ctrl.numCurves; i++) {
        curves.push([randomPoint(), randomPoint(), randomPoint()]);
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#707070';

    let path = new Path2D();
    curves.forEach((c) => {
        path.bezierCurveTo(...c[0], ...c[1], ...c[2]);
    });
    path.closePath();
    ctx.fill(path, "evenodd");
}

function randomPoint() {
    return [ randomIntUpTo(width), randomIntUpTo(height) ];
}
