import {
    Work
} from '/js/basework.js';
import {
    ArrayUtils
} from '/js/utils.js';
import {
    MarkovChain
} from '/js/markov.js';
export class Work0038 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 60, 35),
            this.makeFieldset('Line widths',
                this.makeCheckbox('useMarkovLineWidth', 'Use a markov chain'),
                this.makeSlider('lineWidthRange', 'Line width: {0} to {1}', 1, 3, [1, 3]),
            )
        ];
    }
    drawWork() {
        let handleShapeState = {
            'A': (tile) => this.linePath(tile.upperLeft(), tile.lowerRight()),
            'B': (tile) => this.linePath(tile.upperRight(), tile.lowerLeft()),
            'C': (tile) => this.linePath(tile.upperMiddle(), tile.lowerMiddle()),
            'D': (tile) => this.linePath(tile.middleLeft(), tile.middleRight()),
        };
        const markovShapes = MarkovChain.makeRandomMarkovChain(Object.keys(handleShapeState));
        const [lineWidthFrom, lineWidthTo] = this.ctrl.useMarkovLineWidth ? this.ctrl.lineWidthRange : [1, 1];
        const markovLineWidth = MarkovChain.makeRandomMarkovChain(ArrayUtils.arrayFromIntRange(lineWidthFrom, lineWidthTo));
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
            this.ctx.lineWidth = markovLineWidth.getNextState();
            let state = markovShapes.getNextState();
            handleShapeState[state](tile);
            this.ctx.stroke();
        });
    }
    description = `A finite Markov chain is evaluated once over a two-dimensional grid, assigning a line orientation to each cell according to its immediately preceding state. So the probabilistic rule that is normally applied over time is applied instead across space. See my notes on <a href="/notes/markov-chains.html">Markov chains.</a> It resembles, but is not based on, "Quatre éléments distribués au hasard" by Vera Molnár, 1959.`;
    createdDate = '2026-01-21';
}
