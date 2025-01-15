'use strict';

// polygons at points of polygons at points of polygons etc.

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

let palette;

function setupForm() {
    makeForm(
        makeSlider('numSides', 3, 10, 5),
        makeSlider('diameter', 1, 100, 30),
        makeSlider('rotationStep', 0, 360, 180),
        makeSlider('maxDepth', 0, 4, 1),
    );
}

function drawSketch() {
    palette = colors.shuffle().slice(0, ctrl.maxDepth + 1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    drawPolygons(0, 0, ctrl.numSides, ctrl.diameter * width / 100,
        0, ctrl.rotationStep, ctrl.maxDepth);
    ctx.restore();
}

function drawPolygons(x, y, sides, diameter, rotation, rotationStep, maxDepth = 0, depth = 0) {
    let points = getPointsForPolygon(sides, diameter, rotation);
    points.forEach(p => {
        ctx.save();
        ctx.translate(...p);

        let c = chroma(palette[depth]).rgb();
        let alpha = (25 - 5 * depth) / 100;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;

        ctx.beginPath();
        points.forEach(p => ctx.lineTo(...p));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (depth < maxDepth) {
            drawPolygons(p.x, p.y, sides, diameter,
                rotation + rotationStep / sides, rotationStep, maxDepth, depth + 1);
        }

        ctx.restore();
    });
}
