'use strict';

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numTriangles', 'Number of triangles', 1, 500, 100),
);

function setup() {
    initCanvas();
}

function draw() {
    readControls();
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    noStroke();
    blendMode(ctrl.blendMode);
    let p = [];
    // + 2 because the first triangle is only drawn on the third iteration
    for (let i = 1; i <= ctrl.numTriangles + 2; i++) {
        p.push([ random(width), random(height) ]);
        if (p.length == 3) {
            let colorScale = chroma.scale(ctrl.colorMap);
            let c = color(colorScale(random()).toString());
            c.setAlpha(random(128));
            fill(c);
            triangle(...p[0], ...p[1], ...p[2]);
            p.shift();
        }
    }
    noLoop();
}
