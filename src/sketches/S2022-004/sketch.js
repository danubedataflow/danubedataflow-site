'use strict';

const config = new Config()
    .maxIterations(-1);

let p;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
);

function initSketch() {
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    noStroke();
    p = [];
}

function drawSketch() {
    blendMode(ctrl.blendMode);
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
