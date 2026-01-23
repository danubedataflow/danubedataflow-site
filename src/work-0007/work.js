import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0007 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColorsRange', 'Number of colors: {0} to {1}', 2, 32, [12, 20]),
            ),
            this.makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 50, [8, 15]),
        );
    }
    drawWork() {
        this.clearCanvas('black');
        let tileDim = Math.floor(this.width / this.ctrl.numTiles);
        for (let x = 0; x < this.ctrl.numTiles; x++) {
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                this.ctx.save();
                this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
                let numColors = MathUtils.randomIntRange(...this.ctrl.numColorsRange);
                let palette = chroma.scale(this.ctrl.colorMap).colors(numColors);
                let numSides = MathUtils.randomIntRange(...this.ctrl.numSidesRange);
                let points = MathUtils.getPointsForPolygon(numSides, tileDim * 0.9, 0);
                // draw a line from each point to each point
                let colorIndex = 0;
                points.forEach((p, i) => {
                    points.forEach((p2, j) => {
                        if (i == j) return;
                        this.ctx.strokeStyle = palette[colorIndex];
                        colorIndex = (colorIndex + 1 + palette.length) % palette.length;
                        this.ctx.beginPath();
                        this.ctx.moveTo(...p.asArray());
                        this.ctx.lineTo(...p2.asArray());
                        this.ctx.stroke();
                    });
                });
                this.ctx.restore();
            }
        }
    }
    description = `Different polygons. Each points on a polygon is connected to all other points, using a random color.`
    createdDate = '2022-09-25';
}
