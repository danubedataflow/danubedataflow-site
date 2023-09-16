'use strict';

// polygons at points of polygons at points of polygons etc.

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

let palette;

function setupForm() {
    makeForm(
        makeSlider('numSides', 'Anzahl der Seiten', 3, 10, 5),
        makeSlider('diameter', 'Durchmesser', 1, 100, 30),
        makeSlider('rotDelta', 'Rotations-Delta', 0, 360, 180),
        makeSlider('maxDepth', 'Maximale Tiefe', 0, 4, 1),
    );
}

function drawSketch() {
    palette = shuffle(colors).slice(0, ctrl.maxDepth + 1);
    strokeWeight(1);
    stroke('black');

    translate(width / 2, height / 2);
    background('white');

    drawPolygons(0, 0, ctrl.numSides, ctrl.diameter * width / 100,
        0, ctrl.rotDelta, ctrl.maxDepth);
}

function drawPolygons(x, y, sides, diameter, rotation, rotDelta, maxDepth = 0, depth = 0) {
    let points = getPointsForPolygon(sides, diameter, rotation);
    points.forEach(p => {
        push();
        translate(...p);

        let fillColor = color(palette[depth]);
        fillColor.setAlpha(25 - 5 * depth);
        fill(fillColor);

        beginShape();
        points.forEach(p => vertex(...p));
        endShape(CLOSE);

        if (depth < maxDepth) {
            drawPolygons(p.x, p.y, sides, diameter,
                rotation + rotDelta / sides, rotDelta, maxDepth, depth + 1);
        }

        pop();
    });
}
