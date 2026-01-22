import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo
} from '/js/math.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
    );
}

function drawWork(config) {
    c = config;
    let curves = [];
    // each curve has two control points and an end point; see Path2D.bezierCurveTo() docs.
    for (let i = 0; i < c.ctrl.numCurves; i++) {
        curves.push([
            [randomIntUpTo(c.width), randomIntUpTo(c.height)],
            [randomIntUpTo(c.width), randomIntUpTo(c.height)],
            [randomIntUpTo(c.width), randomIntUpTo(c.height)],
        ]);
    }
    clearCanvas();
    c.ctx.fillStyle = '#000000';
    c.ctx.lineWidth = 1;
    c.ctx.strokeStyle = '#707070';
    let path = new Path2D();
    curves.forEach((c) => {
        path.bezierCurveTo(...c[0], ...c[1], ...c[2]);
    });
    path.closePath();
    c.ctx.fill(path, "evenodd");
}
let description = `A series of bezier curves with 'evenodd' filling.`;
run({
    createdDate: '2022-10-22',
    description,
    setupControls,
    drawWork
});
