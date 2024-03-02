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

    const tileWidth = width / ctrl.numTilesX;
    const tileHeight = height / ctrl.numTilesY;
    for (let y = 1; y <= ctrl.numTilesY; y++) {
        for (let x = 1; x <= ctrl.numTilesX; x++) {
            const centerX = (x - 1) * tileWidth + tileWidth / 2;
            const centerY = (y - 1) * tileHeight + tileHeight / 2;

            // I have no idea why pixelDensity() and the offsets are necessary
            // here.
            const isPointInPath = drawingContext.isPointInPath(
                path,
                pixelDensity() * centerX,
                pixelDensity() * centerY
            );

            if (!isPointInPath) {

                /*
                 * Draw a line at a random angle.
                 *
                 * lineX and lineY are the coordinates of one endpoint of this
                 * line on an imaginary circle around (centerX, centerY) that
                 * spans the whole tile, multiplied by a random length factor.
                 */

                const angle = (360 / ctrl.angleStep) * int(random(ctrl.angleStep));
                // FIXME ctrl.lineScale; add to lang.json
                const lineX = ctrl.scale * (sin(angle) * tileWidth / 2);
                const lineY = ctrl.scale * (cos(angle) * tileHeight / 2);

                // draw the line between opposing endpoints on the circle
                line(centerX + lineX, centerY + lineY, centerX - lineX, centerY - lineY);
            }
        }
    }
}

function randomPath(n) {

    // pathOffsetX and pathOffsetY move the whole path
    let pathOffsetX = int(random(width / 2));
    let pathOffsetY = int(random(height / 2));

    let blobScale = 0.67; // FIXME ctrl.blobScale; add to lang.json

    let randomPoint = () => {
        return [
            int(random(width * blobScale)) + pathOffsetX,
            int(random(height * blobScale)) + pathOffsetY
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
