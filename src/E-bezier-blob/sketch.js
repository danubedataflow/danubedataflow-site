'use strict';

function setupForm() {
    makeForm(
        makeSlider('numCurves', 2, 100, 30),
    );
}

function drawSketch() {
    background('white');
    let offsetX = width / 2;
    let offsetY = height / 2;
    translate(offsetX, offsetY);
    let path = randomPath(ctrl.numCurves);

    stroke('black');

    let numTilesX = 50;
    let numTilesY = 50;
    let tileWidth = width / numTilesX;
    let tileHeight = height / numTilesY;
    for (let y = 1; y <= numTilesY; y++) {
        for (let x = 1; x <= numTilesX; x++) {
            let centerX = (x - 1) * tileWidth + tileWidth / 2 - offsetX;
            let centerY = (y - 1) * tileHeight + tileHeight / 2 - offsetY;
            // I have no idea why pixelDensity() and the offsets are necessary
            // here.
            const isPointInPath = drawingContext.isPointInPath(path, pixelDensity() * (centerX + offsetX), pixelDensity() * (centerY + offsetY));
            if (!isPointInPath) {

                /*
                 * Draw a line at a random angle.
                 *
                 * lineX and lineY are the coordinates of one endpoint of this
                 * line on an imaginary circle around (centerX, centerY) that
                 * spans the whole/ tile, multiplied by a random length factor.
                 */

                let angle = random(360);
                let lineLengthFactor = random(1) + 1;
                let lineX = lineLengthFactor * (sin(angle) * tileWidth / 2);
                let lineY = lineLengthFactor * (cos(angle) * tileWidth / 2);

                // draw the line between opposing endpoints on the circle
                line(centerX + lineX, centerY + lineY, centerX - lineX, centerY - lineY);
            }
        }
    }
}

function randomPath(n) {
    // pathOffsetX and pathOffsetY move the whole path
    let pathOffsetX = randomIntPlusMinus(width / 3);
    let pathOffsetY = randomIntPlusMinus(height / 3);
    let randomPoint = () => {
        return [
            randomIntPlusMinus(width / 3) + pathOffsetX,
            randomIntPlusMinus(height / 3) + pathOffsetY
        ]
    };

    let path = new Path2D();
    for (let i = 0; i < n; i++) {
        // each curve has two control points and an end point
        path.bezierCurveTo(...randomPoint(), ...randomPoint(), ...randomPoint());
    }
    path.closePath();
    return path;
}
