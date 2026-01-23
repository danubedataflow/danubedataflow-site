import {
    Work
} from '/js/ui.js';
import {
    shuffle
} from '/js/array.js';
class Work0026 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 5, 4),
            this.makeSlider('numPointsX', 'Number of horizontal points per tile: {0}', 3, 5, 4),
            this.makeSlider('numPointsY', 'Number of vertical points per tile: {0}', 3, 5, 4),
            this.makeSlider('lineWidth', 'Line this.width: {0}', 8, 20, 12),
            this.makeSlider('percentConnections', 'Connections: {0}%', 30, 70, 50, 5),
            this.makeSlider('scale', 'Scale: {0}', 0.5, 0.8, 0.6, 0.05),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.ctrl.lineWidth;
        let tileDim = this.width / this.ctrl.numTiles;
        let coordsOf = (x, y) => {
            return [
                (x - 1) / (this.ctrl.numPointsX - 1) * tileDim,
                (y - 1) / (this.ctrl.numPointsY - 1) * tileDim
            ];
        };
        for (let y = 1; y <= this.ctrl.numTiles; y++) {
            for (let x = 1; x <= this.ctrl.numTiles; x++) {
                this.ctx.save();
                // scale around tile center, but then move back to the upper left
                this.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
                this.ctx.scale(this.ctrl.scale, this.ctrl.scale);
                this.ctx.translate(-tileDim / 2, -tileDim / 2);
                /*
                 * To build the connections, traverse the points from left to right
                 * and top to bottom. Then you only have to check the potential
                 * neighbors to the right and below.
                 *
                 * The tile has [0,0] in the upper left corner and [tileDim,
                 * tileDim] in the lower right corner. Assume that there are 3
                 * points horizontally, the x-coordinates of the points will be
                 * tileDim * 0 / 2, tileDim * 1 / 2 and tileDim * 2 / 2.
                 * y-coordinates are calculated the same way.
                 *
                 * Connections are stored in an array where each element has the
                 * coordinates of the two endpoints of the line. That is, [ [x1,
                 * y1], [x2, y2] ].
                 *
                 * Because we only want to randomly draw only a certain percentage
                 * of all possible connections, we shuffle the array, then splice
                 * off the unwanted elements. Then we draw the remaining lines.
                 */
                let connections = [];
                for (let y = 1; y <= this.ctrl.numPointsY; y++) {
                    for (let x = 1; x <= this.ctrl.numPointsX; x++) {
                        let coords = coordsOf(x, y);
                        // draw a dot
                        this.ctx.fillStyle = 'black';
                        this.ctx.fillRect(
                            coords[0] - this.ctrl.lineWidth / 2,
                            coords[1] - this.ctrl.lineWidth / 2,
                            this.ctrl.lineWidth,
                            this.ctrl.lineWidth
                        );
                        // connection to the neighbor to the right?
                        if (x < this.ctrl.numPointsX) connections.push([coords, coordsOf(x + 1, y)]);
                        // connection to the neighbor below?
                        if (y < this.ctrl.numPointsY) connections.push([coords, coordsOf(x, y + 1)]);
                    }
                    connections = shuffle(connections);
                    connections.splice(this.ctrl.numPointsX * this.ctrl.numPointsY * this.ctrl.percentConnections / 100);
                    connections.forEach(el => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(...el[0]);
                        this.ctx.lineTo(...el[1]);
                        this.ctx.stroke();
                    });
                }
                this.ctx.restore();
            }
        }
    }
    description = `Each tile is a shape that has a grid of points. All points are drawn. Neighboring points have horizontal and vertical (but not diagonal) connections. Only a given percentage of all possible connections are drawn. Inspired by Vera Molnár, "Journal Intimes" 6, pages 151-154.`;
    createdDate = '2023-10-02';
}
new Work0026().run();