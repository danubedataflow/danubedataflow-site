'use strict';

import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntRange,
    getPointsForPolygon
} from '/js/math.js';

// polygons at points of polygons at points of polygons etc.

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
        makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 7, [4, 6]),
        makeSlider('diameterRange', 'Diameter: {0} to {1}', 1, 100, [30, 50]),
        makeSlider('rotationStepRange', 'Rotation step: {0} to {1}', 0, 360, [150, 210]),
        makeSlider('maxDepthRange', 'Maximum depth: {0} to {1}', 1, 2, [1, 2]),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    let tileDim = Math.floor(width / ctrl.numTiles);
    for (let x = 0; x < ctrl.numTiles; x++) {
        for (let y = 0; y < ctrl.numTiles; y++) {
            ctx.save();
            ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);

            let numSides = randomIntRange(...ctrl.numSidesRange);
            let diameter = randomIntRange(...ctrl.diameterRange);
            let rotationStep = randomIntRange(...ctrl.rotationStepRange);
            let maxDepth = randomIntRange(...ctrl.maxDepthRange);
            drawPolygons(ctx, 0, 0, numSides, diameter * tileDim / 100,
                0, rotationStep, maxDepth);
            ctx.restore();
        }
    }
}

function drawPolygons(ctx, x, y, sides, diameter, rotation, rotationStep, maxDepth = 0, depth = 0) {
    let points = getPointsForPolygon(sides, diameter, rotation);
    points.forEach(p => {
        ctx.save();
        ctx.translate(...p);

        ctx.beginPath();
        points.forEach(p => ctx.lineTo(...p));
        ctx.closePath();
        ctx.stroke();

        if (depth < maxDepth) {
            drawPolygons(ctx, p.x, p.y, sides, diameter,
                rotation + rotationStep / sides, rotationStep, maxDepth, depth + 1);
        }

        ctx.restore();
    });
}

run({
    createdDate: '2022.10.01',
    setupControls,
    drawWork
});
