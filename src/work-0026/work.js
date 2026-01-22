import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    shuffle
} from '/js/array.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 5, 4),
        makeSlider('numPointsX', 'Number of horizontal points per tile: {0}', 3, 5, 4),
        makeSlider('numPointsY', 'Number of vertical points per tile: {0}', 3, 5, 4),
        makeSlider('lineWidth', 'Line c.width: {0}', 8, 20, 12),
        makeSlider('percentConnections', 'Connections: {0}%', 30, 70, 50, 5),
        makeSlider('scale', 'Scale: {0}', 0.5, 0.8, 0.6, 0.05),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);
    c.ctx.strokeStyle = 'black';
    c.ctx.lineWidth = c.ctrl.lineWidth;
    let tileDim = c.width / c.ctrl.numTiles;
    let coordsOf = (x, y) => {
        return [
            (x - 1) / (c.ctrl.numPointsX - 1) * tileDim,
            (y - 1) / (c.ctrl.numPointsY - 1) * tileDim
        ];
    };
    for (let y = 1; y <= c.ctrl.numTiles; y++) {
        for (let x = 1; x <= c.ctrl.numTiles; x++) {
            c.ctx.save();
            // scale around tile center, but then move back to the upper left
            c.ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);
            c.ctx.scale(c.ctrl.scale, c.ctrl.scale);
            c.ctx.translate(-tileDim / 2, -tileDim / 2);
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
            for (let y = 1; y <= c.ctrl.numPointsY; y++) {
                for (let x = 1; x <= c.ctrl.numPointsX; x++) {
                    let coords = coordsOf(x, y);
                    // draw a dot
                    c.ctx.fillStyle = 'black';
                    c.ctx.fillRect(
                        coords[0] - c.ctrl.lineWidth / 2,
                        coords[1] - c.ctrl.lineWidth / 2,
                        c.ctrl.lineWidth,
                        c.ctrl.lineWidth
                    );
                    // connection to the neighbor to the right?
                    if (x < c.ctrl.numPointsX) connections.push([coords, coordsOf(x + 1, y)]);
                    // connection to the neighbor below?
                    if (y < c.ctrl.numPointsY) connections.push([coords, coordsOf(x, y + 1)]);
                }
                connections = shuffle(connections);
                connections.splice(c.ctrl.numPointsX * c.ctrl.numPointsY * c.ctrl.percentConnections / 100);
                connections.forEach(el => {
                    c.ctx.beginPath();
                    c.ctx.moveTo(...el[0]);
                    c.ctx.lineTo(...el[1]);
                    c.ctx.stroke();
                });
            }
            c.ctx.restore();
        }
    }
}
let description = `Each tile is a shape that has a grid of points. All points are drawn. Neighboring points have horizontal and vertical (but not diagonal) connections. Only a given percentage of all possible connections are drawn. Inspired by Vera Molnár, "Journal Intimes" 6, pages 151-154.`;
run({
    createdDate: '2023-10-02',
    description,
    setupControls,
    drawWork
});