// Generated with ChatGPT 5.2

/**
 * Create an n×n matrix of random numbers in [0, 1) where each row sums to 1.
 * (Row-stochastic matrix)
 *
 * @param {number} n - size of the matrix (positive integer)
 * @returns {number[][]}
 */
function randomRowStochasticMatrix(n) {
  const matrix = new Array(n);

  for (let i = 0; i < n; i++) {
    // Generate n random positive numbers
    const row = new Array(n);
    let sum = 0;

    for (let j = 0; j < n; j++) {
      const x = Math.random(); // in [0, 1)
      row[j] = x;
      sum += x;
    }

    // Normalize so the row sums to 1
    if (sum === 0) {
      // Extremely unlikely with Math.random(), but keep it safe:
      const v = 1 / n;
      for (let j = 0; j < n; j++) row[j] = v;
    } else {
      for (let j = 0; j < n; j++) row[j] /= sum;
    }

    matrix[i] = row;
  }

  return matrix;
}

/**
 * Multiply a square matrix by itself (matrix square).
 * Assumes the matrix is row-stochastic (rows sum to 1),
 * but works for any numeric square matrix.
 *
 * @param {number[][]} M - n×n matrix
 * @returns {number[][]} M²
 */
function squareMatrix(M) {
  const n = M.length;

  if (!Array.isArray(M) || n === 0) {
    throw new TypeError("Matrix must be a non-empty 2D array");
  }

  for (const row of M) {
    if (!Array.isArray(row) || row.length !== n) {
      throw new TypeError("Matrix must be square");
    }
  }

  const result = Array.from({ length: n }, () =>
    Array(n).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const Mik = M[i][k];
      if (Mik === 0) continue; // small optimization
      for (let j = 0; j < n; j++) {
        result[i][j] += Mik * M[k][j];
      }
    }
  }

  return result;
}

/* Because of floating-point rounding, rows may sum to 0.999999999 or
 * 1.000000001. If you want to enforce stochasticity after squaring:
 */

function renormalizeRows(M) {
  return M.map(row => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum === 0
      ? row.map(() => 1 / row.length)
      : row.map(x => x / sum);
  });
}

// Usage:
// const P = randomRowStochasticMatrix(4);
// const P2 = renormalizeRows(squareMatrix(P));
