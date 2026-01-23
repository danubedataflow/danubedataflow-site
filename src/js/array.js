import {
    random
} from '/js/math.js';
// call a function with elements [0, 1], then [1, 2] etc.
export function pairwise(array, func) {
    for (let i = 0; i < array.length - 1; i++) {
        func(array[i], array[i + 1]);
    }
}
// https://gist.github.com/motoishmz/5239619
// Fisher-Yates
//
// First copy the array so we don't modify the original array in-place.
export function shuffle(array) {
    const copy = array.slice(); // or [...array]
    let i = copy.length;
    while (i) {
        const j = Math.floor(random() * i);
        const t = copy[--i];
        copy[i] = copy[j];
        copy[j] = t;
    }
    return copy;
};
export function randomElement(array) {
    return array[Math.floor(random() * array.length)];
}
export function arrayFromIntRange(from, to) {
    let result = [];
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
}