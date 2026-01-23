import {
    Work
} from '/js/work.js';
import {
    random
} from '/js/math.js';
import {
    colorRGBA
} from '/js/colors.js';
class Work0033 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 100, 40),
            this.makeSlider('numSymbols', 'Number of gray levels: {0}', 2, 20, 9),
            this.makeSlider('borderChangeChance', 'Probability of a color change at the border of the color scale: {0}%', 0, 100, 70),
            this.makeSlider('middleChangeChance', 'Probability of a next lighter color in the middle of the color scale: {0}%', 0, 100, 50),
        );
    }
    drawWork() {
        let lsystem = this.makeLsystem();
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            let spec = lsystem.getString();
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile's upper left corner
                this.ctx.translate((x - 1) * tileDim, (y - 1) * tileDim);
                /* interpret the symbols in each iteration as greyscale values. For
                 * this.ctrl.numSymbols == 5, this would be:
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
                // 0 <= alphaIndex <= this.ctrl.numSymbols - 1
                let alphaIndex = symbol.charCodeAt(0) - 'A'.charCodeAt(0);
                // map alpha from the range (0..this.ctrl.numSymbols - 1) to (0..100)
                let alpha = (alphaIndex / (this.ctrl.numSymbols - 1)) * 100;
                this.ctx.fillStyle = colorRGBA(0, 0, 0, alpha / 100);
                this.ctx.fillRect(0, 0, tileDim, tileDim);
                this.ctx.restore();
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
    makeLsystem() {
        let numSymbols = this.ctrl.numSymbols;
        let borderChangeChance = this.ctrl.borderChangeChance / 100;;
        let middleChangeChance = this.ctrl.middleChangeChance / 100;
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
        lsystem.setAxiom(this.makeAxiom(symbolsForAxiom, this.ctrl.numTiles));
        return lsystem;
    }
    makeAxiom(symbolsForAxiom, length) {
        var result = '';
        for (var i = 0; i < length; i++) {
            result += symbolsForAxiom.charAt(Math.floor(random() * symbolsForAxiom.length));
        }
        return result;
    }
    description = `This is an L-system where the symbols, arranged in a row of tiles, correspond to gray levels. Each iteration of the L-system corresponds to a row. The productions specify how each symbol changes from iteration to the next.`;
    createdDate = '2025-10-08';
}
new Work0033().run();
