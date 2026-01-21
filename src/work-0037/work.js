import {
    run,
    makeForm,
    makeSlider,
    makeCheckbox,
    makeFieldset,
    makeSelectColorMap
} from '/js/ui.js';
import {
    random
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
import {
    Point
} from '/js/point.js';
let c, palette;

function setupControls() {
    makeForm(
        makeSlider('subdivisionDepth', 'Subdivision recursion depth: {0} to {1} levels', 2, 8, [2, 5]),
        makeSlider('subdivisionChance', '{0}% probability that subdividing continues at each level', 20, 80, 60),
        makeSlider('chanceFill', '{0}% probability that a terminal triangle is filled', 20, 80, 50),
        makeCheckbox('hasBorder', 'Triangle border: '),
        makeFieldset('Colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'Number of colors: {0}', 2, 10, 6),
        ),
    );
}

function drawWork(config) {
    c = config;
    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);

    palette = chroma.scale(c.ctrl.colorMap).colors(c.ctrl.numColors);

    // draw outer border if enabled
    if (c.ctrl.hasBorder) {
        c.ctx.strokeStyle = 'black';
        c.ctx.strokeRect(0, 0, c.width, c.height);
    }

    let upperLeft = new Point(0, 0);
    let upperRight = new Point(c.width, 0);
    let lowerLeft = new Point(0, c.height);
    let lowerRight = new Point(c.width, c.height);

    // a diagonal splits the canvas into two triangles
    drawTriangle(upperLeft, upperRight, lowerLeft, 0);
    drawTriangle(upperRight, lowerLeft, lowerRight,  0);
}

function drawTriangle(p1, p2, p3, currentDepth) {
    let [minDepth, maxDepth] = c.ctrl.subdivisionDepth;

    // If we haven't reached the minimum currentDepth, we have to subdividide.
    // After that, up to the maximum currentDepth, it depends on chance.
    const shouldSubdivide =
        currentDepth < minDepth || (currentDepth < maxDepth && random() < c.ctrl.subdivisionChance / 100);

    if (shouldSubdivide) {
        // find the longest side, then subdivide at the half point of that side
        let { edge, splitPoint, oppositePoint } = longestEdgeEqualSplit(p1, p2, p3);

        drawTriangle(edge.pA, splitPoint, oppositePoint, currentDepth + 1);
        drawTriangle(edge.pB, splitPoint, oppositePoint, currentDepth + 1);
    } else {
        // it's a terminal triangle
        c.ctx.beginPath();
        c.ctx.moveTo(...p1.asArray());
        c.ctx.lineTo(...p2.asArray());
        c.ctx.lineTo(...p3.asArray());
        c.ctx.closePath();
        if (random() < c.ctrl.chanceFill / 100) {
            c.ctx.fillStyle = randomElement(palette);
            c.ctx.fill();
        }
        if (c.ctrl.hasBorder) {
            c.ctx.strokeStyle = 'black';
            c.ctx.stroke();
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

function longestEdgeEqualSplit(p1, p2, p3) {
  const edges = [
    { a: p1, b: p2, opposite: p3, len: p1.distanceTo(p2) },
    { a: p2, b: p3, opposite: p1, len: p2.distanceTo(p3) },
    { a: p3, b: p1, opposite: p2, len: p3.distanceTo(p1) }
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

let description = `The canvas is subdivided into two triangles. Each of these two triangles is recursively subdivided up to a random currentDepth. Each triangle has an optional border. Each terminal triangle has an optional fill.`;
run({
    createdDate: '2026-01-20',
    description,
    setupControls,
    drawWork
});
