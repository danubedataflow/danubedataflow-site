'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 10, 100, 5),
        makeSlider('borderChangeChance', 0, 100, 70),
        makeSlider('middleChangeChance', 0, 100, 50),
    );
}

function drawSketch() {
    let lsystem = makeLsystem();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        let spec = lsystem.getString();
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to tile center to rotate
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            // interpret the characters in each iteration for the canvas
            //
            // A = fill 0% (blank)
            // B = fill 25%
            // C = fill 50%
            // D = fill 75%
            // E = fill 100% (opaque)
            let instruction = spec.charAt(x - 1);
            let alpha;
            if (instruction === 'A') alpha = 0;
            if (instruction === 'B') alpha = 25;
            if (instruction === 'C') alpha = 50;
            if (instruction === 'D') alpha = 75;
            if (instruction === 'E') alpha = 100;
            ctx.fillStyle = colorRGBA(0, 0, 0, alpha / 100);
            ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);

            ctx.restore();
        }
        lsystem.iterate();
    }
}

function makeLsystem() {
    let borderChangeChance = ctrl.borderChangeChance / 100;;
    let middleChangeChance = ctrl.middleChangeChance / 100;

    let lsystem = new LSystem({});
    lsystem.setAxiom(makeAxiom(ctrl.numTiles));
    lsystem.setProduction('A', () => (random() < borderChangeChance) ? 'B' : 'A')
    lsystem.setProduction('B', () => (random() < middleChangeChance) ? 'A' : 'C')
    lsystem.setProduction('C', () => (random() < middleChangeChance) ? 'B' : 'D')
    lsystem.setProduction('D', () => (random() < middleChangeChance) ? 'C' : 'E')
    lsystem.setProduction('E', () => (random() < borderChangeChance) ? 'D' : 'E')
    return lsystem;
}

function makeAxiom(length) {
    var result = '';
    var characters = 'ABCDE';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(random() * characters.length));
    }
    return result;
}
