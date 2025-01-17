'use strict';

let palette, c1, c2;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 4, 40, 20),
        makeSlider('diagonalOrientationChance', 0, 100, 50),
        makeSelect('colorStrategy', [
            makeOption('random', 'XXX'),
            makeOption('adjacent', 'XXX'),
        ]),
    );
}

function drawSketch() {
    palette = ['white', '#777777', 'black'];

    ctx.save();

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();
            ctx.translate((x - 1) * dim, (y - 1) * dim);

            chooseColors();
            if (randomIntUpTo(100) < ctrl.diagonalOrientationChance) {
                // upper left to lower right
                ctx.fillStyle = c1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(dim, dim);
                ctx.lineTo(0, dim);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = c2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(dim, dim);
                ctx.lineTo(dim, 0);
                ctx.closePath();
                ctx.fill();

            } else {

                // upper right to lower left
                ctx.fillStyle = c1;
                ctx.beginPath();
                ctx.moveTo(dim, 0);
                ctx.lineTo(0, dim);
                ctx.lineTo(0, 0);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = c2;
                ctx.beginPath();
                ctx.moveTo(dim, 0);
                ctx.lineTo(0, dim);
                ctx.lineTo(dim, dim);
                ctx.closePath();
                ctx.fill();
            }
            c1 = c2;

            ctx.restore();
        }
    }

    ctx.restore();
}

function chooseColors() {
    if (ctrl.colorStrategy === 'random') {
        // choose two different random colors

        c1 = palette.randomElement();
        do {
            c2 = palette.randomElement();
        } while (c1 == c2);

    } else if (ctrl.colorStrategy === 'adjacent') {
        c1 = c2; // reuse previous color
        if (c1 === undefined) c1 = random(palette);
        do {
            c2 = palette.randomElement();
        } while (c1 == c2);
    } else {
        console.log('invalid color strategy ' + ctrl.colorStrategy);
    }
}
