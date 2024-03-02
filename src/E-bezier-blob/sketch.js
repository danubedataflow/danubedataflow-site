'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTilesX', 10, 70, 50),
        makeSlider('numTilesY', 10, 70, 50),
        makeSlider('numCurves', 2, 100, 30),
        makeSlider('angleStep', 2, 32, 16),
        makeSlider('scale', 1, 2, 1.5, 0.1),
    );
}

function drawSketch() {
    background('white');
    let path = randomPath(ctrl.numCurves);

    stroke('black');

    let d = pixelDensity(); // I have no idea why this is necessary.
    gridCenters(ctrl.numTilesX, ctrl.numTilesY)
        .filter(p => !drawingContext.isPointInPath(path, d * p[0], d * p[1]))
        .forEach(p => {
            /*
             * Draw a line at a random angle.
             *
             * lineX and lineY are the coordinates of one endpoint of this line
             * on an imaginary circle around (centerX, centerY) that spans the
             * whole tile, multiplied by a random length factor.
             */

            const angle = (360 / ctrl.angleStep) * int(random(ctrl.angleStep));
            // FIXME ctrl.lineScale; add to lang.json
            const lineX = ctrl.scale * (sin(angle) * width / ctrl.numTilesX / 2);
            const lineY = ctrl.scale * (cos(angle) * height / ctrl.numTilesY / 2);

            // draw the line between opposing endpoints on the circle
            line(p[0] + lineX, p[1] + lineY, p[0] - lineX, p[1] - lineY);
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

    let curveScale = 0.67; // FIXME ctrl.curveScale; add to lang.json

    let randomPoint = () => {
        return [
            int(random(width * curveScale)) + pathOffsetX,
            int(random(height * curveScale)) + pathOffsetY
        ]
    };

    /*
     * Create a path of possibly overlapping bezier curves. Each curve extends
     * the current path and has two control points and an end point. Because of
     * the overlaps and isPointInPath()'s algoithms, this creates the effect of
     * islands within the greater path.
     */

    let path = new Path2D();
    for (let i = 0; i < n; i++) {
        path.bezierCurveTo(...randomPoint(), ...randomPoint(), ...randomPoint());
    }
    path.closePath();
    return path;
}
