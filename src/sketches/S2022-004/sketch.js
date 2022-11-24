'use strict';

const config = new Config()
    .title('S2022-004');

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
    p.push({
        x: random(width),
        y: random(height)
    });
    if (p.length == 3) {
        let colorScale = chroma.scale(ctrl.colorMap);
        let c = color(colorScale(random()).toString());
        c.setAlpha(random(128));
        fill(c);
        triangle(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);
        p.shift();
    }
}
