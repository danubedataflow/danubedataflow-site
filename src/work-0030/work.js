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
let c;

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

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'black';
    c.ctx.lineWidth = 1;
    let path = randomPath(c.ctrl.numCurves, c.ctrl.curveScale);
    const lineLength = c.ctrl.lineScale * c.width / c.ctrl.numTiles;
    let d = window.devicePixelRatio; // no idea why this is necessary
    gridCenters(c.ctrl.numTiles)
        .filter(p => !c.ctx.isPointInPath(path, p[0] * d, p[1] * d))
        .forEach(p => {
            // Draw a line at a random angle around the center of p.
            c.ctx.save();
            c.ctx.translate(...p);
            c.ctx.rotate(2 * Math.PI * randomIntUpTo(c.ctrl.angleStep) / c.ctrl.angleStep);
            c.ctx.beginPath();
            c.ctx.moveTo(-lineLength / 2, 0);
            c.ctx.lineTo(lineLength / 2, 0);
            c.ctx.stroke();
            c.ctx.restore();
        });
}

function gridCenters(num) {
    let p = [];
    for (let y = 0; y < num; y++) {
        for (let x = 0; x < num; x++) {
            p.push([(x + 0.5) * c.width / num, (y + 0.5) * c.height / num]);
        }
    }
    return p;
}

function randomPath(n, curveScale) {
    // this offset applies to the whole path
    let pathOffsetX = randomIntPlusMinus(c.width / 2);
    let pathOffsetY = randomIntPlusMinus(c.height / 2);
    let randomPoint = () => {
        return [
            randomIntUpTo(c.width * curveScale) + pathOffsetX,
            randomIntUpTo(c.height * curveScale) + pathOffsetY
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
let description = `Grid of lines with random rotation, except for those lines which would lie in a random path. Homage to "Interruptions"  by Vera Molnár, 1968-1969.`;
run({
    createdDate: '2024-03-03',
    description,
    setupControls,
    drawWork
});
