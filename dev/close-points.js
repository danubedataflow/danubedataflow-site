// For Work 0035.

/* Given an array of points, each represented by an object with an x key and a
 * y key, find all pairs of points whose distance in pixels is less than a
 * given value.
 *
 * Efficient Algorithm (Spatial Hashing / Grid). ~O(n)
 *
 * Use this when you have many thousands of points.
 *
 * Divide the canvas into square cells of size n × n
 *
 * A point can only be within distance n of points in its own cell or the 8
 * neighboring cells
 *
 * Only compare those candidates.
 *
 * Notes:
 *
 * For very large sets, you may want to deduplicate pairs (e.g., using IDs or
 * index ordering).
 *
 * This approach is standard in collision detection, particle systems, and
 * canvas simulations.
 */

function findClosePairsGrid(points, maxDist) {
    const cellSize = maxDist;
    const grid = new Map();
    const result = [];
    const maxDistSq = maxDist * maxDist;

    function cellKey(cx, cy) {
        return `${cx},${cy}`;
    }

    // Insert points into grid
    for (const p of points) {
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = cellKey(cx, cy);

        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(p);
    }

    // Neighbor cell offsets
    const neighbors = [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];

    // Check nearby points
    for (const [key, cellPoints] of grid) {
        const [cx, cy] = key.split(",").map(Number);

        for (const [dxCell, dyCell] of neighbors) {
            const neighborKey = cellKey(cx + dxCell, cy + dyCell);
            const neighborPoints = grid.get(neighborKey);
            if (!neighborPoints) continue;

            for (const p1 of cellPoints) {
                for (const p2 of neighborPoints) {
                    if (p1 === p2) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;

                    if (dx * dx + dy * dy < maxDistSq) {
                        // Avoid duplicate pairs
                        if (p1 !== p2) result.push([p1, p2]);
                    }
                }
            }
        }
    }

    return result;
}
