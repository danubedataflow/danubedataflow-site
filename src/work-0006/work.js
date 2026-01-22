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
let c, palette;

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

function drawWork(config) {
    c = config;
    // actually clear the canvas
    c.ctx.globalCompositeOperation = 'source-over';
    // random color from the palette
    let palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);
    c.ctx.fillStyle = randomElement(palette);
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.globalCompositeOperation = c.ctrl.blendMode;
    for (let i = 0; i < c.ctrl.numSquares; i++) {
        let color = randomElement(palette);
        // turn RGB hex string into [R, G, B]
        color = chroma(color).rgb();
        // map [0,100]% to [0, 1]
        let alpha = randomIntRange(...c.ctrl.alphaRange) / 100;
        c.ctx.fillStyle = colorRGBA(...color, alpha);
        let [minLength, maxLength] = c.ctrl.squareLengthRange;
        let s = randomIntRange(c.width * minLength / 100, c.height * maxLength / 100);
        c.ctx.fillRect(randomIntUpTo(c.width), randomIntUpTo(c.height), s, s);
    }
}
let description = `Random rectangles in random colors, blended together.`;
run({
    createdDate: '2022-09-14',
    description,
    setupControls,
    drawWork
});