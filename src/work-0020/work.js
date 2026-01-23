import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0020 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 10),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 32, 16),
            ),
            this.makeSlider('coloredTileChance', 'Probability of a colored tile: {0}%', 0, 100, 50),
            this.makeSlider('coloredDiamondChance', 'Probability of a colored rhombus: {0}%', 0, 100, 50),
        );
    }
    drawWork() {
        this.clearCanvas();
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        let tileDim = this.width / this.ctrl.numTiles;
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // move to the tile center so any rotate() and scale() happen there
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                // fill whole tile
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredTileChance ? ArrayUtils.randomElement(palette) : 'white';
                this.ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
                // draw triangles
                // upper left quadrant, diagonally sliced, inner triangle
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredDiamondChance ? ArrayUtils.randomElement(palette) : 'white';
                this.ctx.beginPath();
                this.ctx.moveTo(0, -tileDim / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.lineTo(-tileDim / 2, 0);
                this.ctx.closePath();
                this.ctx.fill();
                // upper right quadrant, diagonally sliced, inner triangle
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredDiamondChance ? ArrayUtils.randomElement(palette) : 'white';
                this.ctx.beginPath();
                this.ctx.moveTo(0, -tileDim / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.lineTo(tileDim / 2, 0);
                this.ctx.closePath();
                this.ctx.fill();
                // lower left quadrant, diagonally sliced, inner triangle
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredDiamondChance ? ArrayUtils.randomElement(palette) : 'white';
                this.ctx.beginPath();
                this.ctx.moveTo(0, tileDim / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.lineTo(-tileDim / 2, 0);
                this.ctx.closePath();
                this.ctx.fill();
                // lower right quadrant, diagonally sliced, inner triangle
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredDiamondChance ? ArrayUtils.randomElement(palette) : 'white';
                this.ctx.beginPath();
                this.ctx.moveTo(0, tileDim / 2);
                this.ctx.lineTo(0, 0);
                this.ctx.lineTo(tileDim / 2, 0);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }
    description = `Each tile has a random color. The maximum inscribed diamond shape is sliced into four triangles that meet at the center. Each triangle gets a separate random color, overlaid on the tile background. Homage to Emma Biggs and Matthew Collings.`;
    createdDate = '2023-04-27';
}
