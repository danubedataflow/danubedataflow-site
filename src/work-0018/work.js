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
let palette, c1, c2;

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

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    palette = ['white', '#777777', 'black'];
    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
            chooseColors(ctrl.colorStrategy);
            if (randomIntUpTo(100) < ctrl.diagonalOrientationChance) {
                // upper left to lower right
                ctx.fillStyle = c1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(tileDim, tileDim);
                ctx.lineTo(0, tileDim);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = c2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(tileDim, tileDim);
                ctx.lineTo(tileDim, 0);
                ctx.closePath();
                ctx.fill();
            } else {
                // upper right to lower left
                ctx.fillStyle = c1;
                ctx.beginPath();
                ctx.moveTo(tileDim, 0);
                ctx.lineTo(0, tileDim);
                ctx.lineTo(0, 0);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = c2;
                ctx.beginPath();
                ctx.moveTo(tileDim, 0);
                ctx.lineTo(0, tileDim);
                ctx.lineTo(tileDim, tileDim);
                ctx.closePath();
                ctx.fill();
            }
            c1 = c2;
            ctx.restore();
        }
    }
}

function chooseColors(colorStrategy) {
    if (colorStrategy === 'random') {
        // choose two different random colors
        c1 = randomElement(palette);
        do {
            c2 = randomElement(palette);
        } while (c1 == c2);
    } else if (colorStrategy === 'adjacent') {
        c1 = c2; // reuse previous color
        if (c1 === undefined) c1 = random(palette);
        do {
            c2 = randomElement(palette);
        } while (c1 == c2);
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