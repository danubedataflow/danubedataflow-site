import {
    Work
} from '/js/basework.js';
import {
    MathUtils
} from '/js/utils.js';
export class Work0008 extends Work {
    colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 5, 2),
            this.makeSlider('numSidesRange', 'Number of sides: {0} to {1}', 3, 7, [4, 6]),
            this.makeSlider('diameterRange', 'Diameter: {0}% to {1}% of the tile', 1, 100, [30, 50]),
            this.makeSlider('rotationStepRange', 'Rotation step: {0} to {1}', 0, 360, [150, 210]),
            this.makeSlider('maxDepthRange', 'Maximum depth: {0} to {1}', 1, 2, [1, 2]),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.tileIterator((tile) => {
                let numSides = MathUtils.randomIntRange(...this.ctrl.numSidesRange);
                let diameter = MathUtils.randomIntRange(...this.ctrl.diameterRange);
                let rotationStep = MathUtils.randomIntRange(...this.ctrl.rotationStepRange);
                let maxDepth = MathUtils.randomIntRange(...this.ctrl.maxDepthRange);
                this.drawPolygons(numSides, diameter * tile.tileDim / 100,
                    0, rotationStep, maxDepth);
        });
    }
    drawPolygons(sides, diameter, rotation, rotationStep, maxDepth = 0, depth = 0) {
        let points = MathUtils.getPointsForPolygon(sides, diameter, rotation);
        points.forEach(p => {
            this.ctx.save();
            this.translateToPoint(p);
            this.ctx.beginPath();
            points.forEach(p => this.lineToPoint(p));
            this.ctx.closePath();
            this.ctx.stroke();
            if (depth < maxDepth) {
                this.drawPolygons(sides, diameter,
                    rotation + rotationStep / sides, rotationStep, maxDepth, depth + 1);
            }
            this.ctx.restore();
        });
    }
    description = `Polygons at points of polygons at points of polygons, recursively up to the given depth.`;
    createdDate = '2022-10-01';
}
