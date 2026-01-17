'use strict';
import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode
} from '/js/ui.js';
import {
    random,
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
import {
    pairwise,
    randomElement
} from '/js/array.js';

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 16, 8),
            makeSelectBlendMode(['source-over', 'difference', 'hard-light']),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 10, 30, [20, 25]),
        ),
        makeSlider('numGrids', 'Number of grids: {0}', 2, 10, 4),
        makeSlider('segmentDivisorRange', 'Segment divisor range: {0} to {1}', 2, 20, [3, 10]),
        makeSlider('lineWidth', 'Stroke weight: {0}', 1, 8, 1),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = ctrl.blendMode;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = ctrl.lineWidth;
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    for (let i = 0; i < ctrl.numGrids; i++) {
        let drawType = randomElement(['plain', 'diagonal']);
        let maxDivisor = randomIntRange(...ctrl.segmentDivisorRange);
        let minDivisor = Math.round(maxDivisor * 1.5);
        drawGrid(ctx, width, minDivisor, maxDivisor, drawType, palette, randomIntRange(...ctrl.alphaRange) / 100);
    }
}

function drawGrid(ctx, dim, minDivisor, maxDivisor, drawType, palette, alpha) {
    let vsegments = [];
    let minS = Math.round(dim / minDivisor),
        maxS = Math.round(dim / maxDivisor);
    // Note: the arguments to random() depend on the canvas width(), so when
    // you resize it you will get a different image
    for (let y = 0; y < dim - (minS + maxS) / 2; y += randomIntRange(minS, maxS)) {
        vsegments.push(y);
    }
    vsegments.push(dim);
    pairwise(vsegments, (vcurrent, vnext) => {
        let hsegments = [];
        for (let x = 0; x < dim - (minS + maxS) / 2; x += randomIntRange(minS, maxS)) {
            hsegments.push(x);
        }
        hsegments.push(dim);
        pairwise(hsegments, (hcurrent, hnext) => {
            if (drawType == 'plain') {
                ctx.fillStyle = colorRGBA(...chroma(randomElement(palette)).rgb(), alpha);
                ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
            } else if ((drawType == 'diagonal')) {
                let c1, c2;
                c1 = randomElement(palette);
                do {
                    c2 = randomElement(palette);
                } while (c1 == c2);
                ctx.fillStyle = colorRGBA(...chroma(c1).rgb(), alpha);
                ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                ctx.fillStyle = colorRGBA(...chroma(c2).rgb(), alpha);
                if (random() < 0.5) {
                    // draw a triangle
                    ctx.beginPath();
                    ctx.moveTo(hcurrent, vcurrent);
                    ctx.lineTo(hnext, vcurrent);
                    ctx.lineTo(hnext, vnext);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else {
                    // draw a triangle
                    ctx.beginPath();
                    ctx.moveTo(hnext, vcurrent);
                    ctx.lineTo(hnext, vnext);
                    ctx.lineTo(hcurrent, vnext);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        });
    });
}
let description = `Note: The random values in this work depend on the canvas size, so even with the same seed, different canvas sizes will generate different images.`;
run({
    createdDate: '2022-12-13',
    description,
    setupControls,
    drawWork
});