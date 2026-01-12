'use strict';

function setupControls() {
    makeForm(
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSelectBlendMode(['source-over', 'darken', 'difference', 'hard-light', 'multiply']),
        ),
        makeSlider('numTriangles', 'Number of triangles: {0}', 1, 500, 100),
    );
}

function drawWork() {
    // actually clear the canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = ctrl.blendMode;
    let colorScale = chroma.scale(ctrl.colorMap);
    let p = [];
    // + 2 because the first triangle is only drawn on the third iteration
    for (let i = 1; i <= ctrl.numTriangles + 2; i++) {
        p.push([randomIntUpTo(width), randomIntUpTo(height)]);
        if (p.length == 3) {
            let c = colorScale(random()).rgb();
            ctx.fillStyle = colorRGBA(...c, random());

            // draw a triangle
            ctx.beginPath();
            ctx.moveTo(...p[0]);
            ctx.lineTo(...p[1]);
            ctx.lineTo(...p[2]);
            ctx.closePath();

            ctx.fill();
            p.shift();
        }
    }
}
