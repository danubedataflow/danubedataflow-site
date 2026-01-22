import {
    run,
    makeForm,
    makeSlider,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode,
    clearCanvas
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
let c;

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 16, 8),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 20, 35, [25, 30]),
        ),
        makeSlider('numGrids', 'Number of grids: {0}', 2, 10, 4),
        makeSlider('segmentSizeRange', 'Segment size range: {0}% to {1}% of the width', 10, 30, [20, 25]),
        makeSlider('lineWidth', 'Line c.width: {0}', 1, 4, 1),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas('black');
    c.ctx.strokeStyle = 'black';
    c.ctx.lineWidth = c.ctrl.lineWidth;
    let palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);
    for (let i = 0; i < c.ctrl.numGrids; i++) {
        drawGrid(c.width, palette, randomIntRange(...c.ctrl.alphaRange) / 100);
    }
}

function drawGrid(width, palette, alpha) {
    let drawType = randomElement(['plain', 'diagonal']);
    let vsegments = [];
    let avgSize = width * randomIntRange(...c.ctrl.segmentSizeRange) / 100;
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
                c.ctx.fillStyle = colorRGBA(...chroma(randomElement(palette)).rgb(), alpha);
                c.ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                c.ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
            } else if ((drawType == 'diagonal')) {
                let c1, c2;
                c1 = randomElement(palette);
                do {
                    c2 = randomElement(palette);
                } while (c1 == c2);
                c.ctx.fillStyle = colorRGBA(...chroma(c1).rgb(), alpha);
                c.ctx.fillRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                c.ctx.strokeRect(hcurrent, vcurrent, hnext - hcurrent, vnext - vcurrent);
                c.ctx.fillStyle = colorRGBA(...chroma(c2).rgb(), alpha);
                if (random() < 0.5) {
                    // draw a triangle
                    c.ctx.beginPath();
                    c.ctx.moveTo(hcurrent, vcurrent);
                    c.ctx.lineTo(hnext, vcurrent);
                    c.ctx.lineTo(hnext, vnext);
                    c.ctx.closePath();
                    c.ctx.fill();
                    c.ctx.stroke();
                } else {
                    // draw a triangle
                    c.ctx.beginPath();
                    c.ctx.moveTo(hnext, vcurrent);
                    c.ctx.lineTo(hnext, vnext);
                    c.ctx.lineTo(hcurrent, vnext);
                    c.ctx.closePath();
                    c.ctx.fill();
                    c.ctx.stroke();
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
