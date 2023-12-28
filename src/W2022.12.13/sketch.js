'use strict';

function setupForm() {
    makeForm(
        makeFieldset('Farben',
            makeSelectColorMap(),
            makeSlider('numColors', 'Anzahl der Farben', 2, 16, 8),
            makeSelectBlendMode([BLEND, DIFFERENCE, HARD_LIGHT]),
            makeSlider('alpha', 'Transparenz (Alpha)', 30, 90, [60, 70]),
        ),
        makeSlider('numGrids', 'Anzahl der Gitter', 2, 10, 4),
        makeSlider('divisorRange', 'Segment-Teilerbereich', 2, 20, [3, 10]),
        makeSlider('strokeWeight', 'XXX', 1, 8, 1),
    );
}

function drawSketch() {
    stroke('black');
    blendMode(BLEND); // so background() actually clears the canvas
    background('white');
    blendMode(ctrl.blendMode);
    strokeWeight(ctrl.strokeWeight);
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    for (let i = 0; i < ctrl.numGrids; i++) {
        let drawType = random(['plain', 'diagonal']);
        let maxDivisor = randomIntRange(...ctrl.divisorRange);
        let minDivisor = int(maxDivisor * 1.5);
        drawGrid(width, minDivisor, maxDivisor, drawType, palette, randomIntRange(...ctrl.alpha));
    }
}

function drawGrid(dim, minDivisor, maxDivisor, drawType, palette, alpha) {
    let vsegments = [];
    let minS = int(dim / minDivisor),
        maxS = int(dim / maxDivisor);
    // Note: the arguments to random() depend on the canvas width(), so when
    // you resize it you will get a different image
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
