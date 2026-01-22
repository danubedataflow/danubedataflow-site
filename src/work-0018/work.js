import {
    run,
    makeForm,
    makeSlider,
    makeSelect,
    makeOption
} from '/js/ui.js';
import {
    random,
    randomIntUpTo
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
let c, palette, color1, color2;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
        makeSlider('diagonalOrientationChance', "Probability of the diagonal's orientation: {0}%", 0, 100, 50),
        makeSelect('colorStrategy', 'Color strategy: ', [
            makeOption('random', 'Random'),
            makeOption('adjacent', 'Adjacent'),
        ]),
    );
}

function drawWork(config) {
    c = config;

    palette = ['white', '#777777', 'black'];
    let tileDim = c.width / c.ctrl.numTiles;
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            c.ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
            chooseColors(c.ctrl.colorStrategy);
            if (randomIntUpTo(100) < c.ctrl.diagonalOrientationChance) {
                // upper left to lower right
                c.ctx.fillStyle = color1;
                c.ctx.beginPath();
                c.ctx.moveTo(0, 0);
                c.ctx.lineTo(tileDim, tileDim);
                c.ctx.lineTo(0, tileDim);
                c.ctx.closePath();
                c.ctx.fill();
                c.ctx.fillStyle = color2;
                c.ctx.beginPath();
                c.ctx.moveTo(0, 0);
                c.ctx.lineTo(tileDim, tileDim);
                c.ctx.lineTo(tileDim, 0);
                c.ctx.closePath();
                c.ctx.fill();
            } else {
                // upper right to lower left
                c.ctx.fillStyle = color1;
                c.ctx.beginPath();
                c.ctx.moveTo(tileDim, 0);
                c.ctx.lineTo(0, tileDim);
                c.ctx.lineTo(0, 0);
                c.ctx.closePath();
                c.ctx.fill();
                c.ctx.fillStyle = color2;
                c.ctx.beginPath();
                c.ctx.moveTo(tileDim, 0);
                c.ctx.lineTo(0, tileDim);
                c.ctx.lineTo(tileDim, tileDim);
                c.ctx.closePath();
                c.ctx.fill();
            }
            color1 = color2;
            c.ctx.restore();
        }
    }
}

function chooseColors(colorStrategy) {
    if (colorStrategy === 'random') {
        // choose two different random colors
        color1 = randomElement(palette);
        do {
            color2 = randomElement(palette);
        } while (color1 == color2);
    } else if (colorStrategy === 'adjacent') {
        color1 = color2; // reuse previous color
        if (color1 === undefined) color1 = random(palette);
        do {
            color2 = randomElement(palette);
        } while (color1 == color2);
    } else {
        console.log('invalid color strategy ' + colorStrategy);
    }
}
let description = `Each tile is divided by a diagonal, either from the upper left to lower right or from the upper right to the lower left. Each half is filled randomly white, grey or black. The "adjacent" color choice strategy uses a color from the previous tile.`;
run({
    createdDate: '2022-12-07',
    description,
    setupControls,
    drawWork
});
