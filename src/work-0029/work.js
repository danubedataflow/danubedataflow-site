import {
    run,
    makeForm,
    makeSlider,
    clearCanvas
} from '/js/ui.js';
import {
    randomIntUpTo,
    randomIntPlusMinus
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 3),
        makeSlider('lineGap', 'Distance of initial points: {0}', 5, 100, 50),
        makeSlider('maxMovement', 'Maximum movement: {0}', 5, 20, 10),
    );
}

function drawWork(config) {
    c = config;
    clearCanvas();
    c.ctx.strokeStyle = 'black';
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // move to the tile center so rotate() and scale() happen there
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.scale(0.9, 0.9);
            drawWalkers(tileDim);
            c.ctx.rotate(Math.PI / 2);
            drawWalkers(tileDim);
            c.ctx.restore();
        }
    }
}

function drawWalkers(tileDim) {
    c.ctx.save();
    c.ctx.translate(-tileDim / 2, -tileDim / 2);
    for (let startY = 0; startY <= tileDim; startY += c.ctrl.lineGap) {
        let y = startY;
        c.ctx.fillStyle = colorRGBA(randomIntUpTo(255), randomIntUpTo(255), randomIntUpTo(255), 0.2);
        c.ctx.beginPath();
        c.ctx.moveTo(0, 0);
        for (let x = 0; x <= tileDim; x += c.ctrl.maxMovement) {
            c.ctx.lineTo(x, y);
            // random movement but constrain to the tile size
            y += randomIntPlusMinus(c.ctrl.maxMovement);
            if (y < 0) y = 0;
            if (y > tileDim) y = tileDim;
        }
        c.ctx.lineTo(tileDim, 0);
        c.ctx.closePath();
        c.ctx.fill();
        c.ctx.stroke();
    }
    // draw a border
    c.ctx.strokeRect(0, 0, tileDim, tileDim);
    c.ctx.restore();
}
let description = `Each tile contains a shape that has straight borders on the left, top and right sides. The shape along the bottom follows the path of a random walker. Each shape uses a random semitransparent fill so each intersecting shape of adjacent horizontal and vertical walkers is filled by a color that is related to its neighbors. Homage to "25 croix" by Vera Molnár, 1994`;
run({
    createdDate: '2023-10-06',
    description,
    setupControls,
    drawWork
});
