import {
    Work
} from '/js/work.js';
import {
    ArrayUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
import {
    MarkovChain
} from '/js/markov.js';
export class Work0038 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 60, 35),
            this.makeFieldset('Line widths',
                this.makeCheckbox('useMarkovLineWidth', 'Use a markov chain'),
                this.makeSlider('lineWidthRange', 'Line width: {0} to {1}', 1, 3, [1, 3]),
            )
        );
    }
    drawWork() {
        const tileDim = this.width / this.ctrl.numTiles;
        const markovShapes = MarkovChain.makeRandomMarkovChain(['A', 'B', 'C', 'D']);
        const [lineWidthFrom, lineWidthTo] = this.ctrl.useMarkovLineWidth ? this.ctrl.lineWidthRange : [1, 1];
        const markovLineWidth = MarkovChain.makeRandomMarkovChain(ArrayUtils.arrayFromIntRange(lineWidthFrom, lineWidthTo));
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        for (let y = 0; y < this.ctrl.numTiles; y++) {
            for (let x = 0; x < this.ctrl.numTiles; x++) {
                // tile's upper left corner
                const p = new Point(x * tileDim, y * tileDim);
                this.ctx.lineWidth = markovLineWidth.getNextState();
                this.ctx.beginPath();
                const state = markovShapes.getNextState();
                if (state == 'A') {
                    // diagonal from the cell's upper left to lower right
                    this.ctx.moveTo(...p.asArray());
                    this.ctx.lineTo(...p.move(tileDim, tileDim).asArray());
                } else if (state == 'B') {
                    // diagonal from the cell's upper right to lower left
                    this.ctx.moveTo(...p.moveX(tileDim).asArray());
                    this.ctx.lineTo(...p.moveY(tileDim).asArray());
                } else if (state == 'C') {
                    // vertical line in the middle of the cell
                    this.ctx.moveTo(...p.moveX(tileDim / 2).asArray());
                    this.ctx.lineTo(...p.move(tileDim / 2, tileDim).asArray());
                } else if (state == 'D') {
                    // horizontal line in the middle of the cell
                    this.ctx.moveTo(...p.moveY(tileDim / 2).asArray());
                    this.ctx.lineTo(...p.move(tileDim, tileDim / 2).asArray());
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
    }
    description = `A finite Markov chain is evaluated once over a two-dimensional grid, assigning a line orientation to each cell according to its immediately preceding state. So the probabilistic rule that is normally applied over time is applied instead across space. See my notes on <a href="/notes/markov-chains.html">Markov chains.</a> It resembles, but is not based on, "Quatre éléments distribués au hasard" by Vera Molnár, 1959.`;
    createdDate = '2026-01-21';
}
