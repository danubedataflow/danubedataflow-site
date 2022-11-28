'use strict';

// infinite sequences with generator functions

function* seesawSequence(min, max) {
    let value = min;
    let direction = 1; // or -1
    while (1) {
        yield value;
        value += direction;
        if (value >= max) direction = -1;
        if (value <= min) direction = 1;
    };
}

// can be used to cycle through a palette
function* moduloSequence(max) {
    let value = 0;
    while (1) {
        value++;
        if (value > max) value = 0;
        yield value;
    }
}

function* fibonacciSequence(prev = 1, value = 1) {
    yield prev;
    yield value;
    while (1) {
        let old = prev;
        prev = value;
        value += old;
        yield value;
    }
}

// like for James Siena's "2-256"
function* powerSequence(exponent = 2) {
    let value = 1;
    while (1) {
        yield value;
        value *= exponent;
    }
}

function randomIntRange(lowerBound, upperBound) {
    return int(random(lowerBound, upperBound + 1));
}

// https://stackoverflow.com/a/43053803
const cartesian = (...a) =>
    a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

const intArray = (n) => [...Array(n).keys()];

const squareArray = (n) => cartesian(intArray(n), intArray(n));

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

// https://stackoverflow.com/a/20871714
Array.prototype.permutations = function() {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(this);
    return result;
}
