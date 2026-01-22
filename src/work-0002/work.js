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
    randomIntUpTo
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'darken', 'difference', 'hard-light', 'multiply']),
        ),
        makeSlider('numTriangles', 'Number of triangles: {0}', 1, 500, 100),
    );
}

function drawWork(config) {
    c = config;
    // actually clear the canvas
    c.ctx.globalCompositeOperation = 'source-over';
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.globalCompositeOperation = c.ctrl.blendMode;
    let colorScale = chroma.scale(c.ctrl.colorMap);
    let p = [];
    // + 2 because the first triangle is only drawn on the third iteration
    for (let i = 1; i <= c.ctrl.numTriangles + 2; i++) {
        p.push([randomIntUpTo(c.width), randomIntUpTo(c.height)]);
        if (p.length == 3) {
            let color = colorScale(random()).rgb();
            c.ctx.fillStyle = colorRGBA(...color, random());
            // draw a triangle
            c.ctx.beginPath();
            c.ctx.moveTo(...p[0]);
            c.ctx.lineTo(...p[1]);
            c.ctx.lineTo(...p[2]);
            c.ctx.closePath();
            c.ctx.fill();
            p.shift();
        }
    }
}
let description = `A series of random triangles, each drawn with a random colors from a palette and the selected composite operations. Each triangle shares two points with the previous triangle.`;
run({
    createdDate: '2022-08-13',
    description,
    setupControls,
    drawWork
});