'use strict';

function setupControls() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 2, 16, 8),
            makeSelectBlendMode(['source-over', 'difference', 'hard-light']),
            makeSlider('alphaRange', 10, 30, [20, 25]),
        ),
        makeSlider('numGrids', 2, 10, 4),
        makeSlider('segmentDivisorRange', 2, 20, [3, 10]),
        makeSlider('strokeWeight', 1, 8, 1),
    );
}

function drawSketch() {
    ctx.save();

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = ctrl.strokeWeight;

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    for (let i = 0; i < ctrl.numGrids; i++) {
        let drawType = ['plain', 'diagonal'].randomElement();
        let maxDivisor = randomIntRange(...ctrl.segmentDivisorRange);
        let minDivisor = Math.round(maxDivisor * 1.5);
        drawGrid(width, minDivisor, maxDivisor, drawType, palette, randomIntRange(...ctrl.alphaRange) / 100);
    }
    ctx.restore();
}

function drawGrid(dim, minDivisor, maxDivisor, drawType, palette, alpha) {
    let vsegments = [];
    let minS = Math.round(dim / minDivisor),
        maxS = Math.round(dim / maxDivisor);

    // Note: the arguments to random() depend on the canvas width(), so when
    // you resize it you will get a different image
    for (let y = 0; y < dim - (minS + maxS) / 2; y += randomIntRange(minS, maxS)) {
        vsegments.push(y);
    }
    vsegments.push(dim);
    vsegments.pairwise((vcurrent, vnext) => {
        let hsegments = [];
        for (let x = 0; x < dim - (minS + maxS) / 2; x += randomIntRange(minS, maxS)) {
            hsegments.push(x);
        }
        hsegments.push(dim);
        hsegments.pairwise((hcurrent, hnext) => {
            if (drawType == 'plain') {
                let [r, g, b] = chroma(palette.randomElement()).rgb();
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
            } else if ((drawType == 'diagonal')) {
                let c1, c2;
                c1 = palette.randomElement();
                do {
                    c2 = palette.randomElement();
                } while (c1 == c2);
                let [r, g, b] = chroma(c1).rgb();
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

                ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                [r, g, b] = chroma(c2).rgb();
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

                if (random() < 0.5) {
                    triangle([ hcurrent, vcurrent ], [ hnext, vcurrent ], [ hnext, vnext ]);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    triangle([ hnext, vcurrent ], [ hnext, vnext ], [ hcurrent, vnext ]);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        });
    });
}
