'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSelectBlendMode([BLEND, DIFFERENCE, DODGE, EXCLUSION, HARD_LIGHT, LIGHTEST]),
        makeSlider('numGrids', 'Number of grids', 1, 10, 4),
        makeSlider('divisorRange', 'Segment divisor range', 2, 20, [3, 10]),
        makeSlider('strokeWeight', 'Stroke weight', 0, 8, 1),
        makeSlider('alphaRange', 'Alpha range', 30, 90, [60, 70]),
    );
    stroke('black');
    rectMode(CORNERS);
    noLoop();
}

function draw() {
    readControls();
    let numGrids = 5;
    blendMode(ctrl.blendMode);
    strokeWeight(ctrl.strokeWeight);
    for (let i = 0; i < numGrids; i++) {
        let drawType = random(['plain', 'diagonal']);
        let maxDivisor = randomIntRange(...ctrl.divisorRange);
        let minDivisor = int(maxDivisor * 1.5);
        drawGrid(width, minDivisor, maxDivisor, drawType, random(wes_palettes).colors, randomIntRange(...ctrl.alphaRange));
    }
}

function drawGrid(dim, minDivisor, maxDivisor, drawType, palette, alpha) {
    let vsegments = [];
    let minS = int(dim / minDivisor),
        maxS = int(dim / maxDivisor);
    for (let y = 0; y < dim - (minS + maxS) / 2; y += int(random(minS, maxS))) {
        vsegments.push(y);
    }
    vsegments.push(dim);
    vsegments.pairwise((vcurrent, vnext) => {
        let hsegments = [];
        for (let x = 0; x < dim - (minS + maxS) / 2; x += int(random(minS, maxS))) {
            hsegments.push(x);
        }
        hsegments.push(dim);
        hsegments.pairwise((hcurrent, hnext) => {
            if (drawType == 'plain') {
                setFill(random(palette), alpha);
                rect(hcurrent, vcurrent, hnext, vnext);
            } else if ((drawType = 'diagonal')) {
                let c1, c2;
                c1 = random(palette);
                do {
                    c2 = random(palette);
                } while (c1 == c2);
                setFill(c1, alpha);
                rect(hcurrent, vcurrent, hnext, vnext);
                setFill(c2, alpha);

                if (random() < 0.5) {
                    triangle(hcurrent, vcurrent, hnext, vcurrent, hnext, vnext);
                } else {
                    triangle(hnext, vcurrent, hnext, vnext, hcurrent, vnext);
                }
            }
        });
    });
}

function setFill(hex, alpha) {
    let c = color(hex);
    c.setAlpha(alpha);
    fill(c);
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
