'use strict';

let createdDate = '2025.10.08';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 100, 40),
        makeSlider('numSymbols', 'Number of gray levels: {0}', 2, 20, 9),
        makeSlider('borderChangeChance', 'Probability of a color change at the border of the color scale: {0}%', 0, 100, 70),
        makeSlider('middleChangeChance', 'Probability of a next lighter color in the middle of the color scale: {0}%', 0, 100, 50),
    );
}

function drawWork() {
    let lsystem = makeLsystem();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        let spec = lsystem.getString();
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile's upper left corner
            ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);

            /* interpret the symbols in each iteration as greyscale values. For
             * ctrl.numSymbols == 5, this would be:
             *
             * A = fill 0% (blank)
             * B = fill 25%
             * C = fill 50%
             * D = fill 75%
             * E = fill 100% (opaque)
             *
             * 'A' has alphaIndex 0; 'E' has alphaIndex 4. Then maps this value
             * to an alpha value of 0% to 100%. alphaIndex 0 means 0% alpha;
             * alphaIndex 4 means 100% alpha.
             */
            let symbol = spec.charAt(x - 1);

            // 0 <= alphaIndex <= ctrl.numSymbols - 1
            let alphaIndex = symbol.charCodeAt(0) - 'A'.charCodeAt(0);

            // map alpha from the range (0..ctrl.numSymbols - 1) to (0..100)
            let alpha = (alphaIndex / (ctrl.numSymbols - 1)) * 100;
            ctx.fillStyle = colorRGBA(0, 0, 0, alpha / 100);
            ctx.fillRect(0, 0, tileDim, tileDim);

            ctx.restore();
        }
        lsystem.iterate();
    }
}

/* The L-system has n symbols, 2 <= n <= 25. Each symbol is an uppercase
 * letter. Productions for the first and last symbol use borderChangeChance;
 * other symbols use middleChangeChance.
 *
 * For example, for 5 symbols, this corresponds to:
 *
 *    lsystem.setProduction('A', () => (random() < borderChangeChance) ? 'B' : 'A')
 *    lsystem.setProduction('B', () => (random() < middleChangeChance) ? 'A' : 'C')
 *    lsystem.setProduction('C', () => (random() < middleChangeChance) ? 'B' : 'D')
 *    lsystem.setProduction('D', () => (random() < middleChangeChance) ? 'C' : 'E')
 *    lsystem.setProduction('E', () => (random() < borderChangeChance) ? 'D' : 'E')
 */
function makeLsystem() {
    let numSymbols = ctrl.numSymbols;
    let borderChangeChance = ctrl.borderChangeChance / 100;;
    let middleChangeChance = ctrl.middleChangeChance / 100;

    let lsystem = new LSystem({});
    let charCode = 'A'.charCodeAt(0);
    let symbolsForAxiom = '';
    for (let i = 0; i < numSymbols; i++) {
        let symbol = String.fromCharCode(charCode);
        symbolsForAxiom += symbol;
        let nextSymbol = String.fromCharCode(charCode + 1);
        let prevSymbol = String.fromCharCode(charCode - 1);
        if (i == 0) {
            lsystem.setProduction(symbol, () => (random() < borderChangeChance) ? nextSymbol : symbol)
        } else if (i == numSymbols - 1) {
            lsystem.setProduction(symbol, () => (random() < borderChangeChance) ? prevSymbol : symbol)
        } else {
            lsystem.setProduction(symbol, () => (random() < middleChangeChance) ? prevSymbol : nextSymbol)
        }
        charCode++;
    }

    lsystem.setAxiom(makeAxiom(symbolsForAxiom, ctrl.numTiles));
    console.log(lsystem);
    return lsystem;
}

function makeAxiom(symbolsForAxiom, length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += symbolsForAxiom.charAt(Math.floor(random() * symbolsForAxiom.length));
    }
    return result;
}
