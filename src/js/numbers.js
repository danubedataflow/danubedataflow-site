'use strict';

function getSeesaw(min, max) {
    // returns a function that returns the next value in the seesaw.
    let value;
    let direction = 1; // or -1
    return () => {
        if (!value) {
            value = min;
            return value;
        }
        value += direction;
        if (value <= min) {
            direction *= -1;
            value = min;
        }
        if (value >= max) {
            direction *= -1;
            value = max;
        }
        return value;
    };
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

