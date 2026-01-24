import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0020 extends Work {
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 10),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 32, 16),
            ),
            this.makeSlider('coloredTileChance', 'Probability of a colored tile: {0}%', 0, 100, 50),
            this.makeSlider('coloredDiamondChance', 'Probability of a colored rhombus: {0}%', 0, 100, 50),
        ];
    }
    drawWork() {
        this.clearCanvas();
        let palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        this.tileIterator((tile) => {
            // fill whole tile
            this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredTileChance ? ArrayUtils.randomElement(palette) : 'white';
            this.fillRectForPoint(tile.upperLeft(), tile.tileDim, tile.tileDim);

            let triangles = [
                // upper left quadrant, diagonally sliced, inner triangle
                [tile.upperMiddle(), tile.center(), tile.middleLeft()],
                // upper right quadrant, diagonally sliced, inner triangle
                [tile.upperMiddle(), tile.center(), tile.middleRight()],
                // lower left quadrant, diagonally sliced, inner triangle
                [tile.lowerMiddle(), tile.center(), tile.middleLeft()],
                // lower right quadrant, diagonally sliced, inner triangle
                [tile.lowerMiddle(), tile.center(), tile.middleRight()],
            ];

            triangles.forEach(t => {
                this.ctx.fillStyle = MathUtils.randomIntUpTo(100) < this.ctrl.coloredDiamondChance ? ArrayUtils.randomElement(palette) : 'white';
                this.trianglePath(...t);
                this.ctx.fill();
            });

        });
    }
    description = `Each tile has a random color. The maximum inscribed diamond shape is sliced into four triangles that meet at the center. Each triangle gets a separate random color, overlaid on the tile background. Homage to Emma Biggs and Matthew Collings.`;
    createdDate = '2023-04-27';
}
