import {
    Work
} from '/js/work.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work0037 extends Work {
    palette;
    getControls() {
        return [
            this.makeSlider('subdivisionDepth', 'Subdivision recursion depth: {0} to {1} levels', 2, 8, [2, 5]),
            this.makeSlider('subdivisionChance', '{0}% probability that subdividing continues at each level', 20, 80, 60),
            this.makeSlider('chanceFill', '{0}% probability that a terminal triangle is filled', 20, 80, 50),
            this.makeCheckbox('hasBorder', 'Triangle border: '),
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 2, 10, 6),
            ),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        // draw outer border if enabled
        if (this.ctrl.hasBorder) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(0, 0, this.width, this.height);
        }
        let upperLeft = new Point(0, 0);
        let upperRight = new Point(this.width, 0);
        let lowerLeft = new Point(0, this.height);
        let lowerRight = new Point(this.width, this.height);
        // a diagonal splits the canvas into two triangles
        this.drawTriangle(upperLeft, upperRight, lowerLeft, 0);
        this.drawTriangle(upperRight, lowerLeft, lowerRight, 0);
    }
    drawTriangle(p1, p2, p3, currentDepth) {
        let [minDepth, maxDepth] = this.ctrl.subdivisionDepth;
        // If we haven't reached the minimum currentDepth, we have to subdividide.
        // After that, up to the maximum currentDepth, it depends on chance.
        const shouldSubdivide =
            currentDepth < minDepth || (currentDepth < maxDepth && MathUtils.random() < this.ctrl.subdivisionChance / 100);
        if (shouldSubdivide) {
            // find the longest side, then subdivide at the half point of that side
            let {
                edge,
                splitPoint,
                oppositePoint
            } = this.longestEdgeEqualSplit(p1, p2, p3);
            this.drawTriangle(edge.pA, splitPoint, oppositePoint, currentDepth + 1);
            this.drawTriangle(edge.pB, splitPoint, oppositePoint, currentDepth + 1);
        } else {
            // it's a terminal triangle
            this.ctx.beginPath();
            this.ctx.moveTo(...p1.asArray());
            this.ctx.lineTo(...p2.asArray());
            this.ctx.lineTo(...p3.asArray());
            this.ctx.closePath();
            if (MathUtils.random() < this.ctrl.chanceFill / 100) {
                this.ctx.fillStyle = ArrayUtils.randomElement(this.palette);
                this.ctx.fill();
            }
            if (this.ctrl.hasBorder) {
                this.ctx.strokeStyle = 'black';
                this.ctx.stroke();
            }
        }
    }
    /* If you split a triangle by choosing a point on one edge and connecting it to
     * the opposite vertex, the areas of the two resulting triangles are
     * proportional to the lengths of the two edge segments. Therefore, choosing
     * the midpoint of an edge splits the triangle into two equal-area triangles.
     * We first find the longest edge, then return its midpoint.
     *
     * Returns:
     *
     *   edge.pA, edge.pB: the endpoints of the longest edge
     *
     *   splitPoint: the point on that edge that splits the triangle into two
     *   equal-area triangles
     *
     *   oppositePoint: the vertex to connect to splitPoint to perform the split
     */
    longestEdgeEqualSplit(p1, p2, p3) {
        const edges = [{
                a: p1,
                b: p2,
                opposite: p3,
                len: p1.distanceTo(p2)
            },
            {
                a: p2,
                b: p3,
                opposite: p1,
                len: p2.distanceTo(p3)
            },
            {
                a: p3,
                b: p1,
                opposite: p2,
                len: p3.distanceTo(p1)
            }
        ];
        // Find the longest edge
        let longest = edges[0];
        for (const e of edges) {
            if (e.len > longest.len) longest = e;
        }
        // Midpoint of the longest edge
        const splitPoint = new Point(
            (longest.a.x + longest.b.x) / 2,
            (longest.a.y + longest.b.y) / 2
        );
        return {
            edge: {
                pA: longest.a,
                pB: longest.b
            },
            splitPoint,
            oppositePoint: longest.opposite
        };
    }
    description = `The canvas is subdivided into two triangles. Each of these two triangles is recursively subdivided up to a random currentDepth. Each triangle has an optional border. Each terminal triangle has an optional fill.`;
    createdDate = '2026-01-20';
}
