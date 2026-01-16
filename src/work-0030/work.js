'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntPlusMinus
} from '/js/math.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 70, 50),
        makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
        makeSlider('lineScale', 'Line scale: {0}', 0.5, 1.5, 1, 0.1),
        makeFieldset('Curves',
            makeSlider('numCurves', 'Number of curves: {0}', 2, 100, 30),
            makeSlider('curveScale', 'Curve scale: {0}', 0.5, 1, 0.6, 0.05),
        ),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    let path = randomPath(ctrl.numCurves, ctrl.curveScale, width, height);
    const lineLength = ctrl.lineScale * width / ctrl.numTiles;

    let d = window.devicePixelRatio; // no idea why this is necessary
    gridCenters(ctrl.numTiles, width, height)
        .filter(p => !ctx.isPointInPath(path, p[0] * d, p[1] * d))
        .forEach(p => {
            // Draw a line at a random angle around the center of p.
            ctx.save();
            ctx.translate(...p);
            ctx.rotate(2 * Math.PI * randomIntUpTo(ctrl.angleStep) / ctrl.angleStep);

            ctx.beginPath();
            ctx.moveTo(-lineLength / 2, 0);
            ctx.lineTo(lineLength / 2, 0);
            ctx.stroke();

            ctx.restore();
        });
}

function gridCenters(num, width, height) {
    let p = [];
    for (let y = 0; y < num; y++) {
        for (let x = 0; x < num; x++) {
            p.push([(x + 0.5) * width / num, (y + 0.5) * height / num]);
        }
    }
    return p;
}

function randomPath(n, curveScale, width, height) {

    // this offset applies to the whole path
    let pathOffsetX = randomIntPlusMinus(width / 2);
    let pathOffsetY = randomIntPlusMinus(height / 2);

    let randomPoint = () => {
        return [
            randomIntUpTo(width * curveScale) + pathOffsetX,
            randomIntUpTo(height * curveScale) + pathOffsetY
        ]
    };

    /*
     * Create a path of possibly overlapping bezier curves. Each curve extends
     * the current path and has two control points and an end point. Because of
     * the overlaps and isPointInPath()'s algorithms, this creates the effect of
     * islands within the greater path.
     */

    let path = new Path2D();
    for (let i = 0; i < n; i++) {
        path.bezierCurveTo(...randomPoint(), ...randomPoint(), ...randomPoint());
    }
    path.closePath();
    return path;
}

let description = `Inspired by Vera Molnár.`;

run({
    createdDate: '2024.03.03',
    description,
    setupControls,
    drawWork
});
