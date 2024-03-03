'use strict';

onload = (e) => {
    setup();
    draw();
};

function setupForm() {
    makeForm(
        makeSlider('numTilesX', 10, 70, 50),
        makeSlider('numTilesY', 10, 70, 50),
        makeSlider('angleStep', 2, 32, 16),
        makeSlider('lineScale', 1, 2, 1.5, 0.1),
        makeFieldset('curves',
            makeSlider('numCurves', 2, 100, 30),
            makeSlider('curveScale', 0.5, 1, 0.6, 0.05),
        ),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';

    let path = randomPath(ctrl.numCurves);

    gridCenters(ctrl.numTilesX, ctrl.numTilesY)
        .filter(p => !ctx.isPointInPath(path, p[0], p[1]))
        .forEach(p => {
            /*
             * Draw a line at a random angle.
             *
             * lineX and lineY are the coordinates of one endpoint of this line
             * on an imaginary circle around (centerX, centerY) that spans the
             * whole tile, multiplied by a random length factor.
             */

            let angle = (360 / ctrl.angleStep) * Math.floor(random() * ctrl.angleStep);
            angle = angle * Math.PI / 180;  // degrees to radians
            const lineX = ctrl.lineScale * (Math.sin(angle) * canvas.width / ctrl.numTilesX / 2);
            const lineY = ctrl.lineScale * (Math.cos(angle) * canvas.height / ctrl.numTilesY / 2);

            // draw the line between opposing endpoints on the circle
            ctx.beginPath();
            ctx.moveTo(p[0] + lineX, p[1] + lineY);
            ctx.lineTo(p[0] - lineX, p[1] - lineY);
            ctx.stroke();
        });
}

function gridCenters(numX, numY) {
    let p = [];
    for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
            p.push([(x + 0.5) * canvas.width / numX, (y + 0.5) * canvas.height / numY]);
        }
    }
    return p;
}

function randomPath(n) {

    // this offset applies to the whole path
    let pathOffsetX = randomIntPlusMinus(canvas.width / 2);
    let pathOffsetY = randomIntPlusMinus(canvas.height / 2);

    let randomPoint = () => {
        return [
            Math.floor(random() * canvas.width * ctrl.curveScale) + pathOffsetX,
            Math.floor(random() * canvas.height * ctrl.curveScale) + pathOffsetY
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
