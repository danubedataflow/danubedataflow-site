'use strict';
import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
// Shows 'evenodd' filling of CanvasRenderingContext2D.fill()
function setupControls() {
    makeForm(
        makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    let curves = [];
    // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
    for (let i = 0; i < ctrl.numCurves; i++) {
        curves.push([
            [randomIntUpTo(width), randomIntUpTo(height)],
            [randomIntUpTo(width), randomIntUpTo(height)],
            [randomIntUpTo(width), randomIntUpTo(height)],
        ]);
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
let description = `No description yet.`;
run({
    createdDate: '2022-10-22',
    description,
    setupControls,
    drawWork
});