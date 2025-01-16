// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

/*
 * Take care to initialize your PRNGs properly. To keep things simple, the
 * generators below have no built-in seed generating procedure, but accept one
 * or more 32-bit numbers as the initial seed state of the PRNG. Similar or
 * sparse seeds (e.g. a simple seed of 1 and 2) have low entropy, and can cause
 * correlations or other randomness quality issues, sometimes resulting in the
 * output having similar properties (such as randomly generated levels being
 * similar). To avoid this, it is best practice to initialize PRNGs with a
 * well-distributed, high entropy seed and/or advancing past the first 15 or so
 * numbers.
 *
 * There are many ways to do this, but here are two methods. Firstly, hash
 * functions are very good at generating seeds from short strings. A good hash
 * function will generate very different results even when two strings are
 * similar, so you don't have to put much thought into the string. Here's an
 * example hash function.
 *
 * Calling cyrb128 will produce a 128-bit hash value from a string which can be
 * used to seed a PRNG.
 */

function cyrb128(str) {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

/*
 * sfc32 is part of the PractRand random number testing suite (which it passes
 * of course). sfc32 has a 128-bit state and is very fast in JS.
 *
 * You may wonder what the | 0 and >>>= 0 are for. These are essentially 32-bit
 * integer casts, used for performance optimizations. Number in JS are
 * basically floats, but during bitwise operations, they switch into a 32-bit
 * integer mode. This mode is processed faster by JS interpreters, but any
 * multiplication or addition will cause it to switch back to a float,
 * resulting in a performance hit.
 */

function sfc32(a, b, c, d) {
    return function() {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

let random;

function randomSeed(seedStr) {

    // create cyrb128 state
    let seed = cyrb128(seedStr);

    // four 32-bit component hashes provide the seed for sfc32()
    random = sfc32(seed[0], seed[1], seed[2], seed[3]);

	// Now you can call random() to generate a random number betweem 0 and 1.
}

// init
let seedStr = Math.random().toString(36).slice(2, 10);
randomSeed(seedStr);

function randomIntUpTo(n) {
    return Math.floor(random() * n);
}

function randomIntRange(lowerBound, upperBound) {
    return lowerBound + Math.floor(random() * (upperBound + 1 - lowerBound));
}

// generate a random integer in the range [-n, n].
function randomIntPlusMinus(n) {
    return Math.floor(random() * 2 * n - n);
}

// https://gist.github.com/motoishmz/5239619
// Fisher-Yates
Array.prototype.shuffle = function() {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
};


Array.prototype.randomElement = function() {
    return this[Math.floor(random() * this.length)];
}
