import {
    Work
} from '/js/work.js';
import {
    MathUtils
} from '/js/utils.js';
class Work0035 extends Work {
    setupControls() {
        this.makeForm(
            this.makeSlider('numPoints', 'Number of points: {0}', 50, 700, 350),
            this.makeSlider('percentMaxLineLength', 'Maximum line length: {0}% of this.width', 10, 20, 15),
            this.makeSelect('randomType', 'Random type: ', [
                this.makeOption('standard', 'Standard'),
                this.makeOption('gaussian', 'Gaussian'),
            ]),
        );
    }
    drawWork() {
        this.clearCanvas();
        this.ctx.strokeStyle = 'black';
        let points = [];
        for (let i = 1; i <= this.ctrl.numPoints; i++) {
            points.push({
                x: this.randomCoordinate(this.ctrl.randomType, this.width),
                y: this.randomCoordinate(this.ctrl.randomType, this.height)
            });
        }
        // Make maxLineLength dependent on this.width, but use the same number of points
        // regardless of the this.width. That way the work looks the same at different
        // canvas sizes.
        let maxLineLength = this.width * this.ctrl.percentMaxLineLength / 100;
        let pairs = this.findClosePairs(points, maxLineLength);
        for (const [p1, p2] of pairs) {
            this.ctx.strokeStyle = 'black';
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
    randomCoordinate(type, limit) {
        if (type == 'standard') {
            return MathUtils.randomIntUpTo(limit);
        } else if (type == 'gaussian') {
            return MathUtils.gaussianRandom(limit / 2, limit / 2) // [0, limit]
        } else {
            console.log(`unknown random type '${type}'`);
        }
    }
    /* Given an array of points, each represented by an object with an x key and a
     * y key, find all pairs of points whose distance in pixels is less than a
     * given value.
     *
    /* Brute-force version. O(n^2)
     *
     * Compare every pair of points once and compute the Euclidean distance.
     */
    findClosePairs(points, maxDist) {
        const result = [];
        const maxDistSq = maxDist * maxDist;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                if (dx * dx + dy * dy < maxDistSq) {
                    result.push([points[i], points[j]]);
                }
            }
        }
        return result;
    }
    description = `Place random points. Draw a line between each pair of points whose Euclidean distance is less than a given value.`;
    createdDate = '2026-01-18';
}
new Work0035().run();