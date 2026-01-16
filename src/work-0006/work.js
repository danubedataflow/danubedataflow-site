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
    randomIntUpTo,
    randomIntRange
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
import {
    randomElement
} from '/js/array.js';

let palette;

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'difference', 'hard-light', 'overlay']),
            makeSlider('numColors', 'Number of colors: {0}', 1, 32, 16),
            makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 0, 100, [20, 80]),
        ),
        makeSlider('numSquares', 'Number of squares: {0}', 20, 1000, 100, 20),
        makeSlider('squareLengthRange', 'Side lengths are {0}% to {1}% of the canvas', 1, 100, [5, 30]),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;

    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';

    // random color from the palette
    ctx.fillStyle = randomElement(palette);
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    for (let i = 0; i < ctrl.numSquares; i++) {
        let c = randomElement(palette);

        // turn RGB hex string into [R, G, B]
        c = chroma(c).rgb();

        // map [0,100]% to [0, 1]
        let alpha = randomIntRange(...ctrl.alphaRange) / 100;

        ctx.fillStyle = colorRGBA(...c, alpha);

        let [minLength, maxLength] = ctrl.squareLengthRange;
        let s = randomIntRange(width * minLength / 100, height * maxLength / 100);
        ctx.fillRect(randomIntUpTo(width), randomIntUpTo(height), s, s);
    }
}

let description = `Random rectangles in random colors, blended together.`;

run({
    createdDate: '2022.09.14',
    description,
    setupControls,
    drawWork
});
