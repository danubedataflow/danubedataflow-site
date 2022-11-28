'use strict';

const config = new Config()
    .title('S2022-005');

let slices, seesaw;

makeForm(
    makeSelectColorMap(),
    makeSelectBlendMode(),
    makeSlider('numSlices', 'Number of slices', 1, 100, 40),
);

function initSketch() {
    background('white');
    slices = [];
    seesaw = seesawSequence(1, 10);
    noStroke();
}

function drawSketch() {
    blendMode(ctrl.blendMode);
    translate(width / 2, height / 2)
    let colorScale = chroma.scale(ctrl.colorMap);
    let c = colorScale(seesaw.next().value / 10).toString();
    slices.unshift(c);
    slices.splice(ctrl.numSlices);

    for (let i = slices.length; i > 0; i--) {
        if (typeof slices[i] !== 'undefined') {
            fill(slices[i]);
            let radius = i * width / ctrl.numSlices;
            circle(0, 0, radius);
        }
    }
}
