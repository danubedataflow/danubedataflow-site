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
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 20, 35, [25, 30]),
        ),
        makeSlider('numGrids', 'Number of grids: {0}', 2, 10, 4),
        makeSlider('segmentSizeRange', 'Segment size range: {0}% to {1}% of the width', 10, 30, [20, 25]),
        makeSlider('lineWidth', 'Stroke weight: {0}', 1, 4, 1),
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
    ctx.strokeStyle = 'black';
    ctx.lineWidth = ctrl.lineWidth;
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);
    for (let i = 0; i < ctrl.numGrids; i++) {
        drawGrid(ctx, ctrl, width, palette, randomIntRange(...ctrl.alphaRange) / 100);
    }
}

function drawGrid(ctx, ctrl, width, palette, alpha) {
    let drawType = randomElement(['plain', 'diagonal']);
    let vsegments = [];
    let avgSize = width * randomIntRange(...ctrl.segmentSizeRange) / 100;
    let [minSize, maxSize] = [avgSize * 0.75, avgSize * 1.25];
    for (let y = 0; y < width; y += randomIntRange(minSize, maxSize)) {
        vsegments.push(y);
    }
    vsegments.push(width);
    pairwise(vsegments, (vcurrent, vnext) => {
        let hsegments = [];
        for (let x = 0; x < width - (minSize + maxSize) / 2; x += randomIntRange(minSize, maxSize)) {
            hsegments.push(x);
        }
        hsegments.push(width);
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
let description = `Multiple irregular grids layered on top of each other. Each tile is colored and can randomly have a colored triangle layered on top`;
run({
    createdDate: '2022-12-13',
    description,
    setupControls,
    drawWork
});