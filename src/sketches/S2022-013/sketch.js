'use strict';

// polygons at points of polygons at points of polygons etc.

makeForm(
    makeSlider('sides', 'Number of sides', 3, 10, 5),
    makeSlider('diameter', 'Diameter', 1, 100, 30),
    makeSlider('rotDelta', 'Rotation delta', 0, 360, 180),
    makeSlider('maxDepth', 'Maximum depth', 0, 4, 1),
);

const colors = ['#000000', '#ff0000', '#00ff00',
    '#0000ff', '#ffff00', '#ff00ff'
];

let palette;

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();
    palette = colors.shuffle().slice(0, ctrl.maxDepth + 1);
    strokeWeight(1);
    stroke('black');

    translate(width / 2, height / 2);
    background('white');

    drawPolygons(0, 0, ctrl.sides, ctrl.diameter * width / 100,
        0, ctrl.rotDelta, ctrl.maxDepth);
    noLoop();
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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
