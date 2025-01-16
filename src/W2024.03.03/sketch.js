'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTilesX', 10, 70, 50),
        makeSlider('numTilesY', 10, 70, 50),
        makeSlider('angleStep', 2, 32, 16),
        makeSlider('lineScale', 0.5, 1.5, 1, 0.1),
        makeFieldset('curves',
            makeSlider('numCurves', 2, 100, 30),
            makeSlider('curveScale', 0.5, 1, 0.6, 0.05),
        ),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    let path = randomPath(ctrl.numCurves);
    const lineLength = ctrl.lineScale * width / ctrl.numTilesX;

    let d = window.devicePixelRatio; // no idea why this is necessary
    gridCenters(ctrl.numTilesX, ctrl.numTilesY)
        .filter(p => !ctx.isPointInPath(path, p[0] * d, p[1] * d))
        .forEach(p => {
            // Draw a line at a random angle around the center of p.
            ctx.save();
            ctx.translate(...p);
            ctx.rotate(2 * Math.PI * randomIntUpTo(ctrl.angleStep) / ctrl.angleStep);
            line([-lineLength / 2, 0], [lineLength / 2, 0]);
            ctx.stroke();
            ctx.restore();
        });
}

function gridCenters(numX, numY) {
    let p = [];
    for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
            p.push([(x + 0.5) * width / numX, (y + 0.5) * height / numY]);
        }
    }
    return p;
}

function randomPath(n) {

    // this offset applies to the whole path
    let pathOffsetX = randomIntPlusMinus(width / 2);
    let pathOffsetY = randomIntPlusMinus(height / 2);

    let randomPoint = () => {
        return [
            randomIntUpTo(width * ctrl.curveScale) + pathOffsetX,
            randomIntUpTo(height * ctrl.curveScale) + pathOffsetY
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
