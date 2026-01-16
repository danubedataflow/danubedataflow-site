'use strict';

import {
    run,
    makeForm,
    makeSlider,
    makeFieldset
} from '/js/ui.js';
import {
    getPointsForPolygon
} from '/js/math.js';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 50, 25),
        makeFieldset('Polygon',
            makeSlider('numSides', 'Number of sides: {0}', 3, 8, 6),
            makeSlider('polygonScaleFactor', 'Scale factor: {0}', 1, 10, 3, 0.1),
        ),
        makeFieldset('Noise',
            makeSlider('noiseOffsetX', 'Horizontal noise offset: {0}', 0, 30, 4),
            makeSlider('noiseOffsetY', 'Vertical noise offset: {0}', 1, 100, 15),
            makeSlider('noiseDivisor', 'Noise divisor: {0}', 1, 30, 9),
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

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'white';

    let tileDim = Math.floor(width / ctrl.numTiles);
    for (let x = 0; x < ctrl.numTiles; x++) {
        for (let y = 0; y < ctrl.numTiles; y++) {
            ctx.save();
            ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);

            let n = noise.simplex2(
                ctrl.noiseOffsetX + x / ctrl.noiseDivisor,
                ctrl.noiseOffsetY + y / ctrl.noiseDivisor
            );

            let diameter = Math.floor(n * ctrl.polygonScaleFactor * tileDim);

            ctx.beginPath();
            let points = getPointsForPolygon(ctrl.numSides, diameter, 0);
            points.forEach(p => ctx.lineTo(...p));
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }
    }
}

run({
    createdDate: '2022.07.27',
    setupControls,
    drawWork
});
