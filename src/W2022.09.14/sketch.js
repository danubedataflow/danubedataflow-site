'use strict';

let palette;

function setupForm() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'difference','hard-light', 'overlay']),
            makeSlider('numColors', 1, 32, 16),
            makeSlider('alphaRange', 0, 100, [20, 80]),
        ),
        makeSlider('numSquares', 20, 1000, 100, 20),
        makeSlider('squareLengthRange', 1, 100, [5, 30]),
    );
}

function drawSketch() {
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';

    // random color from the palette
    ctx.fillStyle = palette[Math.floor(random() * palette.length)];
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;

    for (let i = 0; i < ctrl.numSquares; i++) {
        let c = palette[Math.floor(random() * palette.length)];

        // turn RGB hex string into [R, G, B]
        c = chroma(c).rgb();

        // map [0,100]% to [0, 1]
        let alpha = randomIntRange(...ctrl.alphaRange) / 100;

        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;

        let [minLength, maxLength] = ctrl.squareLengthRange;
        let s = randomIntRange(width * minLength / 100, height * maxLength / 100);
        ctx.fillRect(randomIntUpTo(width), randomIntUpTo(height), s, s);
    }
}
